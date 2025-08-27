/**
 * Color profile implementation for termenv.
 * Port of github.com/muesli/termenv profile.go to TypeScript.
 */

import { Color as ColorfulColor, Hex } from '@tsports/go-colorful';
import { Style } from './style.js';
import {
  ANSI256Color,
  ANSIColor,
  ansiHex,
  type Color,
  NoColor,
  Profile,
  RGBColor,
} from './types.js';

/**
 * Profile utility functions - matches Go profile.go interface
 */
export const ProfileUtils = {
  /**
   * Get the profile name as a string
   */
  getName(profile: Profile): string {
    switch (profile) {
      case Profile.Ascii:
        return 'Ascii';
      case Profile.ANSI:
        return 'ANSI';
      case Profile.ANSI256:
        return 'ANSI256';
      case Profile.TrueColor:
        return 'TrueColor';
      default:
        return 'Unknown';
    }
  },

  /**
   * Create a new Style with the given profile and strings
   */
  string(profile: Profile, ...strings: string[]): Style {
    return new Style(profile, strings.join(' '));
  },

  /**
   * Convert transforms a given Color to a Color supported within the Profile
   */
  convert(profile: Profile, color: Color): Color {
    if (profile === Profile.Ascii) {
      return new NoColor();
    }

    if (color instanceof ANSIColor) {
      return color;
    }

    if (color instanceof ANSI256Color) {
      if (profile === Profile.ANSI) {
        return ansi256ToANSIColor(color);
      }
      return color;
    }

    if (color instanceof RGBColor) {
      const colorful = Hex(color.hex);
      if (!colorful) {
        return new NoColor();
      }

      if (profile !== Profile.TrueColor) {
        const ansi256Color = hexToANSI256Color(colorful);
        if (profile === Profile.ANSI) {
          return ansi256ToANSIColor(ansi256Color);
        }
        return ansi256Color;
      }
      return color;
    }

    return color;
  },

  /**
   * Create a Color from a string. Valid inputs are hex colors and ANSI color codes (0-255).
   */
  color(profile: Profile, s: string): Color | null {
    if (s.length === 0) {
      return null;
    }

    let color: Color;

    if (s.startsWith('#')) {
      color = new RGBColor(s);
    } else {
      const num = parseInt(s, 10);
      if (Number.isNaN(num)) {
        return null;
      }

      if (num < 16) {
        color = new ANSIColor(num);
      } else {
        color = new ANSI256Color(num);
      }
    }

    return ProfileUtils.convert(profile, color);
  },

  /**
   * Create a Color from a standard Color interface (mimics Go color.Color)
   */
  fromColor(profile: Profile, c: { r: number; g: number; b: number }): Color {
    const colorful = new ColorfulColor(c.r, c.g, c.b);
    const hex = colorful.hex();
    const color = new RGBColor(hex);
    return ProfileUtils.convert(profile, color);
  },
};

/**
 * Convert ANSI256 color to nearest ANSI color using HSLuv distance
 */
function ansi256ToANSIColor(c: ANSI256Color): ANSIColor {
  let result = 0;
  let minDistance = Number.MAX_VALUE;

  const sourceHex = ansiHex[c.value];
  if (!sourceHex) {
    return new ANSIColor(0);
  }

  const sourceColorful = Hex(sourceHex);
  if (!sourceColorful) {
    return new ANSIColor(0);
  }

  // Find closest ANSI color (0-15) using HSLuv distance
  for (let i = 0; i <= 15; i++) {
    const targetHex = ansiHex[i];
    if (!targetHex) continue;

    const targetColorful = Hex(targetHex);
    if (!targetColorful) continue;

    const distance = sourceColorful.distanceHSLuv(targetColorful);
    if (distance < minDistance) {
      minDistance = distance;
      result = i;
    }
  }

  return new ANSIColor(result);
}

/**
 * Convert hex color to nearest ANSI256 color - matches Go implementation exactly
 */
function hexToANSI256Color(c: ColorfulColor): ANSI256Color {
  const v2ci = (v: number): number => {
    const val = v * 255;
    if (val < 48) return 0;
    if (val < 115) return 1;
    return Math.floor((val - 35) / 40);
  };

  // Calculate the nearest 0-based color index at 16..231
  const r = v2ci(c.r); // 0..5 each
  const g = v2ci(c.g);
  const b = v2ci(c.b);
  const colorIndex = 36 * r + 6 * g + b; /* 0..215 */

  // Calculate the represented colors back from the index
  const i2cv = [0, 0x5f, 0x87, 0xaf, 0xd7, 0xff];
  const cr = (i2cv[r] || 0) / 255; // r/g/b, 0..1 each
  const cg = (i2cv[g] || 0) / 255;
  const cb = (i2cv[b] || 0) / 255;

  // Calculate the nearest 0-based gray index at 232..255
  let grayIndex: number;
  const average = (r + g + b) / 3;
  if (average > (238 / 255) * 5) {
    grayIndex = 23;
  } else {
    grayIndex = Math.floor((average * 255 - 3) / 10); // 0..23
  }
  const grayValue = (8 + 10 * grayIndex) / 255; // same value for r/g/b, 0..1

  // Return the one which is nearer to the original input rgb value
  const colorColorful = new ColorfulColor(cr, cg, cb);
  const grayColorful = new ColorfulColor(grayValue, grayValue, grayValue);

  if (!colorColorful || !grayColorful) {
    return new ANSI256Color(16); // fallback
  }

  const colorDistance = c.distanceHSLuv(colorColorful);
  const grayDistance = c.distanceHSLuv(grayColorful);

  if (colorDistance <= grayDistance) {
    return new ANSI256Color(16 + colorIndex);
  }
  return new ANSI256Color(232 + grayIndex);
}

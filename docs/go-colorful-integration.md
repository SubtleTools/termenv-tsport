# @tsports/go-colorful Integration Guide

@tsports/termenv seamlessly integrates with [@tsports/go-colorful](../go-colorful) to provide advanced color manipulation and conversion capabilities. This document explains the integration and how to leverage both packages together.

## 🔗 Integration Overview

termenv uses go-colorful internally for:
- Color space conversions (RGB ↔ HSL ↔ HSV ↔ Lab ↔ Luv ↔ XYZ)
- Color distance calculations for automatic ANSI approximation
- Color blending and harmonization
- Perceptual color operations

## 🎨 Direct go-colorful Usage

### Basic Color Manipulation

```typescript
import { rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

// Create a color in termenv
const termenvColor = rgbColor('#FF6B35');

// Convert to go-colorful format for manipulation
const colorfulColor = convertToRGB(termenvColor);

if (colorfulColor) {
  // Use go-colorful methods
  const [h, s, l] = colorfulColor.hsl();
  console.log(`Original: HSL(${h}, ${s}, ${l})`);
  
  // Create variations
  const lighter = colorfulColor.lightened(0.2);
  const darker = colorfulColor.darkened(0.3);
  const saturated = colorfulColor.saturated(0.1);
  
  // Convert back to termenv colors
  const lighterTermenv = rgbColor(lighter.hex());
  const darkerTermenv = rgbColor(darker.hex());
  const saturatedTermenv = rgbColor(saturated.hex());
  
  // Use in terminal styling
  console.log(string('Original').foreground(termenvColor).toString());
  console.log(string('Lighter').foreground(lighterTermenv).toString());
  console.log(string('Darker').foreground(darkerTermenv).toString());
  console.log(string('Saturated').foreground(saturatedTermenv).toString());
}
```

### Color Harmonies

```typescript
import { rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

const baseColor = convertToRGB(rgbColor('#3498DB'));

if (baseColor) {
  // Generate color harmony
  const complementary = baseColor.complementary();
  const [tri1, tri2] = baseColor.triadic();
  const [analog1, analog2] = baseColor.analogous();
  
  // Display the harmony
  console.log(string('Base').foreground(rgbColor(baseColor.hex())).toString());
  console.log(string('Complementary').foreground(rgbColor(complementary.hex())).toString());
  console.log(string('Triadic 1').foreground(rgbColor(tri1.hex())).toString());
  console.log(string('Triadic 2').foreground(rgbColor(tri2.hex())).toString());
  console.log(string('Analogous 1').foreground(rgbColor(analog1.hex())).toString());
  console.log(string('Analogous 2').foreground(rgbColor(analog2.hex())).toString());
}
```

### Color Blending

```typescript
import { rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

const color1 = convertToRGB(rgbColor('#FF0000')); // Red
const color2 = convertToRGB(rgbColor('#0000FF')); // Blue

if (color1 && color2) {
  // Create a gradient
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const blended = color1.blendRgb(color2, ratio);
    const termenvBlended = rgbColor(blended.hex());
    
    const text = string('████').foreground(termenvBlended);
    process.stdout.write(text.toString());
  }
  console.log(); // New line
}
```

## 🎯 Go-Style API Integration

The go-style API provides seamless integration with go-colorful's Go-compatible API:

```typescript
import { String, RGBColor } from '@tsports/termenv/go-style';
import { Hex, Hsl } from '@tsports/go-colorful/go-style';

// Use go-colorful's Go-style API
const colorfulColor = Hex('#FF6B35');
const [h, s, l] = colorfulColor.Hsl();

// Create variations using go-colorful
const lighter = Hsl(h, s, Math.min(1, l + 0.2));
const darker = Hsl(h, s, Math.max(0, l - 0.2));

// Convert to termenv colors using Go-style API
const baseTermenv = RGBColor(colorfulColor.Hex());
const lighterTermenv = RGBColor(lighter.Hex());
const darkerTermenv = RGBColor(darker.Hex());

// Style text using Go-style API
console.log(String('Original').Foreground(baseTermenv).String());
console.log(String('Lighter').Foreground(lighterTermenv).String());
console.log(String('Darker').Foreground(darkerTermenv).String());
```

## 🌈 Advanced Color Applications

### Dynamic Color Schemes

```typescript
import { rgbColor, string, clearScreen, moveCursor } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

class DynamicTheme {
  private baseColor: ReturnType<typeof convertToRGB>;
  
  constructor(hex: string) {
    this.baseColor = convertToRGB(rgbColor(hex));
  }
  
  getPrimary() {
    return this.baseColor ? rgbColor(this.baseColor.hex()) : rgbColor('#000000');
  }
  
  getSecondary() {
    if (!this.baseColor) return rgbColor('#333333');
    const secondary = this.baseColor.rotateHue(60);
    return rgbColor(secondary.hex());
  }
  
  getAccent() {
    if (!this.baseColor) return rgbColor('#666666');
    const accent = this.baseColor.complementary().saturated(0.2);
    return rgbColor(accent.hex());
  }
  
  getSuccess() {
    if (!this.baseColor) return rgbColor('#00FF00');
    const [h] = this.baseColor.hsl();
    const green = this.baseColor.setHsl(120, 0.7, 0.5); // Green hue
    return rgbColor(green.hex());
  }
  
  getError() {
    if (!this.baseColor) return rgbColor('#FF0000');
    const red = this.baseColor.setHsl(0, 0.8, 0.5); // Red hue
    return rgbColor(red.hex());
  }
  
  demo() {
    clearScreen();
    moveCursor(1, 1);
    
    console.log(string('Primary Color').foreground(this.getPrimary()).bold().toString());
    console.log(string('Secondary Color').foreground(this.getSecondary()).toString());
    console.log(string('Accent Color').foreground(this.getAccent()).toString());
    console.log(string('Success Color').foreground(this.getSuccess()).toString());
    console.log(string('Error Color').foreground(this.getError()).toString());
  }
}

// Usage
const theme = new DynamicTheme('#3498DB');
theme.demo();
```

### Perceptual Color Matching

```typescript
import { ansiColor, rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

function findClosestANSIColor(targetHex: string): number {
  const target = convertToRGB(rgbColor(targetHex));
  if (!target) return 0;
  
  let closestIndex = 0;
  let minDistance = Infinity;
  
  // Check all 16 ANSI colors
  for (let i = 0; i < 16; i++) {
    const ansi = convertToRGB(ansiColor(i));
    if (!ansi) continue;
    
    // Use perceptual distance (Delta E)
    const distance = target.distanceLab(ansi);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }
  
  return closestIndex;
}

// Usage
const targetColor = '#FF6B35';
const closestANSI = findClosestANSIColor(targetColor);

console.log(string('Target Color').foreground(rgbColor(targetColor)).toString());
console.log(string('Closest ANSI').foreground(ansiColor(closestANSI)).toString());
console.log(`Closest ANSI color index: ${closestANSI}`);
```

### Color Accessibility

```typescript
import { rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

function getContrastRatio(color1: string, color2: string): number {
  const c1 = convertToRGB(rgbColor(color1));
  const c2 = convertToRGB(rgbColor(color2));
  
  if (!c1 || !c2) return 1;
  
  // Calculate relative luminance
  const l1 = c1.luminance();
  const l2 = c2.luminance();
  
  // Contrast ratio formula
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function ensureAccessibleContrast(
  foreground: string, 
  background: string, 
  minRatio: number = 4.5
): string {
  const contrast = getContrastRatio(foreground, background);
  
  if (contrast >= minRatio) {
    return foreground;
  }
  
  const fgColor = convertToRGB(rgbColor(foreground));
  const bgColor = convertToRGB(rgbColor(background));
  
  if (!fgColor || !bgColor) return foreground;
  
  // Adjust lightness to meet contrast requirements
  const bgLuminance = bgColor.luminance();
  let adjustedColor = fgColor;
  
  // If background is dark, make foreground lighter
  // If background is light, make foreground darker
  const shouldLighten = bgLuminance < 0.5;
  
  for (let adjustment = 0.1; adjustment <= 1; adjustment += 0.1) {
    adjustedColor = shouldLighten 
      ? fgColor.lightened(adjustment)
      : fgColor.darkened(adjustment);
      
    const newContrast = getContrastRatio(adjustedColor.hex(), background);
    if (newContrast >= minRatio) {
      break;
    }
  }
  
  return adjustedColor.hex();
}

// Usage
const background = '#2C3E50'; // Dark background
const originalForeground = '#3498DB'; // Blue text
const accessibleForeground = ensureAccessibleContrast(originalForeground, background);

console.log('Original combination:');
console.log(string('Sample Text')
  .foreground(rgbColor(originalForeground))
  .background(rgbColor(background))
  .toString());

console.log('Accessible combination:');
console.log(string('Sample Text')
  .foreground(rgbColor(accessibleForeground))
  .background(rgbColor(background))
  .toString());

console.log(`Original contrast: ${getContrastRatio(originalForeground, background).toFixed(2)}`);
console.log(`Improved contrast: ${getContrastRatio(accessibleForeground, background).toFixed(2)}`);
```

## 🔧 Color Space Utilities

### HSL-Based Color Picker

```typescript
import { rgbColor, string, clearScreen, moveCursor } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

class HSLColorPicker {
  private hue: number = 0;
  private saturation: number = 1;
  private lightness: number = 0.5;
  
  setHue(h: number) {
    this.hue = Math.max(0, Math.min(360, h));
    return this;
  }
  
  setSaturation(s: number) {
    this.saturation = Math.max(0, Math.min(1, s));
    return this;
  }
  
  setLightness(l: number) {
    this.lightness = Math.max(0, Math.min(1, l));
    return this;
  }
  
  getCurrentColor() {
    // Create HSL color using go-colorful
    const baseColor = convertToRGB(rgbColor('#FF0000')); // Start with red
    if (!baseColor) return rgbColor('#000000');
    
    const hslColor = baseColor.setHsl(this.hue, this.saturation, this.lightness);
    return rgbColor(hslColor.hex());
  }
  
  showPalette() {
    clearScreen();
    
    // Show current color
    moveCursor(1, 1);
    const current = this.getCurrentColor();
    console.log(string('Current Color: ████████')
      .foreground(current)
      .bold()
      .toString());
    
    // Show hue wheel
    moveCursor(3, 1);
    console.log('Hue Wheel:');
    for (let h = 0; h < 360; h += 15) {
      const tempColor = convertToRGB(rgbColor('#FF0000'))?.setHsl(h, 1, 0.5);
      if (tempColor) {
        const hueColor = rgbColor(tempColor.hex());
        process.stdout.write(string('██').foreground(hueColor).toString());
      }
    }
    console.log();
    
    // Show saturation scale
    moveCursor(5, 1);
    console.log('Saturation Scale:');
    for (let s = 0; s <= 1; s += 0.1) {
      const tempColor = convertToRGB(rgbColor('#FF0000'))?.setHsl(this.hue, s, this.lightness);
      if (tempColor) {
        const satColor = rgbColor(tempColor.hex());
        process.stdout.write(string('██').foreground(satColor).toString());
      }
    }
    console.log();
    
    // Show lightness scale
    moveCursor(7, 1);
    console.log('Lightness Scale:');
    for (let l = 0; l <= 1; l += 0.1) {
      const tempColor = convertToRGB(rgbColor('#FF0000'))?.setHsl(this.hue, this.saturation, l);
      if (tempColor) {
        const lightColor = rgbColor(tempColor.hex());
        process.stdout.write(string('██').foreground(lightColor).toString());
      }
    }
    console.log();
    
    // Show current values
    moveCursor(9, 1);
    console.log(`H: ${this.hue}° S: ${Math.round(this.saturation * 100)}% L: ${Math.round(this.lightness * 100)}%`);
    console.log(`Hex: ${convertToRGB(current)?.hex() || '#000000'}`);
  }
}

// Usage
const picker = new HSLColorPicker();
picker.setHue(210).setSaturation(0.8).setLightness(0.6);
picker.showPalette();
```

## 🎨 Color Temperature and Mood

```typescript
import { rgbColor, string } from '@tsports/termenv';
import { convertToRGB } from '@tsports/termenv';

class ColorMood {
  static getWarmVariant(hex: string): string {
    const color = convertToRGB(rgbColor(hex));
    if (!color) return hex;
    
    // Shift towards orange/red (warm)
    const [h, s, l] = color.hsl();
    const warmerHue = h < 180 ? Math.max(0, h - 15) : Math.min(360, h + 15);
    const warmer = color.setHsl(warmerHue, Math.min(1, s + 0.1), l);
    
    return warmer.hex();
  }
  
  static getCoolVariant(hex: string): string {
    const color = convertToRGB(rgbColor(hex));
    if (!color) return hex;
    
    // Shift towards blue/cyan (cool)
    const [h, s, l] = color.hsl();
    const coolerHue = h < 180 ? Math.min(240, h + 30) : Math.max(180, h - 30);
    const cooler = color.setHsl(coolerHue, Math.min(1, s + 0.1), l);
    
    return cooler.hex();
  }
  
  static getMoodColors(baseHex: string) {
    return {
      energetic: this.getWarmVariant(baseHex),
      calm: this.getCoolVariant(baseHex),
      professional: this.desaturate(baseHex, 0.3),
      playful: this.saturate(baseHex, 0.4),
      elegant: this.darken(baseHex, 0.2),
      fresh: this.lighten(baseHex, 0.2)
    };
  }
  
  private static saturate(hex: string, amount: number): string {
    const color = convertToRGB(rgbColor(hex));
    return color ? color.saturated(amount).hex() : hex;
  }
  
  private static desaturate(hex: string, amount: number): string {
    const color = convertToRGB(rgbColor(hex));
    return color ? color.desaturated(amount).hex() : hex;
  }
  
  private static lighten(hex: string, amount: number): string {
    const color = convertToRGB(rgbColor(hex));
    return color ? color.lightened(amount).hex() : hex;
  }
  
  private static darken(hex: string, amount: number): string {
    const color = convertToRGB(rgbColor(hex));
    return color ? color.darkened(amount).hex() : hex;
  }
}

// Usage
const baseColor = '#3498DB';
const moods = ColorMood.getMoodColors(baseColor);

console.log(string('Original').foreground(rgbColor(baseColor)).toString());
console.log(string('Energetic').foreground(rgbColor(moods.energetic)).toString());
console.log(string('Calm').foreground(rgbColor(moods.calm)).toString());
console.log(string('Professional').foreground(rgbColor(moods.professional)).toString());
console.log(string('Playful').foreground(rgbColor(moods.playful)).toString());
console.log(string('Elegant').foreground(rgbColor(moods.elegant)).toString());
console.log(string('Fresh').foreground(rgbColor(moods.fresh)).toString());
```

## 🔗 Best Practices

### 1. Performance Considerations

```typescript
// Cache color conversions for frequently used colors
const colorCache = new Map<string, ReturnType<typeof convertToRGB>>();

function getCachedColor(hex: string) {
  if (!colorCache.has(hex)) {
    colorCache.set(hex, convertToRGB(rgbColor(hex)));
  }
  return colorCache.get(hex);
}
```

### 2. Error Handling

```typescript
function safeColorOperation(hex: string, operation: (color: NonNullable<ReturnType<typeof convertToRGB>>) => string): string {
  try {
    const color = convertToRGB(rgbColor(hex));
    if (!color) {
      throw new Error(`Invalid color: ${hex}`);
    }
    return operation(color);
  } catch (error) {
    console.warn(`Color operation failed for ${hex}:`, error);
    return hex; // Return original on error
  }
}
```

### 3. Type Safety

```typescript
import type { Color as ColorfulColor } from '@tsports/go-colorful';

function ensureColorfulColor(termenvColor: unknown): ColorfulColor | null {
  const converted = convertToRGB(termenvColor as any);
  return converted;
}
```

## 📚 Further Reading

- [@tsports/go-colorful Documentation](../go-colorful/README.md)
- [Color Theory for Developers](https://blog.datawrapper.de/colorguide/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Terminal Color Support Reference](https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797)

The combination of @tsports/termenv and @tsports/go-colorful provides a powerful toolkit for creating sophisticated, accessible, and beautiful terminal applications with advanced color support.
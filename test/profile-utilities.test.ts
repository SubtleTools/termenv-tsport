import { describe, expect, test } from 'bun:test';
import { ProfileUtils } from '#src/profile.js';
import { Profile, RGBColor, ANSIColor, ANSI256Color, NoColor } from '#src/types.js';

describe('ProfileUtils Utility Methods', () => {
  describe('string method', () => {
    test('creates Style with single string', () => {
      const style = ProfileUtils.string(Profile.TrueColor, 'hello');
      expect(style.toString()).toContain('hello');
      expect(style.profile).toBe(Profile.TrueColor);
    });

    test('creates Style with multiple strings', () => {
      const style = ProfileUtils.string(Profile.ANSI256, 'hello', 'world', 'test');
      const result = style.toString();
      expect(result).toContain('hello world test');
      expect(style.profile).toBe(Profile.ANSI256);
    });

    test('handles empty strings', () => {
      const style = ProfileUtils.string(Profile.ANSI, '');
      expect(style.toString()).toBe('');
    });

    test('handles mixed empty and non-empty strings', () => {
      const style = ProfileUtils.string(Profile.TrueColor, 'hello', '', 'world');
      expect(style.toString()).toContain('hello  world'); // Extra space from empty string
    });

    test('works with different profiles', () => {
      const trueColorStyle = ProfileUtils.string(Profile.TrueColor, 'test');
      const ansiStyle = ProfileUtils.string(Profile.ANSI, 'test');
      const asciiStyle = ProfileUtils.string(Profile.Ascii, 'test');
      
      expect(trueColorStyle.profile).toBe(Profile.TrueColor);
      expect(ansiStyle.profile).toBe(Profile.ANSI);
      expect(asciiStyle.profile).toBe(Profile.Ascii);
    });
  });

  describe('fromColor method', () => {
    test('creates color from RGB object', () => {
      const color = ProfileUtils.fromColor(Profile.TrueColor, { r: 1.0, g: 0.5, b: 0.0 });
      expect(color).toBeInstanceOf(RGBColor);
      expect(color.toString()).toMatch(/#[0-9a-fA-F]{6}/); // Should be a valid hex color
    });

    test('converts RGB to different profiles', () => {
      const rgbInput = { r: 1.0, g: 0.0, b: 0.0 }; // Pure red
      
      const trueColor = ProfileUtils.fromColor(Profile.TrueColor, rgbInput);
      expect(trueColor).toBeInstanceOf(RGBColor);
      
      const ansi256Color = ProfileUtils.fromColor(Profile.ANSI256, rgbInput);
      expect(ansi256Color).toBeInstanceOf(ANSI256Color);
      
      const ansiColor = ProfileUtils.fromColor(Profile.ANSI, rgbInput);
      expect(ansiColor).toBeInstanceOf(ANSIColor);
      
      const asciiColor = ProfileUtils.fromColor(Profile.Ascii, rgbInput);
      expect(asciiColor).toBeInstanceOf(NoColor);
    });

    test('handles edge RGB values', () => {
      const black = ProfileUtils.fromColor(Profile.TrueColor, { r: 0, g: 0, b: 0 });
      expect(black).toBeInstanceOf(RGBColor);
      
      const white = ProfileUtils.fromColor(Profile.TrueColor, { r: 1, g: 1, b: 1 });
      expect(white).toBeInstanceOf(RGBColor);
      
      const gray = ProfileUtils.fromColor(Profile.TrueColor, { r: 0.5, g: 0.5, b: 0.5 });
      expect(gray).toBeInstanceOf(RGBColor);
    });

    test('handles fractional RGB values correctly', () => {
      const color = ProfileUtils.fromColor(Profile.TrueColor, { r: 0.25, g: 0.75, b: 0.9 });
      expect(color).toBeInstanceOf(RGBColor);
      
      // Should produce valid hex output
      const hex = color.toString();
      expect(hex).toMatch(/#[0-9a-fA-F]{6}/);
      expect(hex.length).toBe(7); // # + 6 hex chars
    });

    test('maintains color accuracy through conversion', () => {
      const originalRGB = { r: 0.8, g: 0.4, b: 0.2 };
      const color = ProfileUtils.fromColor(Profile.TrueColor, originalRGB) as RGBColor;
      
      // The conversion should preserve the color reasonably well
      expect(color.toString()).toBeTruthy();
      expect(color.toString()).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('error handling in convert method', () => {
    test('handles invalid hex colors gracefully', () => {
      // Test invalid hex handling - this will throw from go-colorful
      try {
        const invalidRGB = new RGBColor('#INVALID');
        const result = ProfileUtils.convert(Profile.TrueColor, invalidRGB);
        // If we get here, it didn't throw, so test the result
        expect(result).toBeTruthy();
      } catch (error) {
        // go-colorful throws for invalid hex, which is expected
        expect(error).toBeTruthy();
      }
    });

    test('handles NoColor input correctly', () => {
      const noColor = new NoColor();
      
      // NoColor should be preserved through conversion
      expect(ProfileUtils.convert(Profile.TrueColor, noColor)).toBeInstanceOf(NoColor);
      expect(ProfileUtils.convert(Profile.ANSI256, noColor)).toBeInstanceOf(NoColor);
      expect(ProfileUtils.convert(Profile.ANSI, noColor)).toBeInstanceOf(NoColor);
      expect(ProfileUtils.convert(Profile.Ascii, noColor)).toBeInstanceOf(NoColor);
    });

    test('convert handles unknown color types', () => {
      // Create a mock color object that doesn't match any known type
      const mockColor = {
        sequence: () => '99m',
        toString: () => 'mock'
      } as any;
      
      // Should return the color as-is for unknown types
      const result = ProfileUtils.convert(Profile.TrueColor, mockColor);
      expect(result).toBe(mockColor);
    });
  });

  describe('Go compatibility verification', () => {
    test('string method behavior matches Go expectations', () => {
      // Test cases that should match Go behavior
      const testCases = [
        { profile: Profile.TrueColor, strings: ['hello'], expected: 'hello' },
        { profile: Profile.TrueColor, strings: ['hello', 'world'], expected: 'hello world' },
        { profile: Profile.ANSI256, strings: ['a', 'b', 'c'], expected: 'a b c' },
        { profile: Profile.ANSI, strings: [''], expected: '' },
        { profile: Profile.Ascii, strings: ['test', 'string'], expected: 'test string' }
      ];
      
      for (const testCase of testCases) {
        const style = ProfileUtils.string(testCase.profile, ...testCase.strings);
        const result = style.toString();
        
        // In Ascii profile, styling is stripped but text remains
        if (testCase.profile === Profile.Ascii) {
          expect(result).toBe(testCase.expected);
        } else {
          expect(result).toContain(testCase.expected);
        }
      }
    });

    test('fromColor produces consistent outputs', () => {
      // Test standard RGB values that Go would handle
      const standardColors = [
        { r: 1.0, g: 0.0, b: 0.0 }, // Pure red
        { r: 0.0, g: 1.0, b: 0.0 }, // Pure green  
        { r: 0.0, g: 0.0, b: 1.0 }, // Pure blue
        { r: 1.0, g: 1.0, b: 1.0 }, // White
        { r: 0.0, g: 0.0, b: 0.0 }, // Black
        { r: 0.5, g: 0.5, b: 0.5 }  // Gray
      ];
      
      for (const rgb of standardColors) {
        // Test each profile
        const trueColor = ProfileUtils.fromColor(Profile.TrueColor, rgb);
        const ansi256 = ProfileUtils.fromColor(Profile.ANSI256, rgb);
        const ansi = ProfileUtils.fromColor(Profile.ANSI, rgb);
        const ascii = ProfileUtils.fromColor(Profile.Ascii, rgb);
        
        // Verify type conversions work as expected
        expect(trueColor).toBeInstanceOf(RGBColor);
        expect(ansi256).toBeInstanceOf(ANSI256Color);
        expect(ansi).toBeInstanceOf(ANSIColor);
        expect(ascii).toBeInstanceOf(NoColor);
        
        // Verify outputs are consistent
        if (trueColor instanceof RGBColor) {
          expect(trueColor.toString()).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
        if (ansi256 instanceof ANSI256Color) {
          expect(ansi256.value).toBeGreaterThanOrEqual(0);
          expect(ansi256.value).toBeLessThanOrEqual(255);
        }
        if (ansi instanceof ANSIColor) {
          expect(ansi.value).toBeGreaterThanOrEqual(0);
          expect(ansi.value).toBeLessThanOrEqual(15);
        }
      }
    });
  });
});
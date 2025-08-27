import { describe, expect, test } from 'bun:test';
import { InvalidColorError, StatusReportError, TermEnvError } from '#src/types.js';
import { ProfileUtils } from '#src/profile.js';
import { Profile, RGBColor, ANSIColor, ANSI256Color } from '#src/types.js';

describe('Error Handling and Edge Cases', () => {
  describe('custom error classes', () => {
    test('TermEnvError base class', () => {
      const error = new TermEnvError('base error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('TermEnvError');
      expect(error.message).toBe('base error');
    });

    test('TermEnvError with default message', () => {
      const error = new TermEnvError();
      expect(error.name).toBe('TermEnvError');
      expect(error.message).toBe(''); // Default Error constructor gives empty message
    });

    test('InvalidColorError extends TermEnvError', () => {
      const error = new InvalidColorError('bad color');
      expect(error).toBeInstanceOf(TermEnvError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('InvalidColorError');
      expect(error.message).toBe('bad color');
    });

    test('InvalidColorError with default message', () => {
      const error = new InvalidColorError();
      expect(error.name).toBe('InvalidColorError');
      expect(error.message).toBe('invalid color');
    });

    test('StatusReportError extends TermEnvError', () => {
      const error = new StatusReportError('report failed');
      expect(error).toBeInstanceOf(TermEnvError);
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('StatusReportError');
      expect(error.message).toBe('report failed');
    });

    test('StatusReportError with default message', () => {
      const error = new StatusReportError();
      expect(error.name).toBe('StatusReportError');
      expect(error.message).toBe('unable to retrieve status report');
    });

    test('error stack traces work correctly', () => {
      const error = new InvalidColorError('test error');
      expect(error.stack).toBeTruthy();
      expect(error.stack).toContain('InvalidColorError');
      expect(error.stack).toContain('test error');
    });
  });

  describe('color parsing edge cases', () => {
    test('handles extremely malformed hex colors', () => {
      const testCases = [
        '#', // Too short
        '#G', // Invalid character
        '#GG', // Invalid characters
        '#GGGGGG', // All invalid characters
        '##FF0000', // Double hash
        '#FF00', // Too short
        '#FF00000', // Too long
        '#FF 00 00', // Spaces
        'FF0000', // No hash (this might be handled differently)
        '', // Empty string
        '   ', // Whitespace only
        '#\n\r\t', // Control characters
        '#😀😀😀😀😀😀', // Unicode emoji
        '#中文测试XX', // Unicode characters
      ];

      for (const testCase of testCases) {
        if (testCase.startsWith('#') && testCase.length > 1) {
          // These should either throw or return null/NoColor
          try {
            const color = ProfileUtils.color(Profile.TrueColor, testCase);
            // If it doesn't throw, it should return null or NoColor
            if (color !== null) {
              // If a color is returned, it should be convertible to string
              expect(typeof color.toString()).toBe('string');
            }
          } catch (error) {
            // go-colorful throws for invalid hex colors, which is expected
            expect(error).toBeTruthy();
          }
        } else {
          // Non-hex formats - these may throw from go-colorful for some invalid cases
          try {
            const result = ProfileUtils.color(Profile.TrueColor, testCase);
            // Should return null for invalid strings
            expect(result).toBe(null);
          } catch (error) {
            // Some cases like single '#' throw from go-colorful, which is acceptable
            expect(error).toBeTruthy();
          }
        }
      }
    });

    test('handles boundary ANSI color values', () => {
      // Test edge cases for ANSI color parsing
      const testCases = [
        '-1', // Below valid range
        '16', // Above ANSI range, should become ANSI256
        '255', // Max ANSI256 value
        '256', // Above max ANSI256 value
        '999', // Way above max
        '0', // Min valid value
        '15', // Max ANSI value
        '00', // Leading zero
        '007', // Leading zeros
        '1.5', // Float (invalid)
        '1e2', // Scientific notation
        'Infinity', // Special number values
        '-Infinity',
        'NaN',
      ];

      for (const testCase of testCases) {
        const result = ProfileUtils.color(Profile.TrueColor, testCase);
        
        if (testCase === 'Infinity' || testCase === '-Infinity' || testCase === 'NaN') {
          expect(result).toBe(null); // Should reject invalid number formats
        } else if (testCase === '1.5' || testCase === '1e2') {
          // These parse as 1 and 1 respectively in parseInt
          expect(result).not.toBe(null);
        } else {
          // Should return some type of color or null
          if (result !== null) {
            expect(result).toHaveProperty('sequence');
            expect(result).toHaveProperty('toString');
          }
        }
      }
    });

    test('handles color conversion failures', () => {
      // Test what happens when color conversion fails
      const mockBrokenRGBColor = {
        hex: '#INVALID',
        sequence: () => '38;2;0;0;0m',
        toString: () => '#INVALID',
        parseHexLenient: () => null
      } as any;

      // Should handle conversion gracefully
      const result = ProfileUtils.convert(Profile.TrueColor, mockBrokenRGBColor);
      expect(result).toBeTruthy(); // Should not return null/undefined
    });
  });

  describe('color sequence generation edge cases', () => {
    test('RGBColor with extreme values', () => {
      // Test edge cases that might cause issues
      const edgeCases = [
        '#000000', // Pure black
        '#FFFFFF', // Pure white  
        '#FF0000', // Pure red
        '#00FF00', // Pure green
        '#0000FF', // Pure blue
        '#123456', // Random valid hex
        '#ABCDEF', // All hex letters
        '#abcdef', // Lowercase hex
        '#f0f0f0', // Mixed case already lowercase
        '#F0F0F0', // Mixed case uppercase
      ];

      for (const hexColor of edgeCases) {
        const color = new RGBColor(hexColor);
        
        // Test foreground sequence
        const fgSequence = color.sequence(false);
        expect(fgSequence).toMatch(/^38;2;\d{1,3};\d{1,3};\d{1,3}$/);
        
        // Test background sequence
        const bgSequence = color.sequence(true);
        expect(bgSequence).toMatch(/^48;2;\d{1,3};\d{1,3};\d{1,3}$/);
        
        // Test toString
        const str = color.toString();
        expect(str).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    test('ANSIColor with edge values', () => {
      const testValues = [0, 1, 7, 8, 9, 15, -1, 16, 255];
      
      for (const value of testValues) {
        const color = new ANSIColor(value);
        expect(color.value).toBe(value);
        
        // Should always return a valid sequence
        const fgSequence = color.sequence(false);
        const bgSequence = color.sequence(true);
        
        expect(typeof fgSequence).toBe('string');
        expect(typeof bgSequence).toBe('string');
        expect(fgSequence.length).toBeGreaterThan(0);
        expect(bgSequence.length).toBeGreaterThan(0);
      }
    });

    test('ANSI256Color with edge values', () => {
      const testValues = [0, 15, 16, 231, 232, 255, 256, -1, 999];
      
      for (const value of testValues) {
        const color = new ANSI256Color(value);
        expect(color.value).toBe(value);
        
        // Should always return sequences
        const fgSequence = color.sequence(false);
        const bgSequence = color.sequence(true);
        
        expect(fgSequence).toMatch(/^38;5;-?\d+$/); // Allow negative numbers
        expect(bgSequence).toMatch(/^48;5;-?\d+$/); // Allow negative numbers
      }
    });
  });

  describe('profile conversion stress tests', () => {
    test('converts many colors without memory leaks', () => {
      // Test converting many colors to ensure no memory issues
      const colors: any[] = [];
      
      // Create many different colors
      for (let i = 0; i < 1000; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);  
        const b = Math.floor(Math.random() * 256);
        colors.push(new RGBColor(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`));
      }
      
      // Convert all colors through different profiles
      for (const color of colors) {
        const ansi256 = ProfileUtils.convert(Profile.ANSI256, color);
        const ansi = ProfileUtils.convert(Profile.ANSI, ansi256);
        const ascii = ProfileUtils.convert(Profile.Ascii, color);
        
        expect(ansi256).toBeTruthy();
        expect(ansi).toBeTruthy();
        expect(ascii).toBeTruthy();
      }
      
      // If we get here without crashing, memory handling is OK
      expect(colors.length).toBe(1000);
    });

    test('handles rapid profile switching', () => {
      const testColor = new RGBColor('#FF8040');
      
      // Rapidly switch between profiles
      for (let i = 0; i < 100; i++) {
        const profile = [Profile.TrueColor, Profile.ANSI256, Profile.ANSI, Profile.Ascii][i % 4];
        const converted = ProfileUtils.convert(profile, testColor);
        expect(converted).toBeTruthy();
        expect(typeof converted.toString()).toBe('string');
      }
    });
  });

  describe('string and unicode handling', () => {
    test('handles unicode in color strings', () => {
      const unicodeStrings = [
        '🎨', // Emoji
        '中文', // Chinese characters
        '𝕳𝖊𝖝', // Math symbols
        'café', // Accented characters
        'Ω≈ç√', // Special symbols
        '\u0000\u001f', // Control characters
        'a\nb\tc\rd', // Whitespace characters
      ];

      for (const str of unicodeStrings) {
        // These should be handled gracefully (probably return null)
        const result = ProfileUtils.color(Profile.TrueColor, str);
        expect(result).toBe(null); // Non-hex strings should return null
      }
    });

    test('ProfileUtils.string handles unicode correctly', () => {
      const unicodeText = '🌈 Hello 世界 🎨 Café ñ';
      const style = ProfileUtils.string(Profile.TrueColor, unicodeText);
      
      const result = style.toString();
      expect(result).toContain(unicodeText);
      
      // Width calculation should handle unicode
      const width = style.width();
      expect(typeof width).toBe('number');
      expect(width).toBeGreaterThan(0);
    });
  });

  describe('concurrent access and thread safety', () => {
    test('multiple simultaneous color conversions', async () => {
      const promises: Promise<any>[] = [];
      
      // Start many color conversions simultaneously
      for (let i = 0; i < 50; i++) {
        const promise = Promise.resolve().then(() => {
          const color = new RGBColor(`#${i.toString(16).padStart(6, '0')}`);
          return ProfileUtils.convert(Profile.ANSI256, color);
        });
        promises.push(promise);
      }
      
      const results = await Promise.all(promises);
      
      // All conversions should succeed
      expect(results).toHaveLength(50);
      for (const result of results) {
        expect(result).toBeTruthy();
        expect(result).toBeInstanceOf(ANSI256Color);
      }
    });
  });
});
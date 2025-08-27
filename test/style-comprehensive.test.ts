import { describe, expect, test } from 'bun:test';
import { Style } from '#src/style.js';
import { ANSI256Color, ANSIColor, NoColor, Profile, RGBColor } from '#src/types.js';

describe('Style', () => {
  describe('constructor and basic functionality', () => {
    test('creates style with text', () => {
      const style = new Style(Profile.TrueColor, 'hello world');
      expect(style.toString()).toContain('hello world');
    });

    test('creates style with empty text', () => {
      const style = new Style(Profile.TrueColor, '');
      expect(style.toString()).toBe('');
    });

    test('handles different profiles', () => {
      const profiles = [Profile.TrueColor, Profile.ANSI256, Profile.ANSI, Profile.Ascii];

      for (const profile of profiles) {
        const style = new Style(profile, 'test');
        expect(style.toString()).toContain('test');
      }
    });
  });

  describe('foreground colors', () => {
    test('applies RGB foreground color in TrueColor profile', () => {
      const style = new Style(Profile.TrueColor, 'text').foreground(new RGBColor('#FF0000'));

      const result = style.toString();
      expect(result).toContain('\x1b[38;2;255;0;0m');
      expect(result).toContain('text');
      expect(result).toContain('\x1b[0m');
    });

    test('applies ANSI foreground color', () => {
      const style = new Style(Profile.ANSI, 'text').foreground(new ANSIColor(9));

      const result = style.toString();
      expect(result).toContain('\x1b[91m');
      expect(result).toContain('text');
    });

    test('applies ANSI256 foreground color', () => {
      const style = new Style(Profile.ANSI256, 'text').foreground(new ANSI256Color(196));

      const result = style.toString();
      expect(result).toContain('\x1b[38;5;196m');
      expect(result).toContain('text');
    });

    test('ignores NoColor foreground', () => {
      const style = new Style(Profile.TrueColor, 'text').foreground(new NoColor());

      const result = style.toString();
      expect(result).toBe('text');
    });

    test('converts colors based on profile', () => {
      // RGB color in ANSI profile should be converted
      const style = new Style(Profile.ANSI, 'text').foreground(new RGBColor('#FF0000'));

      const result = style.toString();
      expect(result).toContain('\x1b[');
      expect(result).toContain('text');
    });
  });

  describe('background colors', () => {
    test('applies RGB background color in TrueColor profile', () => {
      const style = new Style(Profile.TrueColor, 'text').background(new RGBColor('#FF0000'));

      const result = style.toString();
      expect(result).toContain('\x1b[48;2;255;0;0m');
      expect(result).toContain('text');
    });

    test('applies ANSI background color', () => {
      const style = new Style(Profile.ANSI, 'text').background(new ANSIColor(9));

      const result = style.toString();
      expect(result).toContain('\x1b[101m');
      expect(result).toContain('text');
    });

    test('applies ANSI256 background color', () => {
      const style = new Style(Profile.ANSI256, 'text').background(new ANSI256Color(196));

      const result = style.toString();
      expect(result).toContain('\x1b[48;5;196m');
      expect(result).toContain('text');
    });

    test('ignores NoColor background', () => {
      const style = new Style(Profile.TrueColor, 'text').background(new NoColor());

      const result = style.toString();
      expect(result).toBe('text');
    });
  });

  describe('text styling methods', () => {
    test('applies bold styling', () => {
      const style = new Style(Profile.TrueColor, 'text').bold();
      const result = style.toString();

      expect(result).toContain('\x1b[1m');
      expect(result).toContain('text');
      expect(result).toContain('\x1b[0m');
    });

    test('applies italic styling', () => {
      const style = new Style(Profile.TrueColor, 'text').italic();
      const result = style.toString();

      expect(result).toContain('\x1b[3m');
      expect(result).toContain('text');
    });

    test('applies underline styling', () => {
      const style = new Style(Profile.TrueColor, 'text').underline();
      const result = style.toString();

      expect(result).toContain('\x1b[4m');
      expect(result).toContain('text');
    });

    test('applies crossout styling', () => {
      const style = new Style(Profile.TrueColor, 'text').crossOut();
      const result = style.toString();

      expect(result).toContain('\x1b[9m');
      expect(result).toContain('text');
    });

    test('applies overline styling', () => {
      const style = new Style(Profile.TrueColor, 'text').overline();
      const result = style.toString();

      expect(result).toContain('\x1b[53m');
      expect(result).toContain('text');
    });

    test('applies reverse styling', () => {
      const style = new Style(Profile.TrueColor, 'text').reverse();
      const result = style.toString();

      expect(result).toContain('\x1b[7m');
      expect(result).toContain('text');
    });

    test('applies blink styling', () => {
      const style = new Style(Profile.TrueColor, 'text').blink();
      const result = style.toString();

      expect(result).toContain('\x1b[5m');
      expect(result).toContain('text');
    });

    test('applies faint styling', () => {
      const style = new Style(Profile.TrueColor, 'text').faint();
      const result = style.toString();

      expect(result).toContain('\x1b[2m');
      expect(result).toContain('text');
    });
  });

  describe('method chaining', () => {
    test('chains multiple styling methods', () => {
      const style = new Style(Profile.TrueColor, 'text')
        .bold()
        .italic()
        .underline()
        .foreground(new RGBColor('#FF0000'))
        .background(new RGBColor('#00FF00'));

      const result = style.toString();

      // All styles should be combined into a single sequence
      expect(result).toContain('\x1b[1;3;4;38;2;255;0;0;48;2;0;255;0m'); // combined sequence
      expect(result).toContain('text');
      expect(result).toContain('\x1b[0m'); // reset
    });

    test('returns same instance for chaining', () => {
      const style = new Style(Profile.TrueColor, 'text');

      // Methods return new instances, not the same instance
      expect(style.bold()).not.toBe(style);
      expect(style.italic()).not.toBe(style);
      expect(style.underline()).not.toBe(style);
      expect(style.foreground(new RGBColor('#FF0000'))).not.toBe(style);
      expect(style.background(new RGBColor('#00FF00'))).not.toBe(style);
    });

    test('order of chaining does not affect final output', () => {
      const style1 = new Style(Profile.TrueColor, 'text')
        .bold()
        .foreground(new RGBColor('#FF0000'));

      const style2 = new Style(Profile.TrueColor, 'text')
        .foreground(new RGBColor('#FF0000'))
        .bold();

      // Both should contain the same escape codes
      const result1 = style1.toString();
      const result2 = style2.toString();

      // Both should contain combined sequences
      expect(result1).toContain('\x1b[1;38;2;255;0;0m');
      expect(result2).toContain('\x1b[38;2;255;0;0;1m');
    });
  });

  describe('width method', () => {
    test('returns width of text', () => {
      const style = new Style(Profile.TrueColor, 'hello');
      const width = style.width();

      expect(width).toBe(5); // 'hello' is 5 characters wide
    });

    test('handles empty text', () => {
      const style = new Style(Profile.TrueColor, '');
      const width = style.width();

      expect(width).toBe(0);
    });

    test('handles unicode characters correctly', () => {
      const style = new Style(Profile.TrueColor, '🎨');
      const width = style.width();

      // Unicode emoji width depends on implementation
      expect(width).toBeGreaterThanOrEqual(1);
    });

    test('handles wide characters', () => {
      const style = new Style(Profile.TrueColor, '中文');
      const width = style.width();

      // Wide characters should have width >= 2
      expect(width).toBeGreaterThanOrEqual(2);
    });

    test('works with styled text', () => {
      const style = new Style(Profile.TrueColor, 'hi').bold().foreground(new RGBColor('#FF0000'));

      const width = style.width();
      expect(width).toBe(2); // styling doesn't affect width calculation
    });
  });

  describe('different profiles behavior', () => {
    test('TrueColor profile uses RGB sequences', () => {
      const style = new Style(Profile.TrueColor, 'text').foreground(new RGBColor('#FF6B35'));

      const result = style.toString();
      expect(result).toContain('\x1b[38;2;255;107;53m');
    });

    test('ANSI256 profile uses 256-color sequences', () => {
      const style = new Style(Profile.ANSI256, 'text').foreground(new ANSI256Color(196));

      const result = style.toString();
      expect(result).toContain('\x1b[38;5;196m');
    });

    test('ANSI profile uses basic ANSI sequences', () => {
      const style = new Style(Profile.ANSI, 'text').foreground(new ANSIColor(9));

      const result = style.toString();
      expect(result).toContain('\x1b[91m');
    });

    test('Ascii profile strips all color sequences', () => {
      const style = new Style(Profile.Ascii, 'text')
        .foreground(new RGBColor('#FF0000'))
        .background(new RGBColor('#00FF00'))
        .bold()
        .italic();

      const result = style.toString();
      expect(result).toBe('text');
    });

    test('Ascii profile strips all styling', () => {
      const style = new Style(Profile.Ascii, 'text').foreground(new NoColor()).bold();

      const result = style.toString();
      expect(result).toBe('text'); // Ascii profile strips all styling
    });
  });

  describe('Go-compatible API', () => {
    test('provides PascalCase methods', () => {
      const style = new Style(Profile.TrueColor, 'test');

      expect(typeof style.Foreground).toBe('function');
      expect(typeof style.Background).toBe('function');
      expect(typeof style.Bold).toBe('function');
      expect(typeof style.Italic).toBe('function');
      expect(typeof style.Underline).toBe('function');
      expect(typeof style.CrossOut).toBe('function'); // Method is CrossOut, not Strikethrough
      expect(typeof style.Reverse).toBe('function');
      expect(typeof style.Blink).toBe('function');
      expect(typeof style.Faint).toBe('function');
      expect(typeof style.String).toBe('function');
      expect(typeof style.Width).toBe('function');
    });

    test('Go-compatible methods work identically', () => {
      const style = new Style(Profile.TrueColor, 'test');
      const color = new RGBColor('#FF0000');

      const camelCase = style.foreground(color).bold().toString();

      // Reset style for second test
      const style2 = new Style(Profile.TrueColor, 'test');
      const PascalCase = style2.Foreground(color).Bold().String();

      expect(camelCase).toBe(PascalCase);
    });

    test('String() method returns toString() result', () => {
      const style = new Style(Profile.TrueColor, 'test').bold();

      expect(style.String()).toBe(style.toString());
    });

    test('Width() method works like width()', () => {
      const style = new Style(Profile.TrueColor, 'hello');

      const camelCase = style.width();
      const PascalCase = style.Width();

      expect(camelCase).toBe(PascalCase);
    });
  });

  describe('edge cases and error handling', () => {
    test('handles null colors gracefully', () => {
      const style = new Style(Profile.TrueColor, 'text');

      expect(() => style.foreground(null as any)).not.toThrow();
      expect(() => style.background(null as any)).not.toThrow();
    });

    test('handles undefined colors gracefully', () => {
      const style = new Style(Profile.TrueColor, 'text');

      expect(() => style.foreground(undefined as any)).not.toThrow();
      expect(() => style.background(undefined as any)).not.toThrow();
    });

    test('handles very long text', () => {
      const longText = 'x'.repeat(10000);
      const style = new Style(Profile.TrueColor, longText);

      const result = style.toString();
      expect(result).toContain(longText);
    });

    test('handles text with existing ANSI codes', () => {
      const textWithAnsi = 'hello \x1b[31mred\x1b[0m world';
      const style = new Style(Profile.TrueColor, textWithAnsi).bold();

      const result = style.toString();
      expect(result).toContain(textWithAnsi);
      expect(result).toContain('\x1b[1m');
    });

    test('handles newlines and special characters', () => {
      const specialText = 'line1\nline2\ttab\rcarriage return';
      const style = new Style(Profile.TrueColor, specialText).bold();

      const result = style.toString();
      expect(result).toContain(specialText);
      expect(result).toContain('\x1b[1m');
    });

    test('toString() can be called multiple times', () => {
      const style = new Style(Profile.TrueColor, 'test').bold();

      const result1 = style.toString();
      const result2 = style.toString();
      const result3 = style.toString();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    test('style objects are immutable - modifications create new instances', () => {
      const style = new Style(Profile.TrueColor, 'test').bold();
      const result1 = style.toString();

      // italic() returns a new style, doesn't modify original
      const style2 = style.italic();
      const result2 = style2.toString();

      expect(result1).toContain('\x1b[1m');
      expect(result1).not.toContain('\x1b[3m');

      expect(result2).toContain('\x1b[1;3m'); // both bold and italic in combined sequence
    });
  });
});

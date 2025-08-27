import { describe, expect, test } from 'bun:test';
import { Style } from '#src/style.js';
import { ANSIColor, Profile, RGBColor } from '#src/types.js';

describe('Style Go-compatible Methods', () => {
  test('all Go-compatible PascalCase methods exist and work', () => {
    const style = new Style(Profile.TrueColor, 'test');

    // Test each Go-compatible method
    const foregroundStyle = style.Foreground(new RGBColor('#FF0000'));
    expect(foregroundStyle).toBeInstanceOf(Style);

    const backgroundStyle = style.Background(new ANSIColor(4));
    expect(backgroundStyle).toBeInstanceOf(Style);

    const boldStyle = style.Bold();
    expect(boldStyle).toBeInstanceOf(Style);

    const faintStyle = style.Faint();
    expect(faintStyle).toBeInstanceOf(Style);

    const italicStyle = style.Italic();
    expect(italicStyle).toBeInstanceOf(Style);

    const underlineStyle = style.Underline();
    expect(underlineStyle).toBeInstanceOf(Style);

    const overlineStyle = style.Overline();
    expect(overlineStyle).toBeInstanceOf(Style);

    const blinkStyle = style.Blink();
    expect(blinkStyle).toBeInstanceOf(Style);

    const reverseStyle = style.Reverse();
    expect(reverseStyle).toBeInstanceOf(Style);

    const crossOutStyle = style.CrossOut();
    expect(crossOutStyle).toBeInstanceOf(Style);
  });

  test('Go methods produce identical results to camelCase methods', () => {
    const style1 = new Style(Profile.TrueColor, 'test');
    const style2 = new Style(Profile.TrueColor, 'test');

    const color = new RGBColor('#00FF00');

    // Compare camelCase vs PascalCase
    const camelResult = style1.foreground(color).bold().italic().toString();
    const pascalResult = style2.Foreground(color).Bold().Italic().toString();

    expect(camelResult).toBe(pascalResult);
  });

  test('String method returns same as toString', () => {
    const style = new Style(Profile.TrueColor, 'hello world').bold();

    expect(style.String()).toBe(style.toString());
  });

  test('Width method returns numeric width', () => {
    const style = new Style(Profile.TrueColor, 'hello');

    const width = style.Width();
    expect(typeof width).toBe('number');
    expect(width).toBe(5);

    // Should match camelCase version
    expect(style.Width()).toBe(style.width());
  });

  test('chaining with Go methods works correctly', () => {
    const result = new Style(Profile.TrueColor, 'chain test')
      .Bold()
      .Italic()
      .Foreground(new RGBColor('#FF00FF'))
      .toString();

    expect(result).toContain('chain test');
    expect(result).toContain('\x1b['); // Has ANSI sequences
    expect(result).toContain('\x1b[0m'); // Has reset
  });
});

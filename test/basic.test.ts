import { describe, expect, test } from 'bun:test';
// Test imports from Go-style API
import { ColorProfile as GoColorProfile, String as GoString } from '../src/go-style.js';
// Test imports from main package (termenv API)
import {
  ansiColor,
  colorProfile,
  newOutput,
  Profile,
  rgbColor,
  string,
  TermEnvError,
  withTTY,
} from '../src/index.js';

describe('Package Imports', () => {
  test('TypeScript-native API imports correctly', () => {
    // Test core termenv functions
    expect(typeof colorProfile).toBe('function');
    expect(typeof string).toBe('function');
    expect(typeof rgbColor).toBe('function');
    expect(typeof ansiColor).toBe('function');

    // Test Profile enum
    expect(Profile.TrueColor).toBeDefined();
    expect(Profile.ANSI256).toBeDefined();
    expect(Profile.ANSI).toBeDefined();
    expect(Profile.Ascii).toBeDefined();

    // Test error class import
    const error = new TermEnvError('test error');
    expect(error.message).toBe('test error');
    expect(error.name).toBe('TermEnvError');
  });

  test('Go-style API imports correctly', () => {
    // Test Go-style function imports
    expect(typeof GoColorProfile).toBe('function');
    expect(typeof GoString).toBe('function');
  });

  test('Type imports work correctly', () => {
    // Test Color interface usage
    const redColor = rgbColor('#FF0000');
    expect(redColor).toBeDefined();
    expect(typeof redColor.sequence).toBe('function');
    expect(typeof redColor.toString).toBe('function');

    // Test ANSI color
    const blueColor = ansiColor(4); // Blue
    expect(blueColor).toBeDefined();
    expect(blueColor.value).toBe(4);
  });
});

describe('Basic Functionality', () => {
  test('color profile detection works', () => {
    const profile = colorProfile();
    expect(typeof profile).toBe('number');
    expect([Profile.Ascii, Profile.ANSI, Profile.ANSI256, Profile.TrueColor]).toContain(profile);
  });

  test('string styling works', () => {
    const styled = string('Hello World');
    expect(styled).toBeDefined();
    expect(typeof styled.toString).toBe('function');
    expect(typeof styled.bold).toBe('function');
    expect(typeof styled.foreground).toBe('function');
  });

  test('color creation works', () => {
    // RGB color
    const red = rgbColor('#FF0000');
    expect(red.hex).toBe('#FF0000');

    // ANSI color
    const blue = ansiColor(4);
    expect(blue.value).toBe(4);
  });

  test('styling chain works', () => {
    // Set FORCE_COLOR for this test to ensure colors are enabled
    const originalForceColor = process.env.FORCE_COLOR;
    process.env.FORCE_COLOR = '3';

    try {
      // Create a new output instance to pick up the environment change
      const output = newOutput(process.stdout, withTTY(true)); // Force TTY for testing

      const styled = output.string('Test').bold().foreground(rgbColor('#FF0000')).italic();

      const result = styled.toString();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThanOrEqual('Test'.length); // May have ANSI codes depending on environment
    } finally {
      // Restore original environment
      if (originalForceColor !== undefined) {
        process.env.FORCE_COLOR = originalForceColor;
      } else {
        process.env.FORCE_COLOR = undefined;
      }
    }
  });
});

describe('Go Compatibility', () => {
  test('Go-style API works identically', () => {
    // Test that Go-style functions exist and work
    const profile1 = colorProfile();
    const profile2 = GoColorProfile();
    expect(profile1).toBe(profile2);

    // Test string creation
    const styled1 = string('Test');
    const styled2 = GoString('Test');
    expect(styled1.string).toBe(styled2.string);
    expect(styled1.profile).toBe(styled2.profile);
  });

  test('Both APIs produce equivalent output', () => {
    // Create identical styling with both APIs
    const tsStyled = string('Hello').bold().foreground(rgbColor('#FF0000'));

    const goStyled = GoString('Hello').bold().foreground(rgbColor('#FF0000'));

    // Should produce same output
    expect(tsStyled.toString()).toBe(goStyled.toString());
  });
});

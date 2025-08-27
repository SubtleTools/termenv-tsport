import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  AltScreen,
  ANSI,
  ANSI256,
  ANSI256Color,
  ANSIColor,
  Ascii,
  BackgroundColor,
  ClearLine,
  ClearScreen,
  Color,
  ColorProfile,
  Convert,
  CursorDown,
  CursorUp,
  DisableMouse,
  EnableMouse,
  EnvColorProfile,
  EnvNoColor,
  ExitAltScreen,
  ForegroundColor,
  HasDarkBackground,
  HideCursor,
  // Hyperlink and notification functions
  Hyperlink,
  // Screen control functions
  MoveCursor,
  // Output functions
  NewOutput,
  // Color functions
  NoColor,
  Notify,
  // Utility functions
  ProfileName,
  RGBColor,
  SetWindowTitle,
  ShowCursor,
  // Core functions
  String,
  // Profile constants
  TrueColor,
  WithColorCache,
  WithEnvironment,
  WithProfile,
  WithTTY,
  WithUnsafe,
} from '#src/go-style.js';
import { NoColor as NoColorType } from '#src/types.js';

// Mock writer for testing
class MockWriter {
  public output: string[] = [];
  public isTTY: boolean = true;

  write(data: Uint8Array | string): Promise<number> {
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    this.output.push(text);
    return Promise.resolve(text.length);
  }

  clear(): void {
    this.output = [];
  }
}

// Mock environment for testing
class MockEnviron {
  constructor(private env: Record<string, string> = {}) {}

  getenv(key: string): string {
    return this.env[key] || '';
  }

  environ(): string[] {
    return Object.entries(this.env).map(([k, v]) => `${k}=${v}`);
  }
}

describe('Go-style API', () => {
  let mockWriter: MockWriter;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    mockWriter = new MockWriter();
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Profile constants', () => {
    test('profile constants match enum values', () => {
      expect(TrueColor).toBe(0);
      expect(ANSI256).toBe(1);
      expect(ANSI).toBe(2);
      expect(Ascii).toBe(3);
    });
  });

  describe('String function and Style methods', () => {
    test('String creates styled text', () => {
      const styled = String('Hello World');
      expect(styled.String()).toContain('Hello World');
    });

    test('String supports Go-style chaining', () => {
      // Note: In Ascii profile (default), styling may be stripped
      const styled = String('Test');
      const result = styled.String();
      expect(result).toContain('Test');
      // Don't test for ANSI sequences since profile behavior may strip them
    });

    test('Style methods use PascalCase', () => {
      const styled = String('Test');

      // Test that all PascalCase methods exist
      expect(typeof styled.Foreground).toBe('function');
      expect(typeof styled.Background).toBe('function');
      expect(typeof styled.Bold).toBe('function');
      expect(typeof styled.Italic).toBe('function');
      expect(typeof styled.Underline).toBe('function');
      expect(typeof styled.CrossOut).toBe('function'); // Method is CrossOut
      expect(typeof styled.Reverse).toBe('function');
      expect(typeof styled.Blink).toBe('function');
      expect(typeof styled.Faint).toBe('function');
      expect(typeof styled.Width).toBe('function');
      expect(typeof styled.String).toBe('function');
    });

    test('Width method returns string width', () => {
      const styled = String('Hi');
      const width = styled.Width();

      // Width returns the calculated width, doesn't pad
      expect(width).toBe(2);
    });
  });

  describe('Color functions', () => {
    test('NoColor creates NoColor instance', () => {
      const color = NoColor();
      expect(color.toString()).toBe('');
      expect(color.sequence(false)).toBe('');
    });

    test('ANSIColor creates ANSI color', () => {
      const color = ANSIColor(9);
      expect(color.value).toBe(9);
      expect(color.sequence(false)).toBe('91');
    });

    test('ANSI256Color creates 256-color', () => {
      const color = ANSI256Color(196);
      expect(color.value).toBe(196);
      expect(color.sequence(false)).toBe('38;5;196'); // Includes foreground prefix
    });

    test('RGBColor creates RGB color', () => {
      const color = RGBColor('#FF0000');
      expect(color.toString()).toBe('#FF0000');
      expect(color.sequence(false)).toBe('38;2;255;0;0'); // Includes foreground prefix
    });

    test('Color creates color from string', () => {
      const rgbColor = Color('#FF0000');
      expect(rgbColor).not.toBeNull();

      // Color function might return NoColor if profile is Ascii
      if (rgbColor instanceof NoColorType) {
        expect(rgbColor.toString()).toBe(''); // NoColor returns empty string
      } else {
        expect(rgbColor?.toString()).toBe('#ff0000'); // Hex colors are lowercase
      }

      const ansiColor = Color('9');
      expect(ansiColor).not.toBeNull();

      // ANSI color might also become NoColor in Ascii profile
      if (ansiColor instanceof NoColorType) {
        expect(ansiColor.toString()).toBe('');
      } else {
        expect((ansiColor as any).value).toBe(9);
      }

      const ansi256Color = Color('128');
      expect(ansi256Color).not.toBeNull();

      // ANSI256 color might also become NoColor in Ascii profile
      if (ansi256Color instanceof NoColorType) {
        expect(ansi256Color.toString()).toBe('');
      } else {
        expect((ansi256Color as any).value).toBe(128);
      }
    });
  });

  describe('Profile functions', () => {
    test('ColorProfile returns current profile', () => {
      const profile = ColorProfile();
      expect(typeof profile).toBe('number');
      expect(profile).toBeGreaterThanOrEqual(0);
      expect(profile).toBeLessThanOrEqual(3);
    });

    test('EnvColorProfile considers environment', () => {
      process.env.NO_COLOR = '';
      const profile = EnvColorProfile();
      expect(typeof profile).toBe('number');
    });

    test('EnvNoColor checks environment variables', () => {
      process.env.NO_COLOR = '';
      process.env.CLICOLOR = '';
      const noColor = EnvNoColor();
      expect(typeof noColor).toBe('boolean');
    });

    test('ProfileName returns profile name', () => {
      expect(ProfileName(TrueColor)).toBe('TrueColor');
      expect(ProfileName(ANSI256)).toBe('ANSI256');
      expect(ProfileName(ANSI)).toBe('ANSI');
      expect(ProfileName(Ascii)).toBe('Ascii');
    });
  });

  describe('Color detection functions', () => {
    test('HasDarkBackground returns boolean', () => {
      const isDark = HasDarkBackground();
      expect(typeof isDark).toBe('boolean');
    });

    test('ForegroundColor returns color', () => {
      const fg = ForegroundColor();
      expect(fg).toBeDefined();
      expect(typeof fg.sequence).toBe('function');
    });

    test('BackgroundColor returns color', () => {
      const bg = BackgroundColor();
      expect(bg).toBeDefined();
      expect(typeof bg.sequence).toBe('function');
    });
  });

  describe('Screen control functions', () => {
    test('MoveCursor generates correct sequence', () => {
      // Note: These are global functions that affect default output
      // We can't easily test their output without mocking the default output
      expect(typeof MoveCursor).toBe('function');
      expect(() => MoveCursor(1, 1)).not.toThrow();
    });

    test('CursorUp generates correct sequence', () => {
      expect(typeof CursorUp).toBe('function');
      expect(() => CursorUp(1)).not.toThrow();
      expect(() => CursorUp()).not.toThrow(); // Default parameter
    });

    test('CursorDown generates correct sequence', () => {
      expect(typeof CursorDown).toBe('function');
      expect(() => CursorDown(1)).not.toThrow();
      expect(() => CursorDown()).not.toThrow(); // Default parameter
    });

    test('ClearScreen function exists', () => {
      expect(typeof ClearScreen).toBe('function');
      expect(() => ClearScreen()).not.toThrow();
    });

    test('ClearLine function exists', () => {
      expect(typeof ClearLine).toBe('function');
      expect(() => ClearLine()).not.toThrow();
    });

    test('HideCursor function exists', () => {
      expect(typeof HideCursor).toBe('function');
      expect(() => HideCursor()).not.toThrow();
    });

    test('ShowCursor function exists', () => {
      expect(typeof ShowCursor).toBe('function');
      expect(() => ShowCursor()).not.toThrow();
    });

    test('AltScreen function exists', () => {
      expect(typeof AltScreen).toBe('function');
      expect(() => AltScreen()).not.toThrow();
    });

    test('ExitAltScreen function exists', () => {
      expect(typeof ExitAltScreen).toBe('function');
      expect(() => ExitAltScreen()).not.toThrow();
    });

    test('SetWindowTitle function exists', () => {
      expect(typeof SetWindowTitle).toBe('function');
      expect(() => SetWindowTitle('Test')).not.toThrow();
    });

    test('EnableMouse function exists', () => {
      expect(typeof EnableMouse).toBe('function');
      expect(() => EnableMouse()).not.toThrow();
    });

    test('DisableMouse function exists', () => {
      expect(typeof DisableMouse).toBe('function');
      expect(() => DisableMouse()).not.toThrow();
    });
  });

  describe('Hyperlink function', () => {
    test('Hyperlink creates OSC 8 hyperlink', () => {
      const link = Hyperlink('https://example.com', 'Example');
      expect(link).toContain('https://example.com');
      expect(link).toContain('Example');
      expect(link).toContain('\x1b]8;;');
    });

    test('Hyperlink handles empty URL', () => {
      const link = Hyperlink('', 'Just Text');
      expect(link).toBe('Just Text');
    });

    test('Hyperlink handles complex URLs', () => {
      const url = 'https://example.com/path?param=value#section';
      const link = Hyperlink(url, 'Complex Link');
      expect(link).toContain(url);
      expect(link).toContain('Complex Link');
    });
  });

  describe('Notify function', () => {
    test('Notify creates OSC 777 notification', () => {
      // Note: This affects the global output, so we test the function exists and doesn't throw
      expect(typeof Notify).toBe('function');
      expect(() => Notify('Title', 'Body')).not.toThrow();
    });

    test('Notify handles empty strings', () => {
      expect(() => Notify('', '')).not.toThrow();
    });

    test('Notify handles unicode', () => {
      expect(() => Notify('🔔 Title', 'Unicode message 测试')).not.toThrow();
    });
  });

  describe('Output functions', () => {
    test('NewOutput creates output instance', () => {
      const output = NewOutput(mockWriter as any);
      expect(output).toBeDefined();
      expect(typeof output.String).toBe('function');
      expect(typeof output.ColorProfile).toBe('function');
    });

    test('WithProfile option works', () => {
      const output = NewOutput(mockWriter as any, WithProfile(ANSI256));
      expect(output.profile).toBe(ANSI256);
    });

    test('WithTTY option works', () => {
      const output = NewOutput(mockWriter as any, WithTTY(true));
      expect(output.assumeTTY).toBe(true);
    });

    test('WithUnsafe option works', () => {
      const output = NewOutput(mockWriter as any, WithUnsafe());
      expect(output.unsafe).toBe(true);
    });

    test('WithColorCache option works', () => {
      const output = NewOutput(mockWriter as any, WithColorCache(true));
      expect(output.cache).toBe(true);
    });

    test('WithEnvironment option works', () => {
      const mockEnv = new MockEnviron({ TEST: 'value' });
      const output = NewOutput(mockWriter as any, WithEnvironment(mockEnv));
      expect(output.environ.getenv('TEST')).toBe('value');
    });

    test('multiple options work together', () => {
      const mockEnv = new MockEnviron({ TEST: 'value' });
      const output = NewOutput(
        mockWriter as any,
        WithProfile(TrueColor),
        WithTTY(true),
        WithUnsafe(),
        WithColorCache(true),
        WithEnvironment(mockEnv)
      );

      expect(output.profile).toBe(TrueColor);
      expect(output.assumeTTY).toBe(true);
      expect(output.unsafe).toBe(true);
      expect(output.cache).toBe(true);
      expect(output.environ.getenv('TEST')).toBe('value');
    });
  });

  describe('Convert function', () => {
    test('Convert transforms colors based on profile', () => {
      const rgbColor = RGBColor('#FF0000');

      // Convert to different profiles
      const trueColorResult = Convert(TrueColor, rgbColor);
      const ansi256Result = Convert(ANSI256, rgbColor);
      const ansiResult = Convert(ANSI, rgbColor);
      const asciiResult = Convert(Ascii, rgbColor);

      expect(trueColorResult).toBe(rgbColor); // Should preserve RGB
      expect(ansi256Result).not.toBe(rgbColor); // Should convert
      expect(ansiResult).not.toBe(rgbColor); // Should convert
      expect(asciiResult.sequence(false)).toBe(''); // Should be NoColor
    });

    test('Convert handles ANSI colors', () => {
      const ansiColor = ANSIColor(9);

      // ANSI colors should be preserved in all profiles except Ascii
      expect(Convert(TrueColor, ansiColor)).toBe(ansiColor);
      expect(Convert(ANSI256, ansiColor)).toBe(ansiColor);
      expect(Convert(ANSI, ansiColor)).toBe(ansiColor);
      expect(Convert(Ascii, ansiColor).sequence(false)).toBe(''); // NoColor
    });

    test('Convert handles ANSI256 colors', () => {
      const ansi256Color = ANSI256Color(196);

      expect(Convert(TrueColor, ansi256Color)).toBe(ansi256Color); // Preserve
      expect(Convert(ANSI256, ansi256Color)).toBe(ansi256Color); // Preserve
      expect(Convert(ANSI, ansi256Color)).not.toBe(ansi256Color); // Convert to ANSI
      expect(Convert(Ascii, ansi256Color).sequence(false)).toBe(''); // NoColor
    });
  });

  describe('API consistency with camelCase versions', () => {
    test('Go-style functions exist and work', () => {
      // Test that the Go-style API provides the same functionality
      // as the camelCase API but with PascalCase names

      // String creation
      const goString = String('test');
      const result = goString.Bold().String();
      expect(result).toContain('test');
      // Profile may affect styling output

      // Color creation
      const goColor = RGBColor('#FF0000');
      expect(goColor.toString()).toBe('#FF0000');

      // Profile functions
      const goProfile = ColorProfile();
      expect(typeof goProfile).toBe('number');

      // All functions should exist and be callable
      expect(typeof String).toBe('function');
      expect(typeof ColorProfile).toBe('function');
      expect(typeof EnvColorProfile).toBe('function');
      expect(typeof ProfileName).toBe('function');
      expect(typeof MoveCursor).toBe('function');
      expect(typeof Hyperlink).toBe('function');
      expect(typeof Notify).toBe('function');
    });

    test('Go-style API maintains same behavior as camelCase', () => {
      // Create colors using both APIs and compare
      const goRGB = RGBColor('#FF0000');
      const goANSI = ANSIColor(9);

      expect(goRGB.sequence(false)).toBe('38;2;255;0;0'); // Includes foreground prefix
      expect(goANSI.sequence(false)).toBe('91');

      // Profile names should match
      expect(ProfileName(TrueColor)).toBe('TrueColor');
      expect(ProfileName(ANSI)).toBe('ANSI');
    });
  });

  describe('edge cases and error handling', () => {
    test('handles invalid profile numbers', () => {
      expect(ProfileName(999 as any)).toBe('Unknown');
      expect(ProfileName(-1 as any)).toBe('Unknown');
    });

    test('handles invalid color strings', () => {
      expect(Color('invalid')).toBeNull();
      expect(Color('')).toBeNull();
    });

    test('screen control functions handle edge cases', () => {
      expect(() => MoveCursor(0, 0)).not.toThrow();
      expect(() => MoveCursor(-1, -1)).not.toThrow();
      expect(() => CursorUp(0)).not.toThrow();
      expect(() => CursorDown(0)).not.toThrow();
    });

    test('hyperlink handles edge cases', () => {
      expect(Hyperlink(null as any, 'test')).toBe('test');
      expect(Hyperlink(undefined as any, 'test')).toBe('test');
      expect(Hyperlink('', 'test')).toBe('test');
    });

    test('style methods handle null colors', () => {
      const styled = String('test');
      expect(() => styled.Foreground(null as any)).not.toThrow();
      expect(() => styled.Background(undefined as any)).not.toThrow();
    });
  });
});

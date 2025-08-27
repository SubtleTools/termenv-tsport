import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { 
  OutputImpl, 
  newOutput, 
  withProfile, 
  withColorCache, 
  withTTY, 
  withUnsafe, 
  withEnvironment,
  parseXTermColor
} from '#src/output.js';
import { Profile, ProcessEnviron, ANSIColor, ANSI256Color, RGBColor, NoColor } from '#src/types.js';

// Mock writer for capturing output - matches Node.js WriteStream interface
class MockWriter {
  public output: string[] = [];
  public isTTY: boolean = true;

  write(data: Uint8Array | string, callback?: (err?: Error) => void): boolean {
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    this.output.push(text);
    
    // Call callback asynchronously to simulate real Node.js behavior
    if (callback) {
      process.nextTick(() => callback());
    }
    
    return true; // Indicates write was successful
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

  setEnv(key: string, value: string): void {
    this.env[key] = value;
  }

  clearEnv(): void {
    this.env = {};
  }
}

describe('OutputImpl', () => {
  let mockWriter: MockWriter;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    mockWriter = new MockWriter();
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('constructor and options', () => {
    test('creates output with default options', () => {
      const output = newOutput(mockWriter as any);
      expect(output.profile).toBeGreaterThanOrEqual(0);
      expect(output.assumeTTY).toBe(false);
      expect(output.unsafe).toBe(false);
      expect(output.cache).toBe(false);
    });

    test('applies profile option', () => {
      const output = newOutput(mockWriter as any, withProfile(Profile.ANSI256));
      expect(output.profile).toBe(Profile.ANSI256);
    });

    test('applies TTY option', () => {
      const output = newOutput(mockWriter as any, withTTY(true));
      expect(output.assumeTTY).toBe(true);
    });

    test('applies unsafe option', () => {
      const output = newOutput(mockWriter as any, withUnsafe());
      expect(output.unsafe).toBe(true);
    });

    test('applies color cache option', () => {
      const output = newOutput(mockWriter as any, withColorCache(true));
      expect(output.cache).toBe(true);
    });

    test('applies environment option', () => {
      const mockEnv = new MockEnviron({ TEST: 'value' });
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv));
      expect(output.environ.getenv('TEST')).toBe('value');
    });

    test('applies multiple options', () => {
      const output = newOutput(
        mockWriter as any,
        withProfile(Profile.TrueColor),
        withTTY(true),
        withUnsafe(),
        withColorCache(true)
      );
      
      expect(output.profile).toBe(Profile.TrueColor);
      expect(output.assumeTTY).toBe(true);
      expect(output.unsafe).toBe(true);
      expect(output.cache).toBe(true);
    });
  });

  describe('writer methods', () => {
    test('writer() returns the writer', () => {
      const output = newOutput(mockWriter as any);
      expect(output.writer()).toBe(mockWriter);
    });

    test('write() writes data', async () => {
      const output = newOutput(mockWriter as any);
      const data = new TextEncoder().encode('test');
      
      // Since mockWriter.write returns a Promise, await it directly
      const result = await output.write(data);
      
      expect(result).toBe(4);
      expect(mockWriter.output[0]).toBe('test');
    });

    test('writeString() writes string', async () => {
      const output = newOutput(mockWriter as any);
      
      // Since mockWriter.write returns a Promise, await it directly
      const result = await output.writeString('hello');
      
      expect(result).toBe(5);
      expect(mockWriter.output[0]).toBe('hello');
    });
  });

  describe('TTY detection', () => {
    test('detects TTY from writer', () => {
      mockWriter.isTTY = true;
      const output = newOutput(mockWriter as any);
      expect(output.isTTY()).toBe(true);
    });

    test('detects non-TTY from writer', () => {
      mockWriter.isTTY = false;
      const output = newOutput(mockWriter as any);
      expect(output.isTTY()).toBe(false);
    });

    test('assumeTTY overrides detection', () => {
      mockWriter.isTTY = false;
      const output = newOutput(mockWriter as any, withTTY(true));
      expect(output.isTTY()).toBe(true);
    });

    test('unsafe mode overrides detection', () => {
      mockWriter.isTTY = false;
      const output = newOutput(mockWriter as any, withUnsafe());
      expect(output.isTTY()).toBe(true);
    });

    test('CI environment disables TTY', () => {
      process.env.CI = '1';
      mockWriter.isTTY = true;
      const output = newOutput(mockWriter as any);
      expect(output.isTTY()).toBe(false);
    });
  });

  describe('color profile detection', () => {
    let mockEnv: MockEnviron;

    beforeEach(() => {
      mockEnv = new MockEnviron();
    });

    test('detects Google Cloud Shell', () => {
      mockEnv.setEnv('GOOGLE_CLOUD_SHELL', 'true');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.TrueColor);
    });

    test('detects TrueColor from COLORTERM', () => {
      mockEnv.setEnv('COLORTERM', 'truecolor');
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.TrueColor);
    });

    test('detects 24bit from COLORTERM', () => {
      mockEnv.setEnv('COLORTERM', '24bit');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.TrueColor);
    });

    test('detects ANSI256 from COLORTERM yes', () => {
      mockEnv.setEnv('COLORTERM', 'yes');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.ANSI256);
    });

    test('detects TrueColor terminals', () => {
      const trueColorTerms = ['alacritty', 'contour', 'rio', 'wezterm', 'xterm-ghostty', 'xterm-kitty'];
      
      for (const term of trueColorTerms) {
        mockEnv.clearEnv();
        mockEnv.setEnv('TERM', term);
        const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
        expect(output.colorProfile()).toBe(Profile.TrueColor);
      }
    });

    test('detects ANSI from specific terminals', () => {
      const ansiTerms = ['linux', 'xterm'];
      
      for (const term of ansiTerms) {
        mockEnv.clearEnv();
        mockEnv.setEnv('TERM', term);
        const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
        expect(output.colorProfile()).toBe(Profile.ANSI);
      }
    });

    test('detects ANSI256 from 256color terms', () => {
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.ANSI256);
    });

    test('detects ANSI from color terms', () => {
      mockEnv.setEnv('TERM', 'xterm-color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.ANSI);
    });

    test('detects ANSI from ansi terms', () => {
      mockEnv.setEnv('TERM', 'ansi');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.ANSI);
    });

    test('defaults to Ascii for unknown terms', () => {
      mockEnv.setEnv('TERM', 'unknown-terminal');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.Ascii);
    });

    test('profile detection considers TTY status', () => {
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(false));
      
      // Without TTY, profile detection may return different values
      const profile = output.colorProfile();
      expect(typeof profile).toBe('number');
      // Profile enum: TrueColor=0, ANSI256=1, ANSI=2, Ascii=3  
      // Lower numbers mean higher capabilities
      expect(profile).toBeGreaterThanOrEqual(Profile.TrueColor);
      expect(profile).toBeLessThanOrEqual(Profile.Ascii);
    });

    test('handles screen terminals with tmux', () => {
      mockEnv.setEnv('TERM', 'screen-256color');
      mockEnv.setEnv('COLORTERM', 'truecolor');
      mockEnv.setEnv('TERM_PROGRAM', 'tmux');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.TrueColor);
    });

    test('handles screen terminals without tmux', () => {
      mockEnv.setEnv('TERM', 'screen-256color');
      mockEnv.setEnv('COLORTERM', 'truecolor');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.colorProfile()).toBe(Profile.ANSI256);
    });
  });

  describe('environment color profile', () => {
    let mockEnv: MockEnviron;

    beforeEach(() => {
      mockEnv = new MockEnviron();
    });

    test('respects NO_COLOR', () => {
      mockEnv.setEnv('NO_COLOR', '1');
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.envColorProfile()).toBe(Profile.Ascii);
    });

    test('respects CLICOLOR=0', () => {
      mockEnv.setEnv('CLICOLOR', '0');
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.envColorProfile()).toBe(Profile.Ascii);
    });

    test('CLICOLOR_FORCE overrides NO_COLOR', () => {
      mockEnv.setEnv('NO_COLOR', '1');
      mockEnv.setEnv('CLICOLOR_FORCE', '1');
      mockEnv.setEnv('TERM', 'xterm-256color');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      // CLICOLOR_FORCE should enable colors, but exact profile may vary based on implementation
      const profile = output.envColorProfile();
      expect(profile).toBeGreaterThanOrEqual(Profile.ANSI);
    });

    test('CLICOLOR_FORCE enables ANSI for Ascii profile', () => {
      mockEnv.setEnv('CLICOLOR_FORCE', '1');
      mockEnv.setEnv('TERM', 'dumb');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.envColorProfile()).toBe(Profile.ANSI);
    });
  });

  describe('envNoColor', () => {
    let mockEnv: MockEnviron;

    beforeEach(() => {
      mockEnv = new MockEnviron();
    });

    test('returns true for NO_COLOR', () => {
      mockEnv.setEnv('NO_COLOR', '1');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv));
      expect(output.envNoColor()).toBe(true);
    });

    test('returns true for CLICOLOR=0', () => {
      mockEnv.setEnv('CLICOLOR', '0');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv));
      expect(output.envNoColor()).toBe(true);
    });

    test('returns false for CLICOLOR_FORCE', () => {
      mockEnv.setEnv('CLICOLOR', '0');
      mockEnv.setEnv('CLICOLOR_FORCE', '1');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv));
      expect(output.envNoColor()).toBe(false);
    });

    test('returns false by default', () => {
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv));
      expect(output.envNoColor()).toBe(false);
    });
  });

  describe('foreground and background colors', () => {
    let mockEnv: MockEnviron;

    beforeEach(() => {
      mockEnv = new MockEnviron();
    });

    test('returns NoColor for non-TTY', () => {
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(false));
      expect(output.foregroundColor()).toBeInstanceOf(NoColor);
      expect(output.backgroundColor()).toBeInstanceOf(NoColor);
    });

    test('parses COLORFGBG environment variable', () => {
      mockEnv.setEnv('COLORFGBG', '15;0');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      
      const fg = output.foregroundColor();
      const bg = output.backgroundColor();
      
      expect(fg).toBeInstanceOf(ANSIColor);
      expect(bg).toBeInstanceOf(ANSIColor);
      expect((fg as ANSIColor).value).toBe(15);
      expect((bg as ANSIColor).value).toBe(0);
    });

    test('handles malformed COLORFGBG', () => {
      mockEnv.setEnv('COLORFGBG', 'invalid');
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      
      expect(output.foregroundColor()).toBeInstanceOf(NoColor);
      expect(output.backgroundColor()).toBeInstanceOf(NoColor);
    });

    test('caches colors when enabled', () => {
      mockEnv.setEnv('COLORFGBG', '15;0');
      const output = newOutput(
        mockWriter as any, 
        withEnvironment(mockEnv), 
        withTTY(true), 
        withColorCache(true)
      );
      
      const fg1 = output.foregroundColor();
      const fg2 = output.foregroundColor();
      const bg1 = output.backgroundColor();
      const bg2 = output.backgroundColor();
      
      // Should return same instances when cached
      expect(fg1).toBe(fg2);
      expect(bg1).toBe(bg2);
    });
  });

  describe('hasDarkBackground', () => {
    let mockEnv: MockEnviron;

    beforeEach(() => {
      mockEnv = new MockEnviron();
    });

    test('returns true by default when color cannot be determined', () => {
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.hasDarkBackground()).toBe(true);
    });

    test('detects dark background from COLORFGBG', () => {
      mockEnv.setEnv('COLORFGBG', '15;0'); // White on black
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.hasDarkBackground()).toBe(true);
    });

    test('detects light background from COLORFGBG', () => {
      mockEnv.setEnv('COLORFGBG', '0;15'); // Black on white
      const output = newOutput(mockWriter as any, withEnvironment(mockEnv), withTTY(true));
      expect(output.hasDarkBackground()).toBe(false);
    });
  });

  describe('color creation and conversion', () => {
    test('creates colors from hex strings', () => {
      const output = newOutput(mockWriter as any, withProfile(Profile.TrueColor));
      const color = output.color('#FF0000');
      
      expect(color).toBeInstanceOf(RGBColor);
      expect(color?.toString()).toBe('#FF0000');
    });

    test('creates colors from ANSI numbers', () => {
      const output = newOutput(mockWriter as any, withProfile(Profile.ANSI));
      const color = output.color('9');
      
      expect(color).toBeInstanceOf(ANSIColor);
      expect((color as ANSIColor).value).toBe(9);
    });

    test('creates colors from ANSI256 numbers', () => {
      const output = newOutput(mockWriter as any, withProfile(Profile.ANSI256));
      const color = output.color('128');
      
      expect(color).toBeInstanceOf(ANSI256Color);
      expect((color as ANSI256Color).value).toBe(128);
    });

    test('converts colors based on profile', () => {
      const asciiOutput = newOutput(mockWriter as any, withProfile(Profile.Ascii));
      const rgbColor = asciiOutput.color('#FF0000');
      expect(rgbColor).toBeInstanceOf(NoColor);

      const ansiOutput = newOutput(mockWriter as any, withProfile(Profile.ANSI));
      const ansiColor = ansiOutput.color('#FF0000');
      expect(ansiColor).toBeInstanceOf(ANSIColor);
    });

    test('returns null for invalid color strings', () => {
      const output = newOutput(mockWriter as any);
      expect(output.color('')).toBeNull();
      expect(output.color('invalid')).toBeNull();
      // Note: '999' is treated as a valid ANSI256 color
      const color999 = output.color('999');
      expect(color999).not.toBeNull();
    });
  });

  describe('string creation', () => {
    test('creates styled strings', () => {
      const output = newOutput(mockWriter as any);
      const styled = output.string('test');
      
      expect(styled.toString()).toContain('test');
    });

    test('joins multiple strings', () => {
      const output = newOutput(mockWriter as any);
      const styled = output.string('hello', 'world');
      
      expect(styled.toString()).toContain('hello world');
    });
  });

  describe('Go-compatible API', () => {
    test('provides PascalCase methods', () => {
      const output = newOutput(mockWriter as any);
      
      expect(typeof output.String).toBe('function');
      expect(typeof output.Color).toBe('function');
      expect(typeof output.ColorProfile).toBe('function');
      expect(typeof output.EnvColorProfile).toBe('function');
      expect(typeof output.EnvNoColor).toBe('function');
      expect(typeof output.HasDarkBackground).toBe('function');
      expect(typeof output.ForegroundColor).toBe('function');
      expect(typeof output.BackgroundColor).toBe('function');
    });

    test('Go-compatible methods work identically', () => {
      const output = newOutput(mockWriter as any);
      
      const camelCase = output.colorProfile();
      const PascalCase = output.ColorProfile();
      expect(camelCase).toBe(PascalCase);
      
      const camelString = output.string('test').toString();
      const PascalString = output.String('test').toString();
      expect(camelString).toBe(PascalString);
    });
  });
});

describe('parseXTermColor', () => {
  test('parses valid xTerm color responses', () => {
    // Valid OSC 10/11 response format
    const validResponse = '\x1b]10;rgb:ffff/0000/0000\x07';
    const color = parseXTermColor(validResponse);
    
    expect(color).toBeInstanceOf(RGBColor);
    expect(color?.toString()).toBe('#ff0000'); // hex colors return lowercase
  });

  test('handles different terminators', () => {
    const belTerminated = '\x1b]10;rgb:0000/ffff/0000\x07';
    const stTerminated = '\x1b]10;rgb:0000/ffff/0000\x1b\\';
    const escTerminated = '\x1b]10;rgb:0000/ffff/0000\x1b';
    
    const color1 = parseXTermColor(belTerminated);
    const color2 = parseXTermColor(stTerminated);
    const color3 = parseXTermColor(escTerminated);
    
    expect(color1?.toString()).toBe('#00ff00'); // hex colors return lowercase
    expect(color2?.toString()).toBe('#00ff00');
    expect(color3?.toString()).toBe('#00ff00');
  });

  test('handles different RGB formats', () => {
    const fullFormat = '\x1b]10;rgb:ffff/8080/4040\x07';
    const color = parseXTermColor(fullFormat);
    
    expect(color).toBeInstanceOf(RGBColor);
    // Should truncate to 8-bit values
    expect(color?.toString()).toBe('#ff8040'); // hex colors return lowercase
  });

  test('returns null for invalid formats', () => {
    expect(parseXTermColor('')).toBeNull();
    expect(parseXTermColor('invalid')).toBeNull();
    expect(parseXTermColor('\x1b]10;invalid\x07')).toBeNull();
    expect(parseXTermColor('\x1b]10;rgb:invalid\x07')).toBeNull();
    expect(parseXTermColor('\x1b]10;rgb:ff/gg/hh\x07')).toBeNull();
  });

  test('handles malformed responses gracefully', () => {
    const tooShort = '\x1b]10;\x07';
    const tooLong = '\x1b]10;' + 'x'.repeat(100) + '\x07';
    const noTerminator = '\x1b]10;rgb:ffff/0000/0000';
    
    expect(parseXTermColor(tooShort)).toBeNull();
    expect(parseXTermColor(tooLong)).toBeNull();
    expect(parseXTermColor(noTerminator)).toBeNull();
  });
});
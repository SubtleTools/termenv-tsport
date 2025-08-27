import { describe, expect, test } from 'bun:test';
import { newOutput, withProfile } from '#src/output.js';
import { Profile, RGBColor } from '#src/types.js';

// Mock writer
class MockWriter {
  public output: string[] = [];
  public isTTY: boolean = true;

  write(data: Uint8Array | string, callback?: (err?: Error) => void): boolean {
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    this.output.push(text);
    
    if (callback) {
      process.nextTick(() => callback());
    }
    
    return true;
  }

  clear(): void {
    this.output = [];
  }
}

// Mock environment
class MockEnviron {
  constructor(private env: Record<string, string> = {}) {}

  getenv(key: string): string {
    return this.env[key] || '';
  }

  environ(): string[] {
    return Object.entries(this.env).map(([k, v]) => `${k}=${v}`);
  }
}

describe('Output Go-compatible Methods', () => {
  test('all Go-compatible methods exist and work', () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any, withProfile(Profile.TrueColor));
    
    // Test String method
    const styled = output.String('test', 'string');
    expect(styled.toString()).toContain('test string');
    
    // Test Color method
    const color = output.Color('#FF0000');
    expect(color).toBeInstanceOf(RGBColor);
    
    // Test ColorProfile method
    const profile = output.ColorProfile();
    expect(profile).toBe(Profile.TrueColor);
    
    // Test EnvColorProfile method
    const envProfile = output.EnvColorProfile();
    expect(typeof envProfile).toBe('number');
    
    // Test EnvNoColor method
    const noColor = output.EnvNoColor();
    expect(typeof noColor).toBe('boolean');
    
    // Test HasDarkBackground method
    const darkBg = output.HasDarkBackground();
    expect(typeof darkBg).toBe('boolean');
    
    // Test ForegroundColor method
    const fgColor = output.ForegroundColor();
    expect(fgColor).toBeDefined();
    expect(typeof fgColor.sequence).toBe('function');
    
    // Test BackgroundColor method
    const bgColor = output.BackgroundColor();
    expect(bgColor).toBeDefined();
    expect(typeof bgColor.sequence).toBe('function');
  });

  test('Go methods return same results as camelCase methods', () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any, withProfile(Profile.TrueColor));
    
    expect(output.ColorProfile()).toBe(output.colorProfile());
    expect(output.EnvColorProfile()).toBe(output.envColorProfile());
    expect(output.EnvNoColor()).toBe(output.envNoColor());
    expect(output.HasDarkBackground()).toBe(output.hasDarkBackground());
    
    const camelString = output.string('test').toString();
    const pascalString = output.String('test').toString();
    expect(camelString).toBe(pascalString);
  });

  test('Color method handles various inputs', () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any, withProfile(Profile.TrueColor));
    
    const rgbColor = output.Color('#00FF00');
    expect(rgbColor?.toString()).toBe('#00FF00'); // Output preserves case
    
    const ansiColor = output.Color('9');
    expect(ansiColor).not.toBeNull();
    
    const invalidColor = output.Color('invalid');
    expect(invalidColor).toBeNull();
  });
});
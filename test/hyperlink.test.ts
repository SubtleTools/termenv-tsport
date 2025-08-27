import { describe, expect, test } from 'bun:test';
import { HyperlinkControl, hyperlink } from '#src/hyperlink.js';
import { newOutput } from '#src/output.js';

// Mock writer for capturing output
class MockWriter {
  public output: string[] = [];

  write(data: Uint8Array | string): Promise<number> {
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    this.output.push(text);
    return Promise.resolve(text.length);
  }

  clear(): void {
    this.output = [];
  }
}

describe('hyperlink function', () => {
  test('creates correct OSC 8 hyperlink format', () => {
    const result = hyperlink('https://example.com', 'Example Link');
    expect(result).toBe('\x1b]8;;https://example.com\x1b\\Example Link\x1b]8;;\x1b\\');
  });

  test('returns display text when link is empty', () => {
    const result = hyperlink('', 'Just Text');
    expect(result).toBe('Just Text');
  });

  test('handles empty link parameter', () => {
    const result = hyperlink(null as any, 'Just Text');
    expect(result).toBe('Just Text');
  });

  test('works with complex URLs', () => {
    const url = 'https://example.com/path?param=value&other=123#section';
    const result = hyperlink(url, 'Complex Link');
    expect(result).toBe(`\x1b]8;;${url}\x1b\\Complex Link\x1b]8;;\x1b\\`);
  });

  test('works with unicode text', () => {
    const result = hyperlink('https://example.com', '🔗 Unicode Link 测试');
    expect(result).toBe('\x1b]8;;https://example.com\x1b\\🔗 Unicode Link 测试\x1b]8;;\x1b\\');
  });
});

describe('HyperlinkControl', () => {
  test('writes hyperlink to output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const hyperlinkControl = new HyperlinkControl(output);

    hyperlinkControl.hyperlink('https://example.com', 'Test Link');

    expect(writer.output.length).toBe(1);
    expect(writer.output[0]).toBe('\x1b]8;;https://example.com\x1b\\Test Link\x1b]8;;\x1b\\');
  });

  test('method chaining works correctly', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const hyperlinkControl = new HyperlinkControl(output);

    const result = hyperlinkControl.hyperlink('https://example.com', 'Link 1');
    expect(result).toBe(hyperlinkControl);
  });

  test('handles multiple hyperlinks', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const hyperlinkControl = new HyperlinkControl(output);

    hyperlinkControl
      .hyperlink('https://example.com', 'First Link')
      .hyperlink('https://github.com', 'Second Link');

    expect(writer.output.length).toBe(2);
    expect(writer.output[0]).toBe('\x1b]8;;https://example.com\x1b\\First Link\x1b]8;;\x1b\\');
    expect(writer.output[1]).toBe('\x1b]8;;https://github.com\x1b\\Second Link\x1b]8;;\x1b\\');
  });

  test('handles empty link gracefully', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const hyperlinkControl = new HyperlinkControl(output);

    hyperlinkControl.hyperlink('', 'No Link');

    expect(writer.output.length).toBe(1);
    expect(writer.output[0]).toBe('No Link');
  });
});

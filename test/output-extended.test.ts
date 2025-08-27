import { describe, expect, test } from 'bun:test';
import { newOutput } from '#src/output.js';
import { ANSIColor, RGBColor } from '#src/types.js';

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

describe('OutputImpl Extended Methods', () => {
  test('screen control methods work via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.clearScreen();
    expect(writer.output[0]).toBe('\x1b[2J');

    writer.clear();
    output.moveCursor(5, 10);
    expect(writer.output[0]).toBe('\x1b[5;10H');

    writer.clear();
    output.hideCursor();
    expect(writer.output[0]).toBe('\x1b[?25l');
  });

  test('mouse control methods work via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.enableMouse();
    expect(writer.output[0]).toBe('\x1b[?1000h');

    writer.clear();
    output.disableMouse();
    expect(writer.output[0]).toBe('\x1b[?1000l');

    writer.clear();
    output.enableMouseCellMotion();
    expect(writer.output[0]).toBe('\x1b[?1002h');
  });

  test('hyperlink method works via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.hyperlink('https://example.com', 'Test Link');
    expect(writer.output[0]).toBe('\x1b]8;;https://example.com\x1b\\Test Link\x1b]8;;\x1b\\');
  });

  test('notification method works via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.notify('Title', 'Body');
    expect(writer.output[0]).toBe('\x1b]777;notify;Title;Body\x1b\\');
  });

  test('color setting methods work via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    const red = new RGBColor('#FF0000');
    const blue = new ANSIColor(4);

    output.setForegroundColor(red);
    expect(writer.output[0]).toContain('\x1b[38;');

    writer.clear();
    output.setBackgroundColor(blue);
    expect(writer.output[0]).toContain('\x1b[48;');

    writer.clear();
    output.setCursorColor(red);
    expect(writer.output[0]).toContain('\x1b]12;');
  });

  test('window title method works via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.setWindowTitle('My App');
    expect(writer.output[0]).toBe('\x1b]2;My App\x07');
  });

  test('scrolling methods work via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.changeScrollingRegion(5, 20);
    expect(writer.output[0]).toBe('\x1b[5;20r');

    writer.clear();
    output.insertLines(3);
    expect(writer.output[0]).toBe('\x1b[3L');

    writer.clear();
    output.deleteLines(2);
    expect(writer.output[0]).toBe('\x1b[2M');
  });

  test('bracketed paste methods work via Output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    output.enableBracketedPaste();
    expect(writer.output[0]).toBe('\x1b[?2004h');

    writer.clear();
    output.disableBracketedPaste();
    expect(writer.output[0]).toBe('\x1b[?2004l');
  });

  test('complex method chaining works', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    // Simulate a complex terminal UI setup
    output.altScreen();
    output.hideCursor();
    output.clearScreen();
    output.moveCursor(1, 1);
    output.moveCursor(3, 1);
    output.hyperlink('https://github.com', 'Visit GitHub');
    output.moveCursor(25, 1);
    output.showCursor();

    expect(writer.output.length).toBe(8);
    expect(writer.output[0]).toBe('\x1b[?1049h'); // Alt screen
    expect(writer.output[1]).toBe('\x1b[?25l'); // Hide cursor
    expect(writer.output[2]).toBe('\x1b[2J'); // Clear screen
    expect(writer.output[3]).toBe('\x1b[1;1H'); // Move cursor
    expect(writer.output[4]).toBe('\x1b[3;1H'); // Move cursor
    expect(writer.output[5]).toBe('\x1b]8;;https://github.com\x1b\\Visit GitHub\x1b]8;;\x1b\\'); // Hyperlink
    expect(writer.output[6]).toBe('\x1b[25;1H'); // Move cursor
    expect(writer.output[7]).toBe('\x1b[?25h'); // Show cursor
  });

  test('all extended methods return void as expected', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);

    // Test that methods don't return the output instance (they're void methods)
    expect(output.clearScreen()).toBeUndefined();
    expect(output.moveCursor(1, 1)).toBeUndefined();
    expect(output.enableMouse()).toBeUndefined();
    expect(output.hyperlink('url', 'text')).toBeUndefined();
    expect(output.notify('title', 'body')).toBeUndefined();
  });
});

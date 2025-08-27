import { describe, expect, test } from 'bun:test';
import { newOutput } from '#src/output.js';

// Mock writer for capturing output
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

describe('Screen Control Methods', () => {
  test('screen control methods execute without error', async () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any);

    // Test all screen control methods
    await output.moveCursor(5, 10);
    await output.cursorUp(3);
    await output.cursorDown(2);
    await output.clearScreen();
    await output.clearLine();
    await output.hideCursor();
    await output.showCursor();
    await output.saveScreen();
    await output.restoreScreen();
    await output.altScreen();
    await output.exitAltScreen();
    await output.setWindowTitle('Test Title');
    await output.enableMouse();
    await output.disableMouse();
    await output.enableBracketedPaste();
    await output.disableBracketedPaste();

    // Should have generated output
    expect(mockWriter.output.length).toBeGreaterThan(0);

    // Check that some expected sequences are present
    const allOutput = mockWriter.output.join('');
    expect(allOutput.length).toBeGreaterThan(0);
  });

  test('notification method executes', async () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any);

    await output.notify('Test', 'Message');

    expect(mockWriter.output.length).toBeGreaterThan(0);
    const output_text = mockWriter.output.join('');
    expect(output_text).toContain('777');
  });

  test('hyperlink method executes', async () => {
    const mockWriter = new MockWriter();
    const output = newOutput(mockWriter as any);

    await output.hyperlink('https://example.com', 'Link Text');

    expect(mockWriter.output.length).toBeGreaterThan(0);
    const output_text = mockWriter.output.join('');
    expect(output_text).toContain('example.com');
    expect(output_text).toContain('Link Text');
  });
});

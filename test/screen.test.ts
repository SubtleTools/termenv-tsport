import { describe, expect, test } from 'bun:test';
import { newOutput } from '#src/output.js';
import { EraseLineMode, EraseMode, ScreenControl, SEQUENCES } from '#src/screen.js';

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

describe('ScreenControl', () => {
  test('cursor movement methods generate correct sequences', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.moveCursor(10, 20);
    expect(writer.output[0]).toBe('\x1b[10;20H');

    writer.clear();
    screen.cursorUp(5);
    expect(writer.output[0]).toBe('\x1b[5A');

    writer.clear();
    screen.cursorDown(3);
    expect(writer.output[0]).toBe('\x1b[3B');

    writer.clear();
    screen.cursorForward(7);
    expect(writer.output[0]).toBe('\x1b[7C');

    writer.clear();
    screen.cursorBack(2);
    expect(writer.output[0]).toBe('\x1b[2D');
  });

  test('cursor position save/restore methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.saveCursorPosition();
    expect(writer.output[0]).toBe('\x1b7');

    writer.clear();
    screen.restoreCursorPosition();
    expect(writer.output[0]).toBe('\x1b8');
  });

  test('cursor visibility methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.hideCursor();
    expect(writer.output[0]).toBe('\x1b[?25l');

    writer.clear();
    screen.showCursor();
    expect(writer.output[0]).toBe('\x1b[?25h');
  });

  test('screen clearing methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.clearScreen();
    expect(writer.output[0]).toBe('\x1b[2J');

    writer.clear();
    screen.clearLine();
    expect(writer.output[0]).toBe('\x1b[2K');

    writer.clear();
    screen.clearLines(3);
    // Should clear current line, move up, clear line, move up, clear line
    expect(writer.output.length).toBe(5); // Clear, up, clear, up, clear
  });

  test('screen mode methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.altScreen();
    expect(writer.output[0]).toBe('\x1b[?1049h');

    writer.clear();
    screen.exitAltScreen();
    expect(writer.output[0]).toBe('\x1b[?1049l');

    writer.clear();
    screen.saveScreen();
    expect(writer.output[0]).toBe('\x1b[?47h');

    writer.clear();
    screen.restoreScreen();
    expect(writer.output[0]).toBe('\x1b[?47l');
  });

  test('reset method', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.reset();
    expect(writer.output[0]).toBe('\x1bc');
  });

  test('color setting methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    const testColor = { sequence: (_bg: boolean) => '5;255' };

    screen.setForegroundColor(testColor as any);
    expect(writer.output[0]).toBe('\x1b[38;5;255');

    writer.clear();
    screen.setBackgroundColor(testColor as any);
    expect(writer.output[0]).toBe('\x1b[48;5;255');

    writer.clear();
    screen.setCursorColor(testColor as any);
    expect(writer.output[0]).toBe('\x1b]12;5;255\x07');
  });

  test('window title method', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.setWindowTitle('Test Title');
    expect(writer.output[0]).toBe('\x1b]2;Test Title\x07');
  });

  test('mouse support methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.enableMouse();
    expect(writer.output[0]).toBe('\x1b[?1000h');

    writer.clear();
    screen.disableMouse();
    expect(writer.output[0]).toBe('\x1b[?1000l');

    writer.clear();
    screen.enableMouseCellMotion();
    expect(writer.output[0]).toBe('\x1b[?1002h');

    writer.clear();
    screen.disableMouseCellMotion();
    expect(writer.output[0]).toBe('\x1b[?1002l');
  });

  test('bracketed paste methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.enableBracketedPaste();
    expect(writer.output[0]).toBe('\x1b[?2004h');

    writer.clear();
    screen.disableBracketedPaste();
    expect(writer.output[0]).toBe('\x1b[?2004l');
  });

  test('scrolling methods', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    screen.changeScrollingRegion(5, 20);
    expect(writer.output[0]).toBe('\x1b[5;20r');

    writer.clear();
    screen.insertLines(3);
    expect(writer.output[0]).toBe('\x1b[3L');

    writer.clear();
    screen.deleteLines(2);
    expect(writer.output[0]).toBe('\x1b[2M');
  });

  test('method chaining works correctly', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const screen = new ScreenControl(output);

    const result = screen.clearScreen().moveCursor(1, 1).showCursor();

    expect(result).toBe(screen);
    expect(writer.output.length).toBe(3);
    expect(writer.output[0]).toBe('\x1b[2J');
    expect(writer.output[1]).toBe('\x1b[1;1H');
    expect(writer.output[2]).toBe('\x1b[?25h');
  });
});

describe('SEQUENCES', () => {
  test('contains all required escape sequences', () => {
    expect(SEQUENCES.CursorUp).toBe('\x1b[%dA');
    expect(SEQUENCES.CursorDown).toBe('\x1b[%dB');
    expect(SEQUENCES.HideCursor).toBe('\x1b[?25l');
    expect(SEQUENCES.ShowCursor).toBe('\x1b[?25h');
    expect(SEQUENCES.AltScreen).toBe('\x1b[?1049h');
    expect(SEQUENCES.ExitAltScreen).toBe('\x1b[?1049l');
    expect(SEQUENCES.Reset).toBe('\x1bc');
  });
});

describe('EraseMode and EraseLineMode', () => {
  test('enums have correct values', () => {
    expect(EraseMode.EraseToEnd).toBe(0);
    expect(EraseMode.EraseToBeginning).toBe(1);
    expect(EraseMode.EraseEntireDisplay).toBe(2);
    expect(EraseMode.EraseSavedLines).toBe(3);

    expect(EraseLineMode.EraseToEnd).toBe(0);
    expect(EraseLineMode.EraseToBeginning).toBe(1);
    expect(EraseLineMode.EraseEntireLine).toBe(2);
  });
});

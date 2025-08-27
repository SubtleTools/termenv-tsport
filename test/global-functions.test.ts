import { describe, expect, test, beforeEach } from 'bun:test';
import {
  // Screen control functions
  moveCursor,
  cursorUp,
  cursorDown,
  clearScreen,
  clearLine,
  hideCursor,
  showCursor,
  altScreen,
  exitAltScreen,
  setWindowTitle,
  enableMouse,
  disableMouse,
  // Hyperlink functions
  createHyperlink,
  writeHyperlink,
  // Notification functions
  createNotification,
  sendNotification,
  defaultOutputInstance,
  setDefaultOutput,
  newOutput
} from '#src/index.js';

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

let mockWriter: MockWriter;

beforeEach(() => {
  mockWriter = new MockWriter();
  const testOutput = newOutput(mockWriter as any);
  setDefaultOutput(testOutput);
});

describe('Global Screen Control Functions', () => {
  test('moveCursor works with default output', () => {
    moveCursor(5, 10);
    expect(mockWriter.output[0]).toBe('\x1b[5;10H');
  });

  test('cursorUp with default parameter', () => {
    cursorUp();
    expect(mockWriter.output[0]).toBe('\x1b[1A');
  });

  test('cursorUp with custom parameter', () => {
    cursorUp(5);
    expect(mockWriter.output[0]).toBe('\x1b[5A');
  });

  test('cursorDown with default parameter', () => {
    cursorDown();
    expect(mockWriter.output[0]).toBe('\x1b[1B');
  });

  test('cursorDown with custom parameter', () => {
    cursorDown(3);
    expect(mockWriter.output[0]).toBe('\x1b[3B');
  });

  test('clearScreen works', () => {
    clearScreen();
    expect(mockWriter.output[0]).toBe('\x1b[2J');
  });

  test('clearLine works', () => {
    clearLine();
    expect(mockWriter.output[0]).toBe('\x1b[2K');
  });

  test('hideCursor works', () => {
    hideCursor();
    expect(mockWriter.output[0]).toBe('\x1b[?25l');
  });

  test('showCursor works', () => {
    showCursor();
    expect(mockWriter.output[0]).toBe('\x1b[?25h');
  });

  test('altScreen works', () => {
    altScreen();
    expect(mockWriter.output[0]).toBe('\x1b[?1049h');
  });

  test('exitAltScreen works', () => {
    exitAltScreen();
    expect(mockWriter.output[0]).toBe('\x1b[?1049l');
  });

  test('setWindowTitle works', () => {
    setWindowTitle('Test Window');
    expect(mockWriter.output[0]).toBe('\x1b]2;Test Window\x07');
  });

  test('enableMouse works', () => {
    enableMouse();
    expect(mockWriter.output[0]).toBe('\x1b[?1000h');
  });

  test('disableMouse works', () => {
    disableMouse();
    expect(mockWriter.output[0]).toBe('\x1b[?1000l');
  });
});

describe('Global Hyperlink Functions', () => {
  test('createHyperlink returns correct format', () => {
    const result = createHyperlink('https://example.com', 'Test Link');
    expect(result).toBe('\x1b]8;;https://example.com\x1b\\Test Link\x1b]8;;\x1b\\');
  });

  test('writeHyperlink writes to default output', () => {
    writeHyperlink('https://example.com', 'Test Link');
    expect(mockWriter.output[0]).toBe('\x1b]8;;https://example.com\x1b\\Test Link\x1b]8;;\x1b\\');
  });

  test('createHyperlink handles empty link', () => {
    const result = createHyperlink('', 'Just Text');
    expect(result).toBe('Just Text');
  });
});

describe('Global Notification Functions', () => {
  test('createNotification returns correct format', () => {
    const result = createNotification('Test Title', 'Test Body');
    expect(result).toBe('\x1b]777;notify;Test Title;Test Body\x1b\\');
  });

  test('sendNotification writes to default output', () => {
    sendNotification('Test Title', 'Test Body');
    expect(mockWriter.output[0]).toBe('\x1b]777;notify;Test Title;Test Body\x1b\\');
  });

  test('createNotification handles empty strings', () => {
    const result = createNotification('', '');
    expect(result).toBe('\x1b]777;notify;;\x1b\\');
  });
});

describe('Global Functions Integration', () => {
  test('multiple global functions work together', () => {
    clearScreen();
    moveCursor(1, 1);
    writeHyperlink('https://example.com', 'Example');
    sendNotification('Done', 'Screen cleared and positioned');

    expect(mockWriter.output.length).toBe(4);
    expect(mockWriter.output[0]).toBe('\x1b[2J');
    expect(mockWriter.output[1]).toBe('\x1b[1;1H');
    expect(mockWriter.output[2]).toBe('\x1b]8;;https://example.com\x1b\\Example\x1b]8;;\x1b\\');
    expect(mockWriter.output[3]).toBe('\x1b]777;notify;Done;Screen cleared and positioned\x1b\\');
  });

  test('functions work with custom default output', () => {
    const customWriter = new MockWriter();
    const customOutput = newOutput(customWriter as any);
    setDefaultOutput(customOutput);

    cursorUp(2);
    writeHyperlink('https://test.com', 'Test');

    expect(customWriter.output.length).toBe(2);
    expect(customWriter.output[0]).toBe('\x1b[2A');
    expect(customWriter.output[1]).toBe('\x1b]8;;https://test.com\x1b\\Test\x1b]8;;\x1b\\');
  });
});
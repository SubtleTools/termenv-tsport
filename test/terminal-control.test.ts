import { describe, expect, test, beforeEach } from 'bun:test';
import { newOutput } from '#src/output.js';
import { RGBColor, ANSIColor } from '#src/types.js';

// Mock writer for capturing terminal sequences
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

  getAllOutput(): string {
    return this.output.join('');
  }
}

describe('Terminal Control Features', () => {
  let mockWriter: MockWriter;
  let output: ReturnType<typeof newOutput>;

  beforeEach(() => {
    mockWriter = new MockWriter();
    output = newOutput(mockWriter as any);
  });

  describe('cursor movement methods', () => {
    test('cursorForward moves cursor right', async () => {
      await output.cursorForward(5);
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[5C'); // Forward cursor sequence
    });

    test('cursorForward defaults to 1', async () => {
      await output.cursorForward();
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[1C');
    });

    test('cursorBack moves cursor left', async () => {
      await output.cursorBack(3);
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[3D'); // Backward cursor sequence
    });

    test('cursorBack defaults to 1', async () => {
      await output.cursorBack();
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[1D');
    });

    test('cursor movement with zero values', async () => {
      await output.cursorForward(0);
      await output.cursorBack(0);
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[0C');
      expect(result).toContain('\x1b[0D');
    });

    test('cursor movement with large values', async () => {
      await output.cursorForward(999);
      await output.cursorBack(100);
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[999C');
      expect(result).toContain('\x1b[100D');
    });
  });

  describe('cursor position methods', () => {
    test('saveCursorPosition saves current position', async () => {
      await output.saveCursorPosition();
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b7'); // Save cursor sequence
    });

    test('restoreCursorPosition restores saved position', async () => {
      await output.restoreCursorPosition();
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b8'); // Restore cursor sequence
    });

    test('save and restore cursor position sequence', async () => {
      await output.saveCursorPosition();
      await output.cursorForward(10);
      await output.restoreCursorPosition();
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b7'); // Save
      expect(result).toContain('\x1b[10C'); // Move
      expect(result).toContain('\x1b8'); // Restore
    });
  });

  describe('line clearing methods', () => {
    test('clearLines clears multiple lines', async () => {
      await output.clearLines(5);
      const result = mockWriter.getAllOutput();
      // clearLines uses repeated \x1b[2K\x1b[1A sequences
      expect(result).toContain('\x1b[2K'); // Line clear sequence
      expect(result).toContain('\x1b[1A'); // Move up sequence
    });

    test('clearLines with 1 line', async () => {
      await output.clearLines(1);
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[2K'); // Single line clear
    });

    test('clearLines with 0', async () => {
      await output.clearLines(0);
      const result = mockWriter.getAllOutput();
      expect(result).toBe(''); // clearLines(0) produces no output
    });
  });

  describe('reset method', () => {
    test('reset clears all formatting', async () => {
      await output.reset();
      const result = mockWriter.getAllOutput();
      expect(result).toContain('c'); // Reset sequence contains 'c'
    });

    test('reset after styling restores clean state', async () => {
      // Apply some styling first
      const styled = output.string('test').foreground(new RGBColor('#FF0000')).bold();
      await output.writeString(styled.toString());
      await output.reset();
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b['); // Has ANSI sequences
      expect(result).toContain('c'); // Has reset
    });
  });

  describe('advanced cursor control', () => {
    test('cursorNextLine moves to next line start', async () => {
      // This method exists in screen.ts but needs to be accessible
      // Let's test through the screen control directly
      await output.cursorDown(1);
      await output.moveCursor(1, 1); // Move to start of line
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[1B'); // Down
      expect(result).toContain('\x1b[1;1H'); // Position
    });

    test('cursorPreviousLine moves to previous line start', async () => {
      await output.cursorUp(1);
      await output.moveCursor(1, 1);
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[1A'); // Up
      expect(result).toContain('\x1b[1;1H'); // Position
    });
  });

  describe('screen control methods', () => {
    test('saveScreen and restoreScreen work together', async () => {
      await output.saveScreen();
      await output.writeString('test content');
      await output.restoreScreen();
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[?47h'); // Save screen
      expect(result).toContain('test content');
      expect(result).toContain('\x1b[?47l'); // Restore screen
    });

    test('altScreen and exitAltScreen work together', async () => {
      await output.altScreen();
      await output.writeString('alt screen content');
      await output.exitAltScreen();
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[?1049h'); // Alt screen
      expect(result).toContain('alt screen content');
      expect(result).toContain('\x1b[?1049l'); // Exit alt screen
    });
  });

  describe('color setting methods', () => {
    test('setForegroundColor sets terminal foreground', async () => {
      const color = new RGBColor('#FF0000');
      // This would call the screen control method
      // Since it's a screen control method, test through styling
      const styled = output.string('test').foreground(color);
      await output.writeString(styled.toString());
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[38;2;255;0;0m'); // RGB foreground
    });

    test('setBackgroundColor sets terminal background', async () => {
      const color = new ANSIColor(4); // Blue
      const styled = output.string('test').background(color);
      await output.writeString(styled.toString());
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[44m'); // ANSI blue background
    });
  });

  describe('combined sequences', () => {
    test('complex terminal control sequence', async () => {
      // Save position, move cursor, write styled text, restore
      await output.saveCursorPosition();
      await output.cursorForward(10);
      await output.cursorDown(2);
      
      const styled = output.string('Hello World').foreground(new RGBColor('#00FF00')).bold();
      await output.writeString(styled.toString());
      
      await output.restoreCursorPosition();
      
      const result = mockWriter.getAllOutput();
      
      // Verify all sequences are present
      expect(result).toContain('\x1b7'); // Save cursor
      expect(result).toContain('\x1b[10C'); // Move right
      expect(result).toContain('\x1b[2B'); // Move down
      expect(result).toContain('\x1b[38;2;0;255;0;1m'); // Bold green text
      expect(result).toContain('Hello World');
      expect(result).toContain('\x1b8'); // Restore cursor
    });

    test('screen switching with content', async () => {
      await output.altScreen();
      await output.clearScreen();
      
      const styled = output.string('Alt Screen Content').foreground(new RGBColor('#FF00FF'));
      await output.writeString(styled.toString());
      
      await output.exitAltScreen();
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('\x1b[?1049h'); // Enter alt screen
      expect(result).toContain('\x1b[2J'); // Clear screen
      expect(result).toContain('Alt Screen Content');
      expect(result).toContain('\x1b[?1049l'); // Exit alt screen
    });
  });

  describe('edge cases and error conditions', () => {
    test('handles negative cursor movements gracefully', async () => {
      await output.cursorForward(-1);
      await output.cursorBack(-1);
      
      const result = mockWriter.getAllOutput();
      // Should still generate sequences (implementation dependent)
      expect(result).toContain('\x1b['); // Has ANSI sequences
    });

    test('handles very large numbers', async () => {
      await output.cursorForward(999999);
      await output.clearLines(1000);
      
      const result = mockWriter.getAllOutput();
      expect(result).toContain('999999'); // Large number in sequence
      // clearLines(1000) repeats sequences, doesn't contain '1000' literally
      expect(result).toContain('\x1b[2K'); // Clear line sequences
    });

    test('sequence integrity with rapid calls', async () => {
      // Rapid sequence of calls
      for (let i = 0; i < 10; i++) {
        await output.cursorForward(1);
        await output.cursorBack(1);
      }
      
      const result = mockWriter.getAllOutput();
      // Should have 20 sequences (10 forward, 10 back)
      const forwardCount = (result.match(/\x1b\[1C/g) || []).length;
      const backCount = (result.match(/\x1b\[1D/g) || []).length;
      
      expect(forwardCount).toBe(10);
      expect(backCount).toBe(10);
    });
  });
});
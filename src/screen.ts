/**
 * Screen and cursor control functionality
 * Port of github.com/muesli/termenv/screen.go
 */

import type { Color, Output } from './types.js';

/**
 * Terminal control sequences
 */
export const SEQUENCES = {
  // Cursor movement
  CursorUp: '\x1b[%dA',
  CursorDown: '\x1b[%dB', 
  CursorForward: '\x1b[%dC',
  CursorBack: '\x1b[%dD',
  CursorNextLine: '\x1b[%dE',
  CursorPreviousLine: '\x1b[%dF',
  CursorHorizontalAbsolute: '\x1b[%dG',
  CursorPosition: '\x1b[%d;%dH',
  
  // Cursor visibility
  SaveCursorPosition: '\x1b7',
  RestoreCursorPosition: '\x1b8',
  HideCursor: '\x1b[?25l',
  ShowCursor: '\x1b[?25h',
  
  // Screen clearing
  EraseDisplay: '\x1b[%dJ',
  EraseLine: '\x1b[%dK',
  
  // Screen modes
  AltScreen: '\x1b[?1049h',
  ExitAltScreen: '\x1b[?1049l',
  SaveScreen: '\x1b[?47h',
  RestoreScreen: '\x1b[?47l',
  
  // Reset
  Reset: '\x1bc',
  
  // Mouse support
  EnableMouse: '\x1b[?1000h',
  DisableMouse: '\x1b[?1000l',
  EnableMousePress: '\x1b[?1000h',
  DisableMousePress: '\x1b[?1000l',
  EnableMouseHilite: '\x1b[?1001h',
  DisableMouseHilite: '\x1b[?1001l',
  EnableMouseCellMotion: '\x1b[?1002h',
  DisableMouseCellMotion: '\x1b[?1002l',
  EnableMouseAllMotion: '\x1b[?1003h',
  DisableMouseAllMotion: '\x1b[?1003l',
  EnableMouseExtendedMode: '\x1b[?1006h',
  DisableMouseExtendedMode: '\x1b[?1006l',
  EnableMousePixelsMode: '\x1b[?1016h',
  DisableMousePixelsMode: '\x1b[?1016l',
  
  // Bracketed paste
  EnableBracketedPaste: '\x1b[?2004h',
  DisableBracketedPaste: '\x1b[?2004l',
  
  // Scrolling
  ChangeScrollingRegion: '\x1b[%d;%dr',
  InsertLines: '\x1b[%dL',
  DeleteLines: '\x1b[%dM',
} as const;

/**
 * Erase modes for EraseDisplay
 */
export enum EraseMode {
  EraseToEnd = 0,
  EraseToBeginning = 1,
  EraseEntireDisplay = 2,
  EraseSavedLines = 3,
}

/**
 * Erase modes for EraseLine
 */
export enum EraseLineMode {
  EraseToEnd = 0,
  EraseToBeginning = 1,
  EraseEntireLine = 2,
}

/**
 * Screen control functionality
 */
export class ScreenControl {
  constructor(private output: Output) {}

  // Cursor positioning
  moveCursor(row: number, column: number): this {
    this.output.writeString(SEQUENCES.CursorPosition.replace('%d', row.toString()).replace('%d', column.toString()));
    return this;
  }

  cursorUp(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorUp.replace('%d', n.toString()));
    return this;
  }

  cursorDown(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorDown.replace('%d', n.toString()));
    return this;
  }

  cursorForward(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorForward.replace('%d', n.toString()));
    return this;
  }

  cursorBack(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorBack.replace('%d', n.toString()));
    return this;
  }

  cursorNextLine(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorNextLine.replace('%d', n.toString()));
    return this;
  }

  cursorPreviousLine(n: number = 1): this {
    this.output.writeString(SEQUENCES.CursorPreviousLine.replace('%d', n.toString()));
    return this;
  }

  saveCursorPosition(): this {
    this.output.writeString(SEQUENCES.SaveCursorPosition);
    return this;
  }

  restoreCursorPosition(): this {
    this.output.writeString(SEQUENCES.RestoreCursorPosition);
    return this;
  }

  // Cursor visibility
  hideCursor(): this {
    this.output.writeString(SEQUENCES.HideCursor);
    return this;
  }

  showCursor(): this {
    this.output.writeString(SEQUENCES.ShowCursor);
    return this;
  }

  // Screen clearing
  clearScreen(): this {
    this.output.writeString(SEQUENCES.EraseDisplay.replace('%d', EraseMode.EraseEntireDisplay.toString()));
    return this;
  }

  clearLine(): this {
    this.output.writeString(SEQUENCES.EraseLine.replace('%d', EraseLineMode.EraseEntireLine.toString()));
    return this;
  }

  clearLines(n: number): this {
    for (let i = 0; i < n; i++) {
      this.clearLine();
      if (i < n - 1) {
        this.cursorUp(1);
      }
    }
    return this;
  }

  // Screen modes
  altScreen(): this {
    this.output.writeString(SEQUENCES.AltScreen);
    return this;
  }

  exitAltScreen(): this {
    this.output.writeString(SEQUENCES.ExitAltScreen);
    return this;
  }

  saveScreen(): this {
    this.output.writeString(SEQUENCES.SaveScreen);
    return this;
  }

  restoreScreen(): this {
    this.output.writeString(SEQUENCES.RestoreScreen);
    return this;
  }

  // Reset
  reset(): this {
    this.output.writeString(SEQUENCES.Reset);
    return this;
  }

  // Colors
  setForegroundColor(color: Color): this {
    this.output.writeString(`\x1b[38;${color.sequence(false)}`);
    return this;
  }

  setBackgroundColor(color: Color): this {
    this.output.writeString(`\x1b[48;${color.sequence(true)}`);
    return this;
  }

  setCursorColor(color: Color): this {
    // OSC 12 - Set cursor color
    this.output.writeString(`\x1b]12;${color.sequence(false)}\x07`);
    return this;
  }

  // Window title
  setWindowTitle(title: string): this {
    // OSC 2 - Set window title
    this.output.writeString(`\x1b]2;${title}\x07`);
    return this;
  }

  // Mouse support
  enableMouse(): this {
    this.output.writeString(SEQUENCES.EnableMouse);
    return this;
  }

  disableMouse(): this {
    this.output.writeString(SEQUENCES.DisableMouse);
    return this;
  }

  enableMousePress(): this {
    this.output.writeString(SEQUENCES.EnableMousePress);
    return this;
  }

  disableMousePress(): this {
    this.output.writeString(SEQUENCES.DisableMousePress);
    return this;
  }

  enableMouseHilite(): this {
    this.output.writeString(SEQUENCES.EnableMouseHilite);
    return this;
  }

  disableMouseHilite(): this {
    this.output.writeString(SEQUENCES.DisableMouseHilite);
    return this;
  }

  enableMouseCellMotion(): this {
    this.output.writeString(SEQUENCES.EnableMouseCellMotion);
    return this;
  }

  disableMouseCellMotion(): this {
    this.output.writeString(SEQUENCES.DisableMouseCellMotion);
    return this;
  }

  enableMouseAllMotion(): this {
    this.output.writeString(SEQUENCES.EnableMouseAllMotion);
    return this;
  }

  disableMouseAllMotion(): this {
    this.output.writeString(SEQUENCES.DisableMouseAllMotion);
    return this;
  }

  enableMouseExtendedMode(): this {
    this.output.writeString(SEQUENCES.EnableMouseExtendedMode);
    return this;
  }

  disableMouseExtendedMode(): this {
    this.output.writeString(SEQUENCES.DisableMouseExtendedMode);
    return this;
  }

  enableMousePixelsMode(): this {
    this.output.writeString(SEQUENCES.EnableMousePixelsMode);
    return this;
  }

  disableMousePixelsMode(): this {
    this.output.writeString(SEQUENCES.DisableMousePixelsMode);
    return this;
  }

  // Bracketed paste
  enableBracketedPaste(): this {
    this.output.writeString(SEQUENCES.EnableBracketedPaste);
    return this;
  }

  disableBracketedPaste(): this {
    this.output.writeString(SEQUENCES.DisableBracketedPaste);
    return this;
  }

  // Scrolling
  changeScrollingRegion(top: number, bottom: number): this {
    this.output.writeString(SEQUENCES.ChangeScrollingRegion.replace('%d', top.toString()).replace('%d', bottom.toString()));
    return this;
  }

  insertLines(n: number): this {
    this.output.writeString(SEQUENCES.InsertLines.replace('%d', n.toString()));
    return this;
  }

  deleteLines(n: number): this {
    this.output.writeString(SEQUENCES.DeleteLines.replace('%d', n.toString()));
    return this;
  }
}
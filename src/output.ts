/**
 * Output implementation for termenv.
 * Port of github.com/muesli/termenv Output struct to TypeScript.
 */

import { Style } from './style.js';
import {
  ANSI256Color,
  ANSIColor,
  BEL,
  type Color,
  convertToRGB,
  type Environ,
  ESC,
  type Output as IOutput,
  NoColor,
  type OutputOption,
  ProcessEnviron,
  Profile,
  RGBColor,
  ST,
} from './types.js';
import { ScreenControl } from './screen.js';
import { HyperlinkControl } from './hyperlink.js';
import { NotificationControl } from './notification.js';

// Default global output instance
let defaultOutput: OutputImpl;

/**
 * Output implementation class - direct port of Go Output struct
 */
export class OutputImpl implements IOutput {
  public profile: Profile;
  public assumeTTY: boolean = false;
  public unsafe: boolean = false;
  public cache: boolean = false;
  public environ: Environ;

  private _writer: NodeJS.WriteStream | NodeJS.WritableStream;
  private _fgColor: Color | null = null;
  private _bgColor: Color | null = null;
  private _fgCached: boolean = false;
  private _bgCached: boolean = false;

  // Control classes for additional functionality
  private _screen: ScreenControl;
  private _hyperlink: HyperlinkControl;
  private _notification: NotificationControl;

  constructor(
    writer: NodeJS.WriteStream | NodeJS.WritableStream,
    ...opts: OutputOption<OutputImpl>[]
  ) {
    this._writer = writer || process.stdout;
    this.environ = new ProcessEnviron();
    this.profile = -1 as Profile; // Will be set by envColorProfile

    // Initialize control classes
    this._screen = new ScreenControl(this);
    this._hyperlink = new HyperlinkControl(this);
    this._notification = new NotificationControl(this);

    // Apply options
    for (const opt of opts) {
      opt(this);
    }

    // Auto-detect profile if not set
    if (this.profile < 0) {
      this.profile = this.envColorProfile();
    }
  }

  writer(): NodeJS.WriteStream | NodeJS.WritableStream {
    return this._writer;
  }

  async write(data: Uint8Array): Promise<number> {
    return new Promise((resolve, reject) => {
      this._writer.write(data, (err) => {
        if (err) reject(err);
        else resolve(data.length);
      });
    });
  }

  async writeString(s: string): Promise<number> {
    return this.write(new TextEncoder().encode(s));
  }

  string(...strings: string[]): Style {
    return new Style(this.profile, strings.join(' '));
  }

  // Go-style API compatibility methods (PascalCase)
  String(...strings: string[]): Style {
    return this.string(...strings);
  }

  Color(s: string): Color | null {
    return this.color(s);
  }

  ColorProfile(): Profile {
    return this.colorProfile();
  }

  EnvColorProfile(): Profile {
    return this.envColorProfile();
  }

  EnvNoColor(): boolean {
    return this.envNoColor();
  }

  HasDarkBackground(): boolean {
    return this.hasDarkBackground();
  }

  ForegroundColor(): Color {
    return this.foregroundColor();
  }

  BackgroundColor(): Color {
    return this.backgroundColor();
  }

  isTTY(): boolean {
    if (this.assumeTTY || this.unsafe) {
      return true;
    }

    // Check CI environment
    if (this.environ.getenv('CI').length > 0) {
      return false;
    }

    // Check if writer has isTTY method (like process.stdout/stderr)
    const writer = this._writer as NodeJS.WriteStream;
    if (writer && typeof writer.isTTY === 'boolean') {
      return writer.isTTY;
    }

    return false;
  }

  colorProfile(): Profile {
    if (!this.isTTY()) {
      return Profile.Ascii;
    }

    // Google Cloud Shell
    if (this.environ.getenv('GOOGLE_CLOUD_SHELL') === 'true') {
      return Profile.TrueColor;
    }

    const term = this.environ.getenv('TERM').toLowerCase();
    const colorTerm = this.environ.getenv('COLORTERM').toLowerCase();

    // TrueColor support
    if (colorTerm === 'truecolor' || colorTerm === '24bit') {
      // tmux supports TrueColor, screen only ANSI256
      if (term.startsWith('screen') && this.environ.getenv('TERM_PROGRAM') !== 'tmux') {
        return Profile.ANSI256;
      }
      return Profile.TrueColor;
    }

    if (colorTerm === 'yes' || colorTerm === 'true') {
      return Profile.ANSI256;
    }

    // Check for specific terminal types
    const trueColorTerms = [
      'alacritty',
      'contour',
      'rio',
      'wezterm',
      'xterm-ghostty',
      'xterm-kitty',
    ];

    for (const t of trueColorTerms) {
      if (term === t) {
        return Profile.TrueColor;
      }
    }

    if (term === 'linux' || term === 'xterm') {
      return Profile.ANSI;
    }

    // 256 color support
    if (term.includes('256color')) {
      return Profile.ANSI256;
    }
    if (term.includes('color')) {
      return Profile.ANSI;
    }
    if (term.includes('ansi')) {
      return Profile.ANSI;
    }

    // Default to no color for unknown terminals
    return Profile.Ascii;
  }

  envColorProfile(): Profile {
    if (this.envNoColor()) {
      return Profile.Ascii;
    }

    const p = this.colorProfile();
    if (this.cliColorForced() && p === Profile.Ascii) {
      return Profile.ANSI;
    }

    return p;
  }

  envNoColor(): boolean {
    const noColor = this.environ.getenv('NO_COLOR');
    const cliColor = this.environ.getenv('CLICOLOR');

    return noColor !== '' || (cliColor === '0' && !this.cliColorForced());
  }

  private cliColorForced(): boolean {
    const forced = this.environ.getenv('CLICOLOR_FORCE');
    return forced !== '' && forced !== '0';
  }

  foregroundColor(): Color {
    if (this.cache) {
      if (!this._fgCached) {
        this._fgColor = this._foregroundColor();
        this._fgCached = true;
      }
      return this._fgColor || new NoColor();
    }
    return this._foregroundColor();
  }

  backgroundColor(): Color {
    if (this.cache) {
      if (!this._bgCached) {
        this._bgColor = this._backgroundColor();
        this._bgCached = true;
      }
      return this._bgColor || new NoColor();
    }
    return this._backgroundColor();
  }

  private _foregroundColor(): Color {
    if (!this.isTTY()) {
      return new NoColor();
    }

    // Try terminal status report (not implemented in Node.js for simplicity)
    // In a full implementation, this would query the terminal

    // Check COLORFGBG environment variable
    const colorFGBG = this.environ.getenv('COLORFGBG');
    if (colorFGBG.includes(';')) {
      const parts = colorFGBG.split(';');
      const fgStr = parts[0];
      if (fgStr) {
        const fg = parseInt(fgStr, 10);
        if (!Number.isNaN(fg)) {
          return new ANSIColor(fg);
        }
      }
    }

    // Default to no color (matches Go behavior)
    return new NoColor();
  }

  private _backgroundColor(): Color {
    if (!this.isTTY()) {
      return new NoColor();
    }

    // Try terminal status report (not implemented in Node.js for simplicity)
    // In a full implementation, this would query the terminal

    // Check COLORFGBG environment variable
    const colorFGBG = this.environ.getenv('COLORFGBG');
    if (colorFGBG.includes(';')) {
      const parts = colorFGBG.split(';');
      const bgStr = parts[parts.length - 1];
      if (bgStr) {
        const bg = parseInt(bgStr, 10);
        if (!Number.isNaN(bg)) {
          return new ANSIColor(bg);
        }
      }
    }

    // Default to no color (matches Go behavior)
    return new NoColor();
  }

  hasDarkBackground(): boolean {
    const c = convertToRGB(this.backgroundColor());
    if (!c) {
      // Default to dark background assumption when color cannot be determined (matches Go behavior)
      return true;
    }

    const [_, __, l] = c.hsl();
    return l < 0.5;
  }

  /**
   * Color creates a Color from a string. Valid inputs are hex colors, as well as
   * ANSI color codes (0-15, 16-255).
   * This method is a direct port of the Go Profile.Color method, adapted for Output.
   */
  color(s: string): Color | null {
    if (!s || s.length === 0) {
      return null;
    }

    let c: Color;
    if (s.startsWith('#')) {
      c = new RGBColor(s);
    } else {
      const i = parseInt(s, 10);
      if (Number.isNaN(i)) {
        return null;
      }

      if (i < 16) {
        c = new ANSIColor(i);
      } else {
        c = new ANSI256Color(i);
      }
    }

    return this.convertColor(c);
  }

  /**
   * Convert transforms a given Color to a Color supported within the current Profile.
   * Port of Go Profile.Convert method.
   */
  private convertColor(c: Color): Color {
    if (this.profile === Profile.Ascii) {
      return new NoColor();
    }

    if (c instanceof ANSIColor) {
      return c;
    }

    if (c instanceof ANSI256Color) {
      if (this.profile === Profile.ANSI) {
        return this.ansi256ToANSIColor(c);
      }
      return c;
    }

    if (c instanceof RGBColor) {
      const colorfulColor = convertToRGB(c);
      if (!colorfulColor) {
        return new NoColor();
      }
      if (this.profile !== Profile.TrueColor) {
        const ac = this.hexToANSI256Color(colorfulColor);
        if (this.profile === Profile.ANSI) {
          return this.ansi256ToANSIColor(ac);
        }
        return ac;
      }
      return c;
    }

    return c;
  }

  /**
   * Convert ANSI256Color to ANSIColor using HSLuv distance matching.
   * Port of Go ansi256ToANSIColor function.
   */
  private ansi256ToANSIColor(c: ANSI256Color): ANSIColor {
    let result = 0;
    let minDistance = Number.MAX_VALUE;

    const sourceColor = convertToRGB(c);
    if (!sourceColor) {
      return new ANSIColor(0);
    }

    for (let i = 0; i <= 15; i++) {
      const ansiColor = new ANSIColor(i);
      const targetColor = convertToRGB(ansiColor);
      if (!targetColor) continue;

      const distance = sourceColor.distanceHSLuv(targetColor);
      if (distance < minDistance) {
        minDistance = distance;
        result = i;
      }
    }

    return new ANSIColor(result);
  }

  /**
   * Convert RGB color to ANSI256Color using the same algorithm as Go.
   * Port of Go hexToANSI256Color function.
   */
  private hexToANSI256Color(c: ReturnType<typeof convertToRGB>): ANSI256Color {
    if (!c) {
      return new ANSI256Color(0);
    }

    const v2ci = (v: number): number => {
      if (v < 48) return 0;
      if (v < 115) return 1;
      return Math.floor((v - 35) / 40);
    };

    // Calculate the nearest 0-based color index at 16..231
    const r = v2ci(c.r * 255.0); // 0..5 each
    const g = v2ci(c.g * 255.0);
    const b = v2ci(c.b * 255.0);
    const ci = 36 * r + 6 * g + b; // 0..215

    // Calculate the represented colors back from the index
    const i2cv = [0, 0x5f, 0x87, 0xaf, 0xd7, 0xff];
    const cr = i2cv[r] ?? 0; // r/g/b, 0..255 each
    const cg = i2cv[g] ?? 0;
    const cb = i2cv[b] ?? 0;

    // Calculate the nearest 0-based gray index at 232..255
    let grayIdx: number;
    const average = (r + g + b) / 3;
    if (average > 238) {
      grayIdx = 23;
    } else {
      grayIdx = Math.floor((average - 3) / 10); // 0..23
    }
    const gv = 8 + 10 * grayIdx; // same value for r/g/b, 0..255

    // Return the one which is nearer to the original input rgb value
    const c2 = { r: cr / 255.0, g: cg / 255.0, b: cb / 255.0 };
    const g2 = { r: gv / 255.0, g: gv / 255.0, b: gv / 255.0 };

    // Simple RGB distance calculation (could use HSLuv for better accuracy)
    const colorDist = Math.sqrt((c.r - c2.r) ** 2 + (c.g - c2.g) ** 2 + (c.b - c2.b) ** 2);
    const grayDist = Math.sqrt((c.r - g2.r) ** 2 + (c.g - g2.g) ** 2 + (c.b - g2.b) ** 2);

    if (colorDist <= grayDist) {
      return new ANSI256Color(16 + ci);
    }
    return new ANSI256Color(232 + grayIdx);
  }

  // Terminal control methods - delegate to ScreenControl
  moveCursor(row: number, column: number): void {
    this._screen.moveCursor(row, column);
  }

  cursorUp(n: number = 1): void {
    this._screen.cursorUp(n);
  }

  cursorDown(n: number = 1): void {
    this._screen.cursorDown(n);
  }

  cursorForward(n: number = 1): void {
    this._screen.cursorForward(n);
  }

  cursorBack(n: number = 1): void {
    this._screen.cursorBack(n);
  }

  saveCursorPosition(): void {
    this._screen.saveCursorPosition();
  }

  restoreCursorPosition(): void {
    this._screen.restoreCursorPosition();
  }

  hideCursor(): void {
    this._screen.hideCursor();
  }

  showCursor(): void {
    this._screen.showCursor();
  }

  clearScreen(): void {
    this._screen.clearScreen();
  }

  clearLine(): void {
    this._screen.clearLine();
  }

  clearLines(n: number): void {
    this._screen.clearLines(n);
  }

  altScreen(): void {
    this._screen.altScreen();
  }

  exitAltScreen(): void {
    this._screen.exitAltScreen();
  }

  saveScreen(): void {
    this._screen.saveScreen();
  }

  restoreScreen(): void {
    this._screen.restoreScreen();
  }

  reset(): void {
    this._screen.reset();
  }

  setForegroundColor(color: Color): void {
    this._screen.setForegroundColor(color);
  }

  setBackgroundColor(color: Color): void {
    this._screen.setBackgroundColor(color);
  }

  setCursorColor(color: Color): void {
    this._screen.setCursorColor(color);
  }

  setWindowTitle(title: string): void {
    this._screen.setWindowTitle(title);
  }

  // Mouse support methods
  enableMouse(): void {
    this._screen.enableMouse();
  }

  disableMouse(): void {
    this._screen.disableMouse();
  }

  enableMousePress(): void {
    this._screen.enableMousePress();
  }

  disableMousePress(): void {
    this._screen.disableMousePress();
  }

  enableMouseHilite(): void {
    this._screen.enableMouseHilite();
  }

  disableMouseHilite(): void {
    this._screen.disableMouseHilite();
  }

  enableMouseCellMotion(): void {
    this._screen.enableMouseCellMotion();
  }

  disableMouseCellMotion(): void {
    this._screen.disableMouseCellMotion();
  }

  enableMouseAllMotion(): void {
    this._screen.enableMouseAllMotion();
  }

  disableMouseAllMotion(): void {
    this._screen.disableMouseAllMotion();
  }

  enableMouseExtendedMode(): void {
    this._screen.enableMouseExtendedMode();
  }

  disableMouseExtendedMode(): void {
    this._screen.disableMouseExtendedMode();
  }

  enableMousePixelsMode(): void {
    this._screen.enableMousePixelsMode();
  }

  disableMousePixelsMode(): void {
    this._screen.disableMousePixelsMode();
  }

  // Bracketed paste
  enableBracketedPaste(): void {
    this._screen.enableBracketedPaste();
  }

  disableBracketedPaste(): void {
    this._screen.disableBracketedPaste();
  }

  // Scrolling
  changeScrollingRegion(top: number, bottom: number): void {
    this._screen.changeScrollingRegion(top, bottom);
  }

  insertLines(n: number): void {
    this._screen.insertLines(n);
  }

  deleteLines(n: number): void {
    this._screen.deleteLines(n);
  }

  // Hyperlinks - delegate to HyperlinkControl
  hyperlink(link: string, name: string): void {
    this._hyperlink.hyperlink(link, name);
  }

  // Notifications - delegate to NotificationControl
  notify(title: string, body: string): void {
    this._notification.notify(title, body);
  }
}

/**
 * Factory functions and options - direct port of Go functions
 */

export function newOutput(
  writer?: NodeJS.WriteStream | NodeJS.WritableStream,
  ...opts: OutputOption<OutputImpl>[]
): OutputImpl {
  return new OutputImpl(writer || process.stdout, ...opts);
}

export function withProfile(profile: Profile): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.profile = profile;
  };
}

export function withColorCache(enabled: boolean): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.cache = enabled;

    // Pre-cache colors if enabled
    if (enabled) {
      o.foregroundColor();
      o.backgroundColor();
    }
  };
}

export function withEnvironment(environ: Environ): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.environ = environ;
  };
}

export function withTTY(assumeTTY: boolean): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.assumeTTY = assumeTTY;
  };
}

export function withUnsafe(): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.unsafe = true;
  };
}

/**
 * Global default output management
 */
export function defaultOutputInstance(): OutputImpl {
  if (!defaultOutput) {
    defaultOutput = newOutput(process.stdout);
  }
  return defaultOutput;
}

export function setDefaultOutput(output: OutputImpl): void {
  defaultOutput = output;
}

/**
 * Parse xTerm color response - simplified version of Go xTermColor function
 */
export function parseXTermColor(s: string): RGBColor | null {
  try {
    if (s.length < 24 || s.length > 25) {
      return null;
    }

    let response = s;

    // Remove terminator
    if (response.endsWith(BEL)) {
      response = response.slice(0, -1);
    } else if (response.endsWith(ESC)) {
      response = response.slice(0, -1);
    } else if (response.endsWith(ST)) {
      response = response.slice(0, -ST.length);
    } else {
      return null;
    }

    // Remove OSC prefix
    if (response.length < 4) return null;
    response = response.slice(4);

    const prefix = ';rgb:';
    if (!response.startsWith(prefix)) {
      return null;
    }
    response = response.slice(prefix.length);

    const parts = response.split('/');
    if (parts.length !== 3) return null;

    const r = parts[0]?.slice(0, 2) || '00';
    const g = parts[1]?.slice(0, 2) || '00';
    const b = parts[2]?.slice(0, 2) || '00';
    const hex = `#${r}${g}${b}`;
    return new RGBColor(hex);
  } catch {
    return null;
  }
}

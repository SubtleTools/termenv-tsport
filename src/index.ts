/**
 * @tsports/termenv - TypeScript port of termenv
 *
 * This is the main export file for the TypeScript-native API.
 * Port of github.com/muesli/termenv Go package to TypeScript.
 *
 * @packageDocumentation
 * @version 1.0.0
 * @author TSports Team
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { colorProfile, string, rgbColor } from '@tsports/termenv';
 *
 * const profile = colorProfile();
 * const styled = string('Hello World')
 *   .foreground(rgbColor('#FF0000'))
 *   .bold();
 * console.log(styled.toString());
 * ```
 */

// Export hyperlink functionality
export { HyperlinkControl, hyperlink } from './hyperlink.js';
// Export notification functionality
export { NotificationControl, notify } from './notification.js';
// Export output implementation and factory functions
export {
  defaultOutputInstance,
  newOutput,
  OutputImpl,
  setDefaultOutput,
  withColorCache,
  withEnvironment,
  withProfile,
  withTTY,
  withUnsafe,
} from './output.js';
// Export profile utilities
export { ProfileUtils } from './profile.js';
// Export screen control functionality
export { EraseLineMode, EraseMode, ScreenControl, SEQUENCES } from './screen.js';
// Export style implementation
export { Style } from './style.js';
// Export all core types and interfaces
export type {
  Color,
  Environ,
  File,
  Output,
  OutputOption,
} from './types.js';
// Export all error classes
// Export enum types
// Export color classes for direct usage
// Export color constants
// Export utility functions
export {
  ANSI256Color,
  ANSIBlack,
  ANSIBlue,
  ANSIBrightBlack,
  ANSIBrightBlue,
  ANSIBrightCyan,
  ANSIBrightGreen,
  ANSIBrightMagenta,
  ANSIBrightRed,
  ANSIBrightWhite,
  ANSIBrightYellow,
  ANSIColor,
  ANSICyan,
  ANSIGreen,
  ANSIMagenta,
  ANSIRed,
  ANSIWhite,
  ANSIYellow,
  convertToRGB,
  InvalidColorError,
  NoColor,
  Profile,
  RGBColor,
  StatusReportError,
  TermEnvError,
} from './types.js';

import { hyperlink } from './hyperlink.js';
import { notify } from './notification.js';
// Global convenience functions - matches Go termenv package API
import { defaultOutputInstance } from './output.js';
import { ProfileUtils } from './profile.js';
import { ANSI256Color, ANSIColor, type Color, NoColor, type Profile, RGBColor } from './types.js';

/**
 * String returns a new styled string for the default output
 */
export function string(...strings: string[]): import('./style.js').Style {
  return defaultOutputInstance().string(...strings);
}

/**
 * ColorProfile returns the supported color profile for the default output
 */
export function colorProfile(): Profile {
  return defaultOutputInstance().colorProfile();
}

/**
 * EnvColorProfile returns the color profile based on environment variables for the default output
 */
export function envColorProfile(): Profile {
  return defaultOutputInstance().envColorProfile();
}

/**
 * EnvNoColor returns true if the environment variables explicitly disable color output
 */
export function envNoColor(): boolean {
  return defaultOutputInstance().envNoColor();
}

/**
 * HasDarkBackground returns true if the terminal has a dark background
 */
export function hasDarkBackground(): boolean {
  return defaultOutputInstance().hasDarkBackground();
}

/**
 * ForegroundColor returns the terminal's default foreground color
 */
export function foregroundColor(): Color {
  return defaultOutputInstance().foregroundColor();
}

/**
 * BackgroundColor returns the terminal's default background color
 */
export function backgroundColor(): Color {
  return defaultOutputInstance().backgroundColor();
}

/**
 * NoColor creates a NoColor instance
 */
export function noColor(): NoColor {
  return new NoColor();
}

/**
 * ANSIColor creates an ANSI color (0-15)
 */
export function ansiColor(value: number): ANSIColor {
  return new ANSIColor(value);
}

/**
 * ANSI256Color creates an ANSI256 color (0-255)
 */
export function ansi256Color(value: number): ANSI256Color {
  return new ANSI256Color(value);
}

/**
 * RGBColor creates an RGB color from hex string
 */
export function rgbColor(hex: string): RGBColor {
  return new RGBColor(hex);
}

/**
 * Color creates a color from string, supporting hex colors and ANSI color codes
 */
export function color(s: string): Color | null {
  return ProfileUtils.color(colorProfile(), s);
}

/**
 * ProfileName returns the name of the profile as a string
 */
export function profileName(profile: Profile): string {
  return ProfileUtils.getName(profile);
}

// Screen control global functions
/**
 * MoveCursor moves the cursor to the given position
 */
export function moveCursor(row: number, column: number): void {
  defaultOutputInstance().moveCursor(row, column);
}

/**
 * CursorUp moves the cursor up n lines
 */
export function cursorUp(n: number = 1): void {
  defaultOutputInstance().cursorUp(n);
}

/**
 * CursorDown moves the cursor down n lines
 */
export function cursorDown(n: number = 1): void {
  defaultOutputInstance().cursorDown(n);
}

/**
 * ClearScreen clears the entire screen
 */
export function clearScreen(): void {
  defaultOutputInstance().clearScreen();
}

/**
 * ClearLine clears the current line
 */
export function clearLine(): void {
  defaultOutputInstance().clearLine();
}

/**
 * HideCursor hides the cursor
 */
export function hideCursor(): void {
  defaultOutputInstance().hideCursor();
}

/**
 * ShowCursor shows the cursor
 */
export function showCursor(): void {
  defaultOutputInstance().showCursor();
}

/**
 * AltScreen switches to the alternate screen
 */
export function altScreen(): void {
  defaultOutputInstance().altScreen();
}

/**
 * ExitAltScreen exits the alternate screen
 */
export function exitAltScreen(): void {
  defaultOutputInstance().exitAltScreen();
}

/**
 * SetWindowTitle sets the terminal window title
 */
export function setWindowTitle(title: string): void {
  defaultOutputInstance().setWindowTitle(title);
}

// Mouse support global functions
/**
 * EnableMouse enables mouse support
 */
export function enableMouse(): void {
  defaultOutputInstance().enableMouse();
}

/**
 * DisableMouse disables mouse support
 */
export function disableMouse(): void {
  defaultOutputInstance().disableMouse();
}

// Hyperlink global functions
/**
 * CreateHyperlink creates a clickable hyperlink (convenience function, doesn't write to output)
 */
export function createHyperlink(link: string, name: string): string {
  return hyperlink(link, name);
}

/**
 * WriteHyperlink writes a hyperlink to the default output
 */
export function writeHyperlink(link: string, name: string): void {
  defaultOutputInstance().hyperlink(link, name);
}

// Notification global functions
/**
 * CreateNotification creates a notification string (convenience function, doesn't write to output)
 */
export function createNotification(title: string, body: string): string {
  return notify(title, body);
}

/**
 * SendNotification sends a notification to the terminal
 */
export function sendNotification(title: string, body: string): void {
  defaultOutputInstance().notify(title, body);
}

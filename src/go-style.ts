/**
 * @tsports/termenv - Go-compatible API
 *
 * This file provides the Go-compatible API with PascalCase naming conventions.
 * Maintains 100% API compatibility with the original termenv Go package.
 *
 * @packageDocumentation
 * @version 1.0.0
 * @author TSports Team
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { String, ColorProfile, RGBColor } from '@tsports/termenv/go-style';
 *
 * // Use Go-style PascalCase naming exactly as in Go
 * const profile = ColorProfile();
 * const styled = String('Hello World')
 *   .Foreground(RGBColor('#FF0000'))
 *   .Bold();
 * console.log(styled.String());
 * ```
 *
 * @remarks
 * This module provides a Go-compatible interface for developers familiar with the original
 * termenv package. All function names, parameter names, and behavior match
 * the Go implementation exactly.
 */

// Re-export all types with Go-compatible names (excluding Color interface to avoid conflict with Color function)
// Re-export Color interface with qualified name
export type { Color as ColorInterface, Environ, File, Output, OutputOption } from './types.js';
// Re-export all error classes
// Re-export enum types and create enum value constants for Go-style usage
export {
  InvalidColorError,
  Profile,
  StatusReportError,
  TermEnvError,
} from './types.js';

// Export Profile enum values as constants for Go-style usage
// These values match the enum definitions in types.ts
export const TrueColor = 0 as const;
export const ANSI256 = 1 as const;
export const ANSI = 2 as const;
export const Ascii = 3 as const;

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
export { ProfileUtils } from './profile.js';
// Re-export classes and functions
export { Style } from './style.js';
// Re-export color classes using qualified names to avoid conflicts
// Re-export color constants with Go-style names
// Re-export utility functions
export {
  ANSI256Color as ANSI256ColorClass,
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
  ANSIColor as ANSIColorClass,
  ANSICyan,
  ANSIGreen,
  ANSIMagenta,
  ANSIRed,
  ANSIWhite,
  ANSIYellow,
  convertToRGB,
  NoColor as NoColorClass,
  RGBColor as RGBColorClass,
} from './types.js';

// Import base functionality
import {
  altScreen as altScreenFunc,
  ansi256Color as ansi256ColorFunc,
  ansiColor as ansiColorFunc,
  backgroundColor as backgroundColorFunc,
  clearLine as clearLineFunc,
  clearScreen as clearScreenFunc,
  color as colorFunc,
  colorProfile as colorProfileFunc,
  cursorDown as cursorDownFunc,
  cursorUp as cursorUpFunc,
  disableMouse as disableMouseFunc,
  enableMouse as enableMouseFunc,
  envColorProfile as envColorProfileFunc,
  envNoColor as envNoColorFunc,
  exitAltScreen as exitAltScreenFunc,
  foregroundColor as foregroundColorFunc,
  hasDarkBackground as hasDarkBackgroundFunc,
  hideCursor as hideCursorFunc,
  createHyperlink as hyperlinkFunc,
  // Screen control functions
  moveCursor as moveCursorFunc,
  noColor as noColorFunc,
  createNotification as notificationFunc,
  profileName as profileNameFunc,
  rgbColor as rgbColorFunc,
  sendNotification as sendNotificationFunc,
  setWindowTitle as setWindowTitleFunc,
  showCursor as showCursorFunc,
  string as stringFunc,
} from './index.js';
import type { OutputImpl } from './output.js';
import { newOutput as newOutputFunc } from './output.js';
import { ProfileUtils } from './profile.js';
import type { Color as ColorInterface, OutputOption, Profile } from './types.js';

// Go-compatible API functions with PascalCase naming

/**
 * String returns a new styled string for the default output - matches Go String function
 * Note: Using non-standard name to avoid shadowing global String
 */
// biome-ignore lint/suspicious/noShadowRestrictedNames: Go API compatibility requires this name
export function String(...strings: string[]): import('./style.js').Style {
  return stringFunc(...strings);
}

/**
 * ColorProfile returns the supported color profile for the default output - matches Go ColorProfile function
 */
export function ColorProfile(): Profile {
  return colorProfileFunc();
}

/**
 * EnvColorProfile returns the color profile based on environment variables - matches Go EnvColorProfile function
 */
export function EnvColorProfile(): Profile {
  return envColorProfileFunc();
}

/**
 * EnvNoColor returns true if the environment variables explicitly disable color output - matches Go EnvNoColor function
 */
export function EnvNoColor(): boolean {
  return envNoColorFunc();
}

/**
 * HasDarkBackground returns true if the terminal has a dark background - matches Go HasDarkBackground function
 */
export function HasDarkBackground(): boolean {
  return hasDarkBackgroundFunc();
}

/**
 * ForegroundColor returns the terminal's default foreground color - matches Go ForegroundColor function
 */
export function ForegroundColor(): ColorInterface {
  return foregroundColorFunc();
}

/**
 * BackgroundColor returns the terminal's default background color - matches Go BackgroundColor function
 */
export function BackgroundColor(): ColorInterface {
  return backgroundColorFunc();
}

/**
 * NoColor creates a NoColor instance - matches Go NoColor function
 */
export function NoColor(): import('./types.js').NoColor {
  return noColorFunc();
}

/**
 * ANSIColor creates an ANSI color (0-15) - matches Go ANSIColor function
 */
export function ANSIColor(value: number): import('./types.js').ANSIColor {
  return ansiColorFunc(value);
}

/**
 * ANSI256Color creates an ANSI256 color (0-255) - matches Go ANSI256Color function
 */
export function ANSI256Color(value: number): import('./types.js').ANSI256Color {
  return ansi256ColorFunc(value);
}

/**
 * RGBColor creates an RGB color from hex string - matches Go RGBColor function
 */
export function RGBColor(hex: string): import('./types.js').RGBColor {
  return rgbColorFunc(hex);
}

/**
 * Color creates a color from string - matches Go Color function
 */
export function Color(s: string): ColorInterface | null {
  return colorFunc(s);
}

/**
 * ProfileName returns the name of the profile as a string - matches Go ProfileName function
 */
export function ProfileName(profile: Profile): string {
  return profileNameFunc(profile);
}

/**
 * NewOutput creates a new Output instance - matches Go NewOutput function
 */
export function NewOutput(
  writer?: NodeJS.WriteStream | NodeJS.WritableStream,
  ...opts: OutputOption<OutputImpl>[]
): OutputImpl {
  return newOutputFunc(writer, ...opts);
}

/**
 * WithProfile sets the color profile for an Output - matches Go WithProfile function
 */
export function WithProfile(profile: Profile): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.profile = profile;
  };
}

/**
 * WithColorCache enables/disables color caching for an Output - matches Go WithColorCache function
 */
export function WithColorCache(enabled: boolean): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.cache = enabled;
    if (enabled) {
      o.foregroundColor();
      o.backgroundColor();
    }
  };
}

/**
 * WithEnvironment sets the environment for an Output - matches Go WithEnvironment function
 */
export function WithEnvironment(environ: import('./types.js').Environ): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.environ = environ;
  };
}

/**
 * WithTTY forces TTY assumption for an Output - matches Go WithTTY function
 */
export function WithTTY(assumeTTY: boolean): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.assumeTTY = assumeTTY;
  };
}

/**
 * WithUnsafe enables unsafe mode for an Output - matches Go WithUnsafe function
 */
export function WithUnsafe(): OutputOption<OutputImpl> {
  return (o: OutputImpl) => {
    o.unsafe = true;
  };
}

/**
 * Convert transforms a given Color to a Color supported within the Profile - matches Go Convert function
 */
export function Convert(profile: Profile, color: ColorInterface): ColorInterface {
  return ProfileUtils.convert(profile, color);
}

// Screen control Go-style functions
/**
 * MoveCursor moves the cursor to the given position - matches Go MoveCursor function
 */
export function MoveCursor(row: number, column: number): void {
  moveCursorFunc(row, column);
}

/**
 * CursorUp moves the cursor up n lines - matches Go CursorUp function
 */
export function CursorUp(n: number = 1): void {
  cursorUpFunc(n);
}

/**
 * CursorDown moves the cursor down n lines - matches Go CursorDown function
 */
export function CursorDown(n: number = 1): void {
  cursorDownFunc(n);
}

/**
 * ClearScreen clears the entire screen - matches Go ClearScreen function
 */
export function ClearScreen(): void {
  clearScreenFunc();
}

/**
 * ClearLine clears the current line - matches Go ClearLine function
 */
export function ClearLine(): void {
  clearLineFunc();
}

/**
 * HideCursor hides the cursor - matches Go HideCursor function
 */
export function HideCursor(): void {
  hideCursorFunc();
}

/**
 * ShowCursor shows the cursor - matches Go ShowCursor function
 */
export function ShowCursor(): void {
  showCursorFunc();
}

/**
 * AltScreen switches to alternate screen - matches Go AltScreen function
 */
export function AltScreen(): void {
  altScreenFunc();
}

/**
 * ExitAltScreen exits alternate screen - matches Go ExitAltScreen function
 */
export function ExitAltScreen(): void {
  exitAltScreenFunc();
}

/**
 * SetWindowTitle sets the terminal window title - matches Go SetWindowTitle function
 */
export function SetWindowTitle(title: string): void {
  setWindowTitleFunc(title);
}

/**
 * EnableMouse enables mouse support - matches Go EnableMouse function
 */
export function EnableMouse(): void {
  enableMouseFunc();
}

/**
 * DisableMouse disables mouse support - matches Go DisableMouse function
 */
export function DisableMouse(): void {
  disableMouseFunc();
}

/**
 * Hyperlink creates a clickable hyperlink - matches Go Hyperlink function
 */
export function Hyperlink(link: string, name: string): string {
  return hyperlinkFunc(link, name);
}

/**
 * Notify sends a terminal notification - matches Go Notify function
 */
export function Notify(title: string, body: string): void {
  sendNotificationFunc(title, body);
}

/**
 * CreateNotify creates a notification string - convenience function
 */
export function CreateNotify(title: string, body: string): string {
  return notificationFunc(title, body);
}

// This file maintains 100% API compatibility with the original Go package

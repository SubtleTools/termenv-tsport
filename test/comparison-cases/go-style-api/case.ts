#!/usr/bin/env bun
import { RGBColor, String } from '#src/go-style.js';
import {
  altScreen,
  ansi256Color,
  ansiColor,
  clearLine,
  clearScreen,
  colorProfile,
  createHyperlink,
  cursorDown,
  cursorUp,
  disableMouse,
  enableMouse,
  exitAltScreen,
  hideCursor,
  moveCursor,
  noColor,
  profileName,
  rgbColor,
  sendNotification,
  setWindowTitle,
  showCursor,
  string,
} from '../../../dist/index.js';
import { Profile } from '../../../dist/types.js';

// Mock process.stdout.write to capture output and force TTY detection
const originalWrite = process.stdout.write;
const originalIsTTY = process.stdout.isTTY;
let capturedOutput = '';
(process.stdout.write as any) = (chunk: any) => {
  capturedOutput += chunk.toString();
  return true;
};
// Force TTY detection for color output
process.stdout.isTTY = true;

try {
  // Using TypeScript Go-style API
  const styled = String('Go Style API').Foreground(RGBColor('#00FF00')).Bold();
  process.stdout.write(styled.String());
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
  process.stdout.isTTY = originalIsTTY;
}

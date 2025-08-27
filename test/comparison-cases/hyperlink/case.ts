#!/usr/bin/env bun
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
  const link = createHyperlink('https://example.com', 'Example Link');
  process.stdout.write(link);
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
  process.stdout.isTTY = originalIsTTY;
}

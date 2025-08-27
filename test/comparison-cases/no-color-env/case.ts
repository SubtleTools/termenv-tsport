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
} from '../../../../src/index.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
(process.stdout.write as any) = (chunk: any) => {
  capturedOutput += chunk.toString();
  return true;
};

try {
  const styled = string('Should be plain').foreground(rgbColor('#FF0000')).bold();
  process.stdout.write(styled.toString());

  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

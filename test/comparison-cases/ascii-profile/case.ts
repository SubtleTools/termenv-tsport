#!/usr/bin/env bun
import { 
  string, rgbColor, ansiColor, ansi256Color, noColor,
  colorProfile, profileName, clearScreen, moveCursor,
  createHyperlink, sendNotification, altScreen, exitAltScreen,
  hideCursor, showCursor, cursorUp, cursorDown, clearLine,
  enableMouse, disableMouse, setWindowTitle
} from '../../../dist/index.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
(process.stdout.write as any) = function(chunk: any) {
  capturedOutput += chunk.toString();
  return true;
};

try {
  
        const styled = string('No Colors Here')
          .foreground(rgbColor('#FF0000'))
          .bold()
          .italic();
        process.stdout.write(styled.toString());
        
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

#!/usr/bin/env bun
import { altScreen, ansi256Color, ansiColor, clearLine,clearScreen, 
  colorProfile, 
  createHyperlink, cursorDown, cursorUp, disableMouse, 
  enableMouse, exitAltScreen,
  hideCursor, moveCursor,noColor,profileName, rgbColor, sendNotification, setWindowTitle, showCursor, 
  string 
} from '../../../../src/index.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
(process.stdout.write as any) = (chunk: any) => {
  capturedOutput += chunk.toString();
  return true;
};

try {
  
        // Using TypeScript Go-style API
        import { String, RGBColor } from '../../../../src/go-style.js';
        const styled = String('Go Style API').Foreground(RGBColor('#00FF00')).Bold();
        process.stdout.write(styled.String());
        
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

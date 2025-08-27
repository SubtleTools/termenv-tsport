# @tsports/termenv

[![npm version](https://badge.fury.io/js/@tsports/termenv.svg)](https://badge.fury.io/js/@tsports/termenv)
[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript port of the Go [termenv](https://github.com/muesli/termenv) package with 100% API compatibility. Create beautiful, cross-platform terminal applications with advanced color support, terminal control, hyperlinks, and notifications.

## 🚀 Features

- **🎨 Full Color Support**: TrueColor (24-bit), ANSI 256-color, and standard ANSI colors
- **🖥️ Terminal Control**: Cursor positioning, screen clearing, alternate screen buffer
- **🖱️ Mouse Support**: Enable/disable mouse tracking modes
- **🔗 Hyperlinks**: OSC 8 clickable hyperlinks in supported terminals
- **🔔 Notifications**: OSC 777 terminal notifications
- **📱 Cross-Platform**: Works on Windows, macOS, Linux, and CI environments
- **🔧 Environment Detection**: Automatic terminal capability detection
- **🎯 100% Go API Compatible**: Drop-in replacement with identical behavior
- **📦 ESM-Only**: Modern ES modules with full TypeScript support
- **⚡ Zero Dependencies**: Lightweight with only workspace dependencies

## 📦 Installation

```bash
# Using npm
npm install @tsports/termenv

# Using yarn  
yarn add @tsports/termenv

# Using bun
bun add @tsports/termenv
```

## 🏁 Quick Start

### Basic Text Styling

```typescript
import { string, rgbColor, ansiColor } from '@tsports/termenv';

// Create styled text
const styled = string('Hello, World!')
  .foreground(rgbColor('#FF6B35'))
  .bold()
  .underline();

console.log(styled.toString());

// Chain multiple styles
const complex = string('Complex styling')
  .foreground(ansiColor(9))    // Bright red
  .background(rgbColor('#000000'))
  .italic()
  .strikethrough();

console.log(complex.toString());
```

### Color Profile Detection

```typescript
import { colorProfile, profileName } from '@tsports/termenv';

const profile = colorProfile();
console.log(`Terminal supports: ${profileName(profile)}`);
// Output: "Terminal supports: TrueColor" or "ANSI256" or "ANSI" or "Ascii"
```

### Terminal Control

```typescript
import { 
  clearScreen, 
  moveCursor, 
  hideCursor, 
  showCursor,
  altScreen,
  exitAltScreen
} from '@tsports/termenv';

// Clear screen and position cursor
clearScreen();
moveCursor(1, 1);

// Hide cursor while drawing UI
hideCursor();
console.log('Drawing UI...');
showCursor();

// Use alternate screen buffer
altScreen();
console.log('This is in alternate screen');
process.on('exit', () => {
  exitAltScreen();
});
```

### Hyperlinks and Notifications

```typescript
import { createHyperlink, sendNotification } from '@tsports/termenv';

// Create clickable links (in supported terminals)
const link = createHyperlink('https://github.com', 'Visit GitHub');
console.log(`Check out: ${link}`);

// Send desktop notifications (in supported terminals)
sendNotification('Build Complete', 'Your application built successfully!');
```

### Advanced Usage with Output

```typescript
import { newOutput, withProfile, Profile, rgbColor } from '@tsports/termenv';

// Create custom output with specific profile
const output = newOutput(process.stdout, withProfile(Profile.ANSI256));

// Use output for more control
const text = output.string('Styled with custom output')
  .foreground(rgbColor('#00FF00'))
  .bold();

await output.writeString(text.toString());

// Use advanced terminal features
output.enableMouse();
output.setWindowTitle('My Terminal App');
output.hyperlink('https://example.com', 'Click me!');
```

## 🎨 Color System

### Color Types

```typescript
import { 
  noColor,      // No color
  ansiColor,    // 16 standard colors (0-15)
  ansi256Color, // 256 colors (0-255)  
  rgbColor      // 24-bit true color
} from '@tsports/termenv';

// Standard ANSI colors
const red = ansiColor(9);        // Bright red
const blue = ansiColor(4);       // Blue

// 256-color palette
const orange = ansi256Color(208); // Orange
const purple = ansi256Color(135); // Purple

// True color RGB
const custom = rgbColor('#FF6B35'); // Custom hex color
const lime = rgbColor('#32CD32');   // Lime green
```

### Color Constants

```typescript
import { 
  ANSIBlack, ANSIRed, ANSIGreen, ANSIYellow,
  ANSIBlue, ANSIMagenta, ANSICyan, ANSIWhite,
  ANSIBrightBlack, ANSIBrightRed, ANSIBrightGreen, ANSIBrightYellow,
  ANSIBrightBlue, ANSIBrightMagenta, ANSIBrightCyan, ANSIBrightWhite
} from '@tsports/termenv';

const errorText = string('Error!').foreground(ANSIBrightRed);
const successText = string('Success!').foreground(ANSIBrightGreen);
```

### Automatic Color Conversion

Colors are automatically converted to match your terminal's capabilities:

```typescript
import { colorProfile, string, rgbColor } from '@tsports/termenv';

// This RGB color will be automatically converted based on terminal support
const text = string('Adaptive color')
  .foreground(rgbColor('#FF6B35')); // Converts to ANSI/256-color if needed
```

## 🖥️ Terminal Control

### Cursor Management

```typescript
import { 
  moveCursor, cursorUp, cursorDown,
  saveCursorPosition, restoreCursorPosition,
  hideCursor, showCursor
} from '@tsports/termenv';

// Position cursor
moveCursor(10, 5);        // Row 10, Column 5
cursorUp(2);              // Move up 2 lines
cursorDown(1);            // Move down 1 line

// Save/restore position
saveCursorPosition();     // Save current position
moveCursor(1, 1);        // Move somewhere else
restoreCursorPosition();  // Return to saved position

// Control visibility
hideCursor();             // Hide cursor
showCursor();             // Show cursor
```

### Screen Management

```typescript
import { 
  clearScreen, clearLine,
  altScreen, exitAltScreen,
  saveScreen, restoreScreen
} from '@tsports/termenv';

// Clear operations
clearScreen();            // Clear entire screen
clearLine();             // Clear current line

// Screen buffers
altScreen();             // Switch to alternate screen
// ... your UI code ...
exitAltScreen();         // Return to normal screen

// Screen save/restore (older method)
saveScreen();            // Save screen contents
// ... modifications ...
restoreScreen();         // Restore saved contents
```

### Mouse Support

```typescript
import { enableMouse, disableMouse } from '@tsports/termenv';

// Basic mouse support
enableMouse();
// Your application can now receive mouse events
disableMouse();

// Advanced mouse modes (via Output)
import { newOutput } from '@tsports/termenv';
const output = newOutput();

output.enableMouseCellMotion();    // Cell motion tracking
output.enableMouseAllMotion();     // All motion tracking  
output.enableMouseExtendedMode();  // Extended coordinate mode
output.disableMouseAllMotion();    // Disable all tracking
```

## 🔗 Hyperlinks

Create clickable hyperlinks in terminals that support OSC 8:

```typescript
import { createHyperlink, writeHyperlink } from '@tsports/termenv';

// Create hyperlink string
const link = createHyperlink('https://github.com/tsports', 'TSports on GitHub');
console.log(`Visit: ${link}`);

// Write directly to terminal
writeHyperlink('https://nodejs.org', 'Node.js Website');
```

## 🔔 Notifications

Send desktop notifications through supported terminals:

```typescript
import { sendNotification, createNotification } from '@tsports/termenv';

// Send notification
sendNotification('Build Status', 'Compilation completed successfully');

// Create notification string (for custom handling)
const notif = createNotification('Alert', 'Something important happened');
```

## 🎯 Go Compatibility API

For developers familiar with the original Go package, use the Go-compatible API:

```typescript
import { 
  String, ColorProfile, RGBColor, ANSIColor,
  MoveCursor, ClearScreen, Hyperlink, Notify
} from '@tsports/termenv/go-style';

// Exact Go syntax
const profile = ColorProfile();
const text = String('Hello World')
  .Foreground(RGBColor('#FF0000'))
  .Bold();

// Terminal control  
ClearScreen();
MoveCursor(10, 5);

// Advanced features
const link = Hyperlink('https://example.com', 'Link Text');
Notify('Title', 'Message body');
```

## 🌍 Environment Detection

termenv automatically detects terminal capabilities:

```typescript
import { 
  colorProfile, envColorProfile, envNoColor,
  hasDarkBackground, foregroundColor, backgroundColor
} from '@tsports/termenv';

// Check capabilities
const profile = colorProfile();          // Detected profile
const envProfile = envColorProfile();    // Environment-based profile
const noColor = envNoColor();           // NO_COLOR environment variable

// Terminal colors
const dark = hasDarkBackground();       // true if dark background
const fg = foregroundColor();           // Terminal foreground color  
const bg = backgroundColor();           // Terminal background color
```

### Environment Variables

- `NO_COLOR`: Disable color output entirely
- `CLICOLOR=0`: Disable color output
- `CLICOLOR_FORCE=1`: Force color output
- `COLORTERM=truecolor`: Enable TrueColor support
- `TERM`: Terminal type detection
- `CI`: Detected CI environment (disables interactive features)

## ⚙️ Advanced Configuration

### Custom Output

```typescript
import { 
  newOutput, withProfile, withColorCache, 
  withTTY, withUnsafe, withEnvironment,
  Profile
} from '@tsports/termenv';

// Create output with options
const output = newOutput(
  process.stdout,
  withProfile(Profile.ANSI256),    // Force 256-color mode
  withColorCache(true),            // Enable color caching
  withTTY(true),                   // Force TTY mode
  withUnsafe()                     // Enable unsafe mode
);

// Custom environment
class CustomEnv {
  getenv(key: string): string {
    return process.env[key] || '';
  }
  
  environ(): string[] {
    return Object.entries(process.env)
      .map(([k, v]) => `${k}=${v || ''}`);
  }
}

const customOutput = newOutput(
  process.stdout,
  withEnvironment(new CustomEnv())
);
```

### Style Chaining

```typescript
import { string, rgbColor, ansiColor } from '@tsports/termenv';

const complexStyle = string('Complex Example')
  .foreground(rgbColor('#FF6B35'))     // Orange text
  .background(ansiColor(0))            // Black background
  .bold()                              // Bold weight
  .italic()                            // Italic style
  .underline()                         // Underlined
  .strikethrough()                     // Strike through
  .overline()                          // Overlined
  .crossout()                          // Alternative strikethrough
  .faint()                             // Faint/dim
  .blink()                             // Blinking (rarely supported)
  .reverse()                           // Reverse video
  .width(20);                          // Fixed width with padding

console.log(complexStyle.toString());
```

## 🔧 Utility Functions

### Color Conversion

```typescript
import { convertToRGB, color, profileName } from '@tsports/termenv';

// Convert any color to RGB for manipulation
const rgbColor = convertToRGB(ansiColor(9));
if (rgbColor) {
  const [h, s, l] = rgbColor.hsl();
  console.log(`HSL: ${h}, ${s}, ${l}`);
}

// Parse color from string
const parsed = color('#FF0000');  // Returns RGBColor
const parsed2 = color('9');       // Returns ANSIColor
const parsed3 = color('255');     // Returns ANSI256Color
```

### Profile Information

```typescript
import { Profile, profileName } from '@tsports/termenv';

console.log(profileName(Profile.TrueColor)); // "TrueColor"
console.log(profileName(Profile.ANSI256));   // "ANSI256"
console.log(profileName(Profile.ANSI));      // "ANSI"
console.log(profileName(Profile.Ascii));     // "Ascii"
```

## 🧪 Testing

When testing applications that use termenv:

```typescript
// Disable colors in tests
process.env.NO_COLOR = '1';

// Or force a specific profile
import { newOutput, withProfile, Profile } from '@tsports/termenv';
const testOutput = newOutput(mockWriter, withProfile(Profile.Ascii));
```

## 📖 Examples

### Progress Bar

```typescript
import { string, rgbColor, clearLine, moveCursor } from '@tsports/termenv';

function drawProgressBar(progress: number, total: number) {
  const percentage = Math.round((progress / total) * 100);
  const filled = Math.round((progress / total) * 20);
  const empty = 20 - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  
  clearLine();
  moveCursor(1, 1);
  
  const progressText = string(`Progress: [${bar}] ${percentage}%`)
    .foreground(percentage < 50 ? rgbColor('#FF6B35') : rgbColor('#32CD32'));
    
  console.log(progressText.toString());
}

// Usage
for (let i = 0; i <= 100; i += 5) {
  drawProgressBar(i, 100);
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### Colored Logging

```typescript
import { string, ANSIBrightRed, ANSIBrightYellow, ANSIBrightGreen, ANSIBrightBlue } from '@tsports/termenv';

class ColorLogger {
  error(message: string) {
    console.log(string(`ERROR: ${message}`).foreground(ANSIBrightRed).bold().toString());
  }
  
  warn(message: string) {
    console.log(string(`WARN:  ${message}`).foreground(ANSIBrightYellow).toString());
  }
  
  info(message: string) {
    console.log(string(`INFO:  ${message}`).foreground(ANSIBrightBlue).toString());
  }
  
  success(message: string) {
    console.log(string(`SUCCESS: ${message}`).foreground(ANSIBrightGreen).toString());
  }
}

const logger = new ColorLogger();
logger.error('Something went wrong');
logger.warn('This is a warning');
logger.info('FYI: Something happened');
logger.success('Operation completed');
```

### Terminal UI Framework

```typescript
import { 
  altScreen, exitAltScreen, clearScreen, hideCursor, showCursor,
  moveCursor, string, rgbColor, enableMouse, disableMouse
} from '@tsports/termenv';

class TerminalApp {
  private running = false;
  
  async start() {
    // Setup terminal
    altScreen();
    hideCursor();
    enableMouse();
    clearScreen();
    
    this.running = true;
    
    // Setup cleanup
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    
    this.draw();
  }
  
  private draw() {
    clearScreen();
    
    // Header
    moveCursor(1, 1);
    const header = string('My Terminal App')
      .foreground(rgbColor('#FF6B35'))
      .bold()
      .underline();
    console.log(header.toString());
    
    // Content
    moveCursor(3, 1);
    console.log('Press Ctrl+C to exit');
    
    // Status line
    moveCursor(25, 1);
    const status = string('Ready')
      .foreground(rgbColor('#32CD32'))
      .background(rgbColor('#000000'));
    console.log(status.toString());
  }
  
  stop() {
    this.running = false;
    this.cleanup();
    process.exit(0);
  }
  
  private cleanup() {
    disableMouse();
    showCursor();
    exitAltScreen();
  }
}

// Usage
const app = new TerminalApp();
app.start();
```

## 🤝 Contributing

Contributions are welcome! This package maintains 100% compatibility with the original Go termenv package.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Packages

- [@tsports/go-colorful](../go-colorful) - Color manipulation and conversion
- [@tsports/uniseg](../uniseg) - Unicode text segmentation

## 🙏 Acknowledgments

This package is a TypeScript port of the excellent [termenv](https://github.com/muesli/termenv) Go package by Christian Muehlhaeuser (@muesli). All credit for the original design and implementation goes to the termenv contributors.

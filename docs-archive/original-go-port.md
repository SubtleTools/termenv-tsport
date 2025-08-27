# termenv - Complete Go Documentation Port

> **Note**: This document is a comprehensive port of the original Go [termenv](https://github.com/muesli/termenv) documentation, adapted for TypeScript with our `@tsports/termenv` implementation.

<p align="center">
    <img src="https://stuff.charm.sh/termenv.png" width="480" alt="termenv Logo">
    <br />
    <img src="https://github.com/muesli/termenv/raw/master/examples/hello-world/hello-world.png" alt="Example terminal output">
</p>

`@tsports/termenv` is a comprehensive TypeScript port that lets you safely use advanced styling options on the terminal. It gathers information about the terminal environment in terms of its ANSI & color support and offers you convenient methods to colorize and style your output, without you having to deal with all kinds of weird ANSI escape sequences and color conversions.

## Features

- **RGB/TrueColor support** - Full 24-bit color support where available
- **Detects the supported color range of your terminal** - Automatically adapts to terminal capabilities
- **Automatically converts colors** - Colors are converted to the best matching, available colors
- **Terminal theme (light/dark) detection** - Detect if your terminal has a dark or light background
- **Chainable syntax** - Fluent API for building complex styles
- **Nested styles** - Apply multiple styles and combine them naturally
- **Cross-platform** - Works on Windows, macOS, Linux, and CI environments
- **100% Go API compatible** - Perfect compatibility with original Go termenv
- **TypeScript native** - Full TypeScript support with modern ESM modules

## Installation

```bash
# Using bun (recommended)
bun add @tsports/termenv

# Using npm
npm install @tsports/termenv

# Using yarn
yarn add @tsports/termenv
```

## Usage

`@tsports/termenv` provides both a modern TypeScript API and a Go-compatible API for seamless migration.

### Modern TypeScript API (Recommended)

```typescript
import { string, rgbColor, newOutput, colorProfile } from '@tsports/termenv';

// Create styled text with the global string function
const s = string('Hello World')
  .foreground(rgbColor('#FF0000'))
  .bold();

console.log(s.toString());

// Or use a custom output for more control
const output = newOutput(process.stdout);
const text = output.string('Styled text')
  .foreground(output.color('#abcdef'))
  .background(output.color('#000000'));

console.log(text.toString());
```

### Go-Compatible API

For developers familiar with the original Go package:

```typescript
import { 
  String, NewOutput, ColorProfile, RGBColor 
} from '@tsports/termenv/go-style';

// Exact Go syntax with PascalCase methods
const output = NewOutput(process.stdout);
const s = output.String('Hello World')
  .Foreground(RGBColor('#FF0000'))
  .Bold();

console.log(s.String());

// Global functions work the same way
const profile = ColorProfile();
const text = String('Hello World').Foreground(RGBColor('#abcdef'));
```

## Color Profiles

termenv automatically detects the supported color range of your terminal and selects the best matching color profile:

- **Ascii** (`Profile.Ascii`) - No color, 1-bit (black & white)
- **ANSI** (`Profile.ANSI`) - 16 colors, 4-bit
- **ANSI256** (`Profile.ANSI256`) - 256 colors, 8-bit
- **TrueColor** (`Profile.TrueColor`) - 16,777,216 colors, 24-bit

You can check which profile is currently used:

```typescript
import { colorProfile, profileName } from '@tsports/termenv';

const profile = colorProfile();
console.log(`Terminal supports: ${profileName(profile)}`);
// Output: "TrueColor", "ANSI256", "ANSI", or "Ascii"
```

### Manual Profile Selection

You can override the profile detection and force a specific color profile:

```typescript
import { newOutput, withProfile, Profile } from '@tsports/termenv';

// Force 256-color mode
const output = newOutput(process.stdout, withProfile(Profile.ANSI256));

// Force true color mode
const trueColorOutput = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Force black & white mode (for testing)
const asciiOutput = newOutput(process.stdout, withProfile(Profile.Ascii));
```

## Colors

### Creating Colors

termenv supports multiple ways to create colors:

```typescript
import { 
  noColor, ansiColor, ansi256Color, rgbColor, color
} from '@tsports/termenv';

// No color (transparent)
const transparent = noColor();

// Standard ANSI colors (0-15)
const red = ansiColor(9);        // Bright red
const blue = ansiColor(4);       // Blue

// Extended ANSI colors (0-255)  
const orange = ansi256Color(208);
const purple = ansi256Color(135);

// RGB/Hex colors (24-bit)
const custom = rgbColor('#FF6B35');
const lime = rgbColor('#32CD32');

// Parse color from string (auto-detects format)
const parsed = color('#FF0000');  // Returns RGBColor
const parsed2 = color('9');       // Returns ANSIColor
const parsed3 = color('255');     // Returns ANSI256Color
```

### Color Constants

Pre-defined ANSI color constants are available:

```typescript
import { 
  ANSIBlack, ANSIRed, ANSIGreen, ANSIYellow,
  ANSIBlue, ANSIMagenta, ANSICyan, ANSIWhite,
  ANSIBrightBlack, ANSIBrightRed, ANSIBrightGreen, ANSIBrightYellow,
  ANSIBrightBlue, ANSIBrightMagenta, ANSIBrightCyan, ANSIBrightWhite
} from '@tsports/termenv';

const errorText = string('Error!').foreground(ANSIBrightRed);
const successText = string('Success!').foreground(ANSIBrightGreen);
const warningText = string('Warning!').foreground(ANSIBrightYellow);
```

### Automatic Color Conversion

Colors are automatically converted to match your terminal's capabilities:

```typescript
import { string, rgbColor, colorProfile, profileName } from '@tsports/termenv';

// This RGB color will be automatically converted based on terminal support
const text = string('Adaptive color')
  .foreground(rgbColor('#FF6B35')); // Converts to ANSI/256-color if needed

console.log(`Using profile: ${profileName(colorProfile())}`);
console.log(text.toString());
```

## Text Styling

### Basic Styles

Apply various text styles using chainable methods:

```typescript
import { string, rgbColor, ANSIRed } from '@tsports/termenv';

const styled = string('Styled text')
  .foreground(rgbColor('#FF0000'))    // Text color
  .background(ANSIRed)                // Background color
  .bold()                             // Bold weight
  .italic()                           // Italic style
  .underline()                        // Underlined
  .strikethrough()                    // Strike through
  .overline()                         // Overlined (rarely supported)
  .crossout()                         // Alternative strikethrough
  .faint()                            // Faint/dim appearance
  .blink()                            // Blinking (rarely supported)
  .reverse();                         // Reverse video (swap fg/bg)

console.log(styled.toString());
```

### Width and Alignment

Control text width and alignment:

```typescript
import { string, rgbColor } from '@tsports/termenv';

// Fixed width with padding
const fixedWidth = string('Text')
  .foreground(rgbColor('#00FF00'))
  .width(20);

console.log(`[${fixedWidth.toString()}]`); // Pads to 20 characters
```

## Terminal Control

### Cursor Management

Control cursor position and visibility:

```typescript
import { 
  moveCursor, cursorUp, cursorDown,
  hideCursor, showCursor,
  saveCursorPosition, restoreCursorPosition
} from '@tsports/termenv';

// Position cursor at specific location
moveCursor(10, 5);        // Row 10, Column 5 (1-based)

// Relative movement
cursorUp(2);              // Move up 2 lines
cursorDown(1);            // Move down 1 line

// Save and restore position
saveCursorPosition();     // Save current position
moveCursor(1, 1);        // Move somewhere else
// ... do work ...
restoreCursorPosition();  // Return to saved position

// Control cursor visibility
hideCursor();             // Hide cursor (useful during UI updates)
// ... draw UI ...
showCursor();             // Show cursor again
```

### Screen Management

Clear and manage screen content:

```typescript
import { 
  clearScreen, clearLine,
  altScreen, exitAltScreen,
  saveScreen, restoreScreen,
  setWindowTitle
} from '@tsports/termenv';

// Clear operations
clearScreen();            // Clear entire screen
clearLine();             // Clear current line

// Alternate screen buffer (recommended for TUI apps)
altScreen();             // Switch to alternate screen
// ... your TUI application code ...
exitAltScreen();         // Return to normal screen

// Legacy screen save/restore  
saveScreen();            // Save current screen contents
// ... modifications ...
restoreScreen();         // Restore saved contents

// Window title
setWindowTitle('My Terminal App');
```

### Mouse Support

Enable mouse interaction in supported terminals:

```typescript
import { enableMouse, disableMouse, newOutput } from '@tsports/termenv';

// Basic mouse support
enableMouse();
// Your application can now receive mouse events
// Remember to disable when done
disableMouse();

// Advanced mouse modes via Output
const output = newOutput(process.stdout);

// Different mouse tracking modes
output.enableMousePress();        // Press/release events only
output.enableMouseCellMotion();   // Motion events within cells
output.enableMouseAllMotion();    // All motion events
output.enableMouseExtendedMode(); // Extended coordinate reporting

// Disable when done
output.disableMouseAllMotion();
```

## Hyperlinks

Create clickable hyperlinks in terminals that support OSC 8:

```typescript
import { createHyperlink, writeHyperlink, newOutput } from '@tsports/termenv';

// Create hyperlink string (doesn't write to terminal)
const link = createHyperlink('https://github.com/tsports', 'TSports on GitHub');
console.log(`Visit: ${link}`);

// Write directly to terminal
writeHyperlink('https://nodejs.org', 'Node.js Website');

// Via output instance
const output = newOutput(process.stdout);
output.hyperlink('https://example.com', 'Example Site');
```

## Notifications

Send desktop notifications through supported terminals:

```typescript
import { sendNotification, createNotification, newOutput } from '@tsports/termenv';

// Send notification directly
sendNotification('Build Status', 'Compilation completed successfully');

// Create notification string for custom handling
const notif = createNotification('Alert', 'Something important happened');
console.log(notif); // Raw OSC 777 sequence

// Via output instance  
const output = newOutput(process.stdout);
output.notify('Deploy Complete', 'Application deployed to production');
```

## Environment Detection

termenv automatically detects terminal capabilities and respects environment variables:

```typescript
import { 
  colorProfile, envColorProfile, envNoColor,
  hasDarkBackground, foregroundColor, backgroundColor
} from '@tsports/termenv';

// Check terminal capabilities
const profile = colorProfile();          // Detected color profile
const envProfile = envColorProfile();    // Environment-based profile
const noColor = envNoColor();           // True if NO_COLOR is set

// Terminal appearance
const isDark = hasDarkBackground();     // True if terminal has dark background
const fgColor = foregroundColor();      // Terminal's default foreground color
const bgColor = backgroundColor();      // Terminal's default background color

console.log(`Color profile: ${profileName(profile)}`);
console.log(`Dark background: ${isDark}`);
console.log(`No color mode: ${noColor}`);
```

### Supported Environment Variables

- `NO_COLOR` - Disable color output entirely (set to any value)
- `CLICOLOR=0` - Disable color output
- `CLICOLOR_FORCE=1` - Force color output even in non-TTY
- `COLORTERM=truecolor` - Enable TrueColor support
- `TERM` - Terminal type for capability detection
- `CI=true` - Detected CI environment (disables interactive features)

## Advanced Usage

### Custom Output Configuration

Create outputs with specific configurations:

```typescript
import { 
  newOutput, withProfile, withColorCache, 
  withTTY, withUnsafe, withEnvironment,
  Profile 
} from '@tsports/termenv';

// Multiple configuration options
const output = newOutput(
  process.stdout,
  withProfile(Profile.ANSI256),    // Force 256-color mode
  withColorCache(true),            // Enable color caching for performance
  withTTY(true),                   // Force TTY mode
  withUnsafe()                     // Enable unsafe sequences
);

// Custom environment interface
class CustomEnvironment {
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
  withEnvironment(new CustomEnvironment())
);
```

### Color Caching

Enable color caching for improved performance when using many colors:

```typescript
import { newOutput, withColorCache } from '@tsports/termenv';

// Enable color caching (useful for applications that use many colors)
const output = newOutput(process.stdout, withColorCache(true));

// Colors will be cached after first conversion
for (let i = 0; i < 1000; i++) {
  const color = output.color(`#${i.toString(16).padStart(6, '0')}`);
  // Subsequent uses of the same hex color will be cached
}
```

### Unsafe Mode

Enable unsafe terminal sequences (use with caution):

```typescript
import { newOutput, withUnsafe } from '@tsports/termenv';

// Enable unsafe sequences (allows more terminal control)
const output = newOutput(process.stdout, withUnsafe());

// Now output can use potentially unsafe terminal sequences
// Use only if you trust the terminal environment
```

## Platform Support

### Windows

On Windows, termenv requires Windows 10 version 1511 or later for color support. The library automatically enables Virtual Terminal Processing when possible.

### CI/CD Environments

termenv automatically detects CI environments and adjusts behavior:

- Disables interactive features (mouse, alternate screen)
- Respects `NO_COLOR` and `CI` environment variables
- Falls back to safer color profiles when needed

### Terminal Compatibility

termenv works with most modern terminals:

- ✅ **Excellent support**: kitty, Alacritty, iTerm2, Windows Terminal
- ✅ **Good support**: GNOME Terminal, Konsole, Terminal.app
- ⚠️ **Limited support**: Windows Console Host (legacy), basic terminal emulators
- ❌ **No support**: Very old terminals, dumb terminals (`TERM=dumb`)

## Examples

### Hello World

Port of the original Go hello-world example:

```typescript
import { string, colorProfile, rgbColor } from '@tsports/termenv';

// Simple hello world with color
const profile = colorProfile();
const hello = string('Hello, world!')
  .foreground(rgbColor('#71BEF2'))
  .bold();

console.log(hello.toString());
console.log(`Terminal supports: ${profileName(profile)}`);
```

### Color Chart

Display terminal color capabilities (port of color-chart example):

```typescript
import { 
  string, ansiColor, ansi256Color, convertToRGB, 
  colorProfile, Profile 
} from '@tsports/termenv';

function displayColorChart() {
  const profile = colorProfile();
  
  console.log('=== ANSI Colors (0-15) ===');
  for (let i = 0; i < 16; i++) {
    const color = ansiColor(i);
    const rgb = convertToRGB(color);
    const hex = rgb ? `#${rgb.hex()}` : 'N/A';
    
    const sample = string(`  ${i.toString().padStart(2)}  `)
      .background(color)
      .foreground(rgb && rgb.isDark() ? ansiColor(15) : ansiColor(0));
    
    console.log(`${sample.toString()} ${hex}`);
  }
  
  if (profile >= Profile.ANSI256) {
    console.log('\n=== Extended Colors (16-231) ===');
    for (let i = 16; i < 232; i += 6) {
      let line = '';
      for (let j = 0; j < 6 && i + j < 232; j++) {
        const color = ansi256Color(i + j);
        const sample = string(`${(i + j).toString().padStart(3)} `)
          .background(color);
        line += sample.toString();
      }
      console.log(line);
    }
    
    console.log('\n=== Grayscale (232-255) ===');
    let line = '';
    for (let i = 232; i < 256; i++) {
      const color = ansi256Color(i);
      const sample = string(`${i} `).background(color);
      line += sample.toString();
    }
    console.log(line);
  }
}

displayColorChart();
```

### Progress Bar

Create a colorful progress bar:

```typescript
import { string, rgbColor, clearLine, moveCursor, cursorUp } from '@tsports/termenv';

async function progressBar(steps: number = 20) {
  console.log('Processing...');
  
  for (let i = 0; i <= steps; i++) {
    const percentage = Math.round((i / steps) * 100);
    const filled = Math.round((i / steps) * 40); // 40-char bar
    const empty = 40 - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const color = percentage < 33 ? '#FF6B35' : 
                  percentage < 66 ? '#FFA500' : '#32CD32';
    
    // Move up one line and clear it
    cursorUp(1);
    clearLine();
    
    const progressText = string(`Progress: [${bar}] ${percentage}%`)
      .foreground(rgbColor(color));
    
    console.log(progressText.toString());
    
    if (i < steps) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}

await progressBar();
```

### Simple TUI Framework

Basic terminal user interface:

```typescript
import { 
  altScreen, exitAltScreen, clearScreen, hideCursor, showCursor,
  moveCursor, string, rgbColor, enableMouse, disableMouse,
  setWindowTitle
} from '@tsports/termenv';

class SimpleTUI {
  private running = false;
  
  async start() {
    // Setup terminal for TUI
    altScreen();
    hideCursor();
    enableMouse();
    clearScreen();
    setWindowTitle('Simple TUI Demo');
    
    this.running = true;
    
    // Setup cleanup handlers
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
    
    this.render();
  }
  
  private render() {
    clearScreen();
    
    // Header
    moveCursor(1, 2);
    const header = string('🚀 Simple TUI Demo')
      .foreground(rgbColor('#FF6B35'))
      .bold()
      .underline();
    console.log(header.toString());
    
    // Instructions
    moveCursor(3, 2);
    console.log('This is a simple terminal UI demonstration.');
    
    moveCursor(4, 2);
    const instruction = string('Press Ctrl+C to exit')
      .foreground(rgbColor('#71BEF2'));
    console.log(instruction.toString());
    
    // Status bar
    moveCursor(20, 1);
    const status = string(' Status: Running ')
      .foreground(rgbColor('#000000'))
      .background(rgbColor('#32CD32'));
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
const app = new SimpleTUI();
await app.start();
```

## Testing

When testing applications that use termenv:

```typescript
import { newOutput, withProfile, Profile } from '@tsports/termenv';

// Disable colors in tests
process.env.NO_COLOR = '1';

// Or force a specific profile for consistent test output
const testOutput = newOutput(process.stdout, withProfile(Profile.Ascii));

// Test with different profiles
describe('Color output', () => {
  test('works with TrueColor', () => {
    const output = newOutput(process.stdout, withProfile(Profile.TrueColor));
    const text = output.string('test').foreground(output.rgbColor('#FF0000'));
    expect(text.toString()).toMatch(/\x1b\[38;2;255;0;0m/);
  });
  
  test('works with ANSI', () => {
    const output = newOutput(process.stdout, withProfile(Profile.ANSI));
    const text = output.string('test').foreground(output.rgbColor('#FF0000'));
    // RGB color should be converted to nearest ANSI color
    expect(text.toString()).toMatch(/\x1b\[3[1-7]m/);
  });
});
```

## Migration from Go termenv

This TypeScript port maintains 100% API compatibility with the original Go package. Here are the key differences:

### Import Syntax

```go
// Go
import "github.com/muesli/termenv"
```

```typescript
// TypeScript - Modern API
import { string, rgbColor, colorProfile } from '@tsports/termenv';

// TypeScript - Go-compatible API
import { String, RGBColor, ColorProfile } from '@tsports/termenv/go-style';
```

### Method Naming

```go
// Go (PascalCase)
s := termenv.String("Hello").Foreground(termenv.RGBColor("#FF0000")).Bold()
fmt.Print(s)
```

```typescript
// TypeScript modern (camelCase)
const s = string('Hello').foreground(rgbColor('#FF0000')).bold();
console.log(s.toString());

// TypeScript Go-compatible (PascalCase) 
const s = String('Hello').Foreground(RGBColor('#FF0000')).Bold();
console.log(s.String());
```

### Output Methods

```go
// Go
out := termenv.NewOutput(os.Stdout)
s := out.String("Hello")
```

```typescript
// TypeScript
const out = newOutput(process.stdout);
const s = out.string('Hello');
```

## Performance

This TypeScript port is optimized for performance:

- **Color caching** - Colors are cached to avoid repeated conversions
- **Lazy evaluation** - ANSI sequences are generated only when needed
- **Minimal allocations** - Reuses string builders and color instances
- **Profile-aware** - Only performs conversions when necessary

## Contributing

Contributions are welcome! This package maintains 100% compatibility with the original Go termenv package.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This package is a TypeScript port of the excellent [termenv](https://github.com/muesli/termenv) Go package by Christian Muehlhaeuser (@muesli) and contributors. All credit for the original design and implementation goes to the termenv team.

### Related Projects

- [@tsports/go-colorful](../go-colorful) - Color manipulation and conversion
- [@tsports/uniseg](../uniseg) - Unicode text segmentation
- [Lip Gloss](https://github.com/charmbracelet/lipgloss) - Terminal styling (Go)
- [Bubble Tea](https://github.com/charmbracelet/bubbletea) - TUI framework (Go)

# Usage Guide - Practical termenv Examples

This guide provides practical examples and usage patterns for `@tsports/termenv`, ported from the original Go implementation with TypeScript best practices.

## Quick Start

### Basic Text Styling

The most common use case is styling text output:

```typescript
import { string, rgbColor, ansiColor, ANSIBrightRed } from '@tsports/termenv';

// Simple colored text
const red = string('Error: Operation failed')
  .foreground(rgbColor('#FF0000'));
console.log(red.toString());

// Multiple styles
const styled = string('Important Notice')
  .foreground(ANSIBrightRed)
  .bold()
  .underline();
console.log(styled.toString());

// Chaining styles
const complex = string('Complex Styling')
  .foreground(rgbColor('#FF6B35'))
  .background(ansiColor(0))
  .italic()
  .strikethrough();
console.log(complex.toString());
```

### Color Profile Detection

Check what your terminal supports:

```typescript
import { colorProfile, profileName, hasDarkBackground } from '@tsports/termenv';

const profile = colorProfile();
console.log(`Terminal supports: ${profileName(profile)}`);
console.log(`Dark background: ${hasDarkBackground()}`);

// Adapt output based on capabilities
if (profile >= Profile.ANSI256) {
  console.log('Using rich colors');
} else {
  console.log('Using basic colors');
}
```

## Color Usage Patterns

### Working with Different Color Types

```typescript
import { 
  noColor, ansiColor, ansi256Color, rgbColor, color,
  ANSIRed, ANSIBrightGreen, string 
} from '@tsports/termenv';

// Different color creation methods
const transparent = noColor();
const basicRed = ansiColor(1);           // Standard red
const brightRed = ansiColor(9);          // Bright red
const orange = ansi256Color(208);        // 256-color orange
const custom = rgbColor('#FF6B35');      // True color
const parsed = color('#00FF00');         // Auto-detect format

// Using color constants
const error = string('ERROR').foreground(ANSIRed);
const success = string('SUCCESS').foreground(ANSIBrightGreen);

console.log(error.toString());
console.log(success.toString());
```

### Adaptive Color Output

Automatically adapt colors based on terminal capabilities:

```typescript
import { 
  string, rgbColor, ansi256Color, ansiColor, 
  colorProfile, Profile 
} from '@tsports/termenv';

function adaptiveColor(text: string) {
  const profile = colorProfile();
  const base = string(text);
  
  switch (profile) {
    case Profile.TrueColor:
      return base.foreground(rgbColor('#FF6B35'));
    case Profile.ANSI256:
      return base.foreground(ansi256Color(208));
    case Profile.ANSI:
      return base.foreground(ansiColor(9));
    default:
      return base; // No color for Ascii profile
  }
}

console.log(adaptiveColor('Adaptive text').toString());
```

## Advanced Styling

### Complex Style Combinations

```typescript
import { string, rgbColor, ansiColor } from '@tsports/termenv';

// Layer multiple styles
const banner = string(' IMPORTANT NOTICE ')
  .foreground(rgbColor('#FFFFFF'))
  .background(rgbColor('#FF0000'))
  .bold()
  .underline()
  .width(40); // Fixed width with padding

console.log(banner.toString());

// Conditional styling
function logLevel(level: string, message: string) {
  const base = string(`[${level.toUpperCase()}] ${message}`);
  
  switch (level.toLowerCase()) {
    case 'error':
      return base.foreground(rgbColor('#FF0000')).bold();
    case 'warn':
      return base.foreground(rgbColor('#FFA500'));
    case 'info':
      return base.foreground(rgbColor('#0000FF'));
    case 'success':
      return base.foreground(rgbColor('#00FF00')).bold();
    default:
      return base;
  }
}

console.log(logLevel('error', 'Something went wrong').toString());
console.log(logLevel('success', 'Operation completed').toString());
```

### Style Inheritance and Nesting

```typescript
import { string, rgbColor, ansiColor } from '@tsports/termenv';

// Create reusable style components
function createTheme() {
  const primary = rgbColor('#FF6B35');
  const secondary = rgbColor('#71BEF2');
  const success = rgbColor('#32CD32');
  const error = rgbColor('#FF0000');
  
  return {
    header: (text: string) => string(text).foreground(primary).bold().underline(),
    subheader: (text: string) => string(text).foreground(secondary).bold(),
    success: (text: string) => string(text).foreground(success),
    error: (text: string) => string(text).foreground(error).bold(),
    code: (text: string) => string(text).background(ansiColor(8)).foreground(ansiColor(15)),
  };
}

const theme = createTheme();

console.log(theme.header('Application Status').toString());
console.log(theme.subheader('Connection Details').toString());
console.log(theme.success('✓ Connected to server').toString());
console.log(theme.error('✗ Failed to authenticate').toString());
console.log(`Config: ${theme.code('debug: true').toString()}`);
```

## Terminal Control

### Cursor and Screen Management

```typescript
import { 
  clearScreen, moveCursor, cursorUp, cursorDown,
  hideCursor, showCursor, saveCursorPosition, restoreCursorPosition,
  string, rgbColor 
} from '@tsports/termenv';

// Clear screen and draw header
clearScreen();
moveCursor(1, 1);

const header = string('Terminal Control Demo')
  .foreground(rgbColor('#FF6B35'))
  .bold()
  .underline();
console.log(header.toString());

// Save position and draw status at bottom
saveCursorPosition();
moveCursor(25, 1);
console.log('Status: Ready');
restoreCursorPosition();

// Draw content
cursorDown(2);
console.log('This is the main content area.');

// Hide cursor while updating
hideCursor();
setTimeout(() => {
  moveCursor(25, 1);
  console.log('Status: Processing...');
  showCursor();
}, 1000);
```

### Alternate Screen Buffer

Perfect for full-screen applications:

```typescript
import { 
  altScreen, exitAltScreen, clearScreen, hideCursor, showCursor,
  moveCursor, string, rgbColor 
} from '@tsports/termenv';

class FullScreenApp {
  private cleanup: (() => void)[] = [];
  
  start() {
    // Enter alternate screen
    altScreen();
    hideCursor();
    clearScreen();
    
    // Setup cleanup
    this.cleanup.push(() => {
      showCursor();
      exitAltScreen();
    });
    
    process.on('exit', () => this.stop());
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
    
    this.draw();
  }
  
  private draw() {
    clearScreen();
    
    // Title
    moveCursor(1, 2);
    const title = string('Full Screen Application')
      .foreground(rgbColor('#FF6B35'))
      .bold();
    console.log(title.toString());
    
    // Content
    moveCursor(3, 2);
    console.log('This app uses the alternate screen buffer.');
    console.log('Press Ctrl+C to exit and return to normal screen.');
    
    // Footer
    moveCursor(20, 2);
    const footer = string('Press any key...')
      .foreground(rgbColor('#888888'));
    console.log(footer.toString());
  }
  
  stop() {
    this.cleanup.forEach(fn => fn());
    process.exit(0);
  }
}

const app = new FullScreenApp();
app.start();
```

## Interactive Features

### Mouse Support

```typescript
import { 
  enableMouse, disableMouse, newOutput,
  string, rgbColor 
} from '@tsports/termenv';

class MouseDemo {
  private output = newOutput(process.stdout);
  
  start() {
    console.log('Mouse demo starting...');
    console.log('Move your mouse around and click!');
    
    // Enable different mouse modes
    this.output.enableMousePress();        // Basic press/release
    this.output.enableMouseCellMotion();   // Motion within cells
    
    // Setup cleanup
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    
    // In a real app, you'd listen for mouse events here
    setTimeout(() => {
      const status = string('Mouse tracking enabled')
        .foreground(rgbColor('#32CD32'));
      console.log(status.toString());
    }, 100);
  }
  
  stop() {
    this.cleanup();
    process.exit(0);
  }
  
  private cleanup() {
    this.output.disableMouseAllMotion();
  }
}

const mouseDemo = new MouseDemo();
mouseDemo.start();
```

### Hyperlinks

Create clickable links in supported terminals:

```typescript
import { createHyperlink, writeHyperlink, string, rgbColor } from '@tsports/termenv';

// Create hyperlink strings
const github = createHyperlink('https://github.com/tsports', 'TSports on GitHub');
const docs = createHyperlink('https://termenv.tsports.dev', 'Documentation');

console.log(`Visit: ${github}`);
console.log(`Read: ${docs}`);

// Styled hyperlinks
const styledLink = string(createHyperlink('https://example.com', 'Example'))
  .foreground(rgbColor('#71BEF2'))
  .underline();

console.log(`Check out: ${styledLink.toString()}`);

// Direct writing (no return value)
writeHyperlink('https://nodejs.org', 'Node.js');
```

### Notifications

Send desktop notifications through supported terminals:

```typescript
import { sendNotification, createNotification } from '@tsports/termenv';

// Send notifications directly
sendNotification('Build Complete', 'Your application built successfully!');
sendNotification('Error', 'Compilation failed with 3 errors');

// Create notification strings for custom handling
const notif = createNotification('Deploy Status', 'Application deployed to production');
console.log('Raw notification:', notif);

// Conditional notifications based on environment
if (process.env.NODE_ENV === 'development') {
  sendNotification('Dev Server', 'Server restarted successfully');
}
```

## Real-World Examples

### Color-Coded Logger

```typescript
import { string, rgbColor, ANSIBrightRed, ANSIBrightYellow, ANSIBrightBlue, ANSIBrightGreen } from '@tsports/termenv';

interface LogEntry {
  level: 'error' | 'warn' | 'info' | 'debug' | 'success';
  message: string;
  timestamp?: Date;
}

class ColorLogger {
  private formatTimestamp(date: Date = new Date()): string {
    return date.toISOString().replace('T', ' ').replace('Z', '');
  }
  
  private formatLevel(level: string): string {
    return `[${level.toUpperCase().padEnd(7)}]`;
  }
  
  private colorForLevel(level: LogEntry['level']) {
    switch (level) {
      case 'error': return ANSIBrightRed;
      case 'warn': return ANSIBrightYellow;
      case 'info': return ANSIBrightBlue;
      case 'success': return ANSIBrightGreen;
      case 'debug': return rgbColor('#888888');
    }
  }
  
  log(entry: LogEntry) {
    const timestamp = string(this.formatTimestamp(entry.timestamp))
      .foreground(rgbColor('#888888'));
    
    const level = string(this.formatLevel(entry.level))
      .foreground(this.colorForLevel(entry.level))
      .bold();
    
    const message = entry.level === 'error' ? 
      string(entry.message).foreground(ANSIBrightRed) :
      entry.message;
    
    console.log(`${timestamp.toString()} ${level.toString()} ${message}`);
  }
  
  error(message: string) { this.log({ level: 'error', message }); }
  warn(message: string) { this.log({ level: 'warn', message }); }
  info(message: string) { this.log({ level: 'info', message }); }
  debug(message: string) { this.log({ level: 'debug', message }); }
  success(message: string) { this.log({ level: 'success', message }); }
}

// Usage
const logger = new ColorLogger();
logger.info('Application starting...');
logger.success('Database connection established');
logger.warn('Configuration file not found, using defaults');
logger.error('Failed to connect to external service');
logger.debug('Processing 1,234 items');
```

### Progress Indicator

```typescript
import { 
  string, rgbColor, clearLine, cursorUp, moveCursor,
  colorProfile, Profile 
} from '@tsports/termenv';

class ProgressBar {
  private total: number;
  private current = 0;
  private width = 40;
  private startTime = Date.now();
  
  constructor(total: number, width = 40) {
    this.total = total;
    this.width = width;
    console.log('Processing...');
  }
  
  update(current: number) {
    this.current = current;
    this.render();
  }
  
  increment() {
    this.update(this.current + 1);
  }
  
  private render() {
    const percentage = Math.round((this.current / this.total) * 100);
    const filled = Math.round((this.current / this.total) * this.width);
    const empty = this.width - filled;
    
    // Choose colors based on terminal capability
    const profile = colorProfile();
    let barColor: string;
    
    if (profile >= Profile.TrueColor) {
      barColor = percentage < 33 ? '#FF0000' : 
                 percentage < 66 ? '#FFA500' : '#00FF00';
    } else {
      barColor = percentage < 50 ? '#FF0000' : '#00FF00';
    }
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const eta = this.current > 0 ? 
      Math.round((elapsed * this.total / this.current) - elapsed) : 0;
    
    // Move up one line and clear it
    cursorUp(1);
    clearLine();
    
    const progressText = string(`Progress: [${bar}] ${percentage}% (${this.current}/${this.total}) ETA: ${eta}s`)
      .foreground(rgbColor(barColor));
    
    console.log(progressText.toString());
  }
  
  complete() {
    this.update(this.total);
    console.log('Complete!');
  }
}

// Usage
async function processItems(items: string[]) {
  const progress = new ProgressBar(items.length);
  
  for (let i = 0; i < items.length; i++) {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    progress.increment();
  }
  
  progress.complete();
}

await processItems(['item1', 'item2', 'item3', 'item4', 'item5']);
```

### Status Dashboard

```typescript
import { 
  clearScreen, moveCursor, string, rgbColor,
  altScreen, exitAltScreen, hideCursor, showCursor
} from '@tsports/termenv';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'unknown';
  uptime?: string;
  responseTime?: number;
}

class StatusDashboard {
  private services: ServiceStatus[] = [
    { name: 'Web Server', status: 'online', uptime: '5d 3h', responseTime: 45 },
    { name: 'Database', status: 'online', uptime: '12d 1h', responseTime: 12 },
    { name: 'Cache Redis', status: 'warning', uptime: '2h 30m', responseTime: 156 },
    { name: 'Email Service', status: 'offline', uptime: undefined, responseTime: undefined },
    { name: 'CDN', status: 'online', uptime: '30d 12h', responseTime: 23 },
  ];
  
  start() {
    altScreen();
    hideCursor();
    
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    
    this.render();
    
    // Auto-refresh every 5 seconds
    setInterval(() => this.render(), 5000);
  }
  
  private render() {
    clearScreen();
    
    // Header
    moveCursor(1, 2);
    const header = string('🚀 Service Status Dashboard')
      .foreground(rgbColor('#FF6B35'))
      .bold()
      .underline();
    console.log(header.toString());
    
    // Table header
    moveCursor(3, 2);
    const tableHeader = string('SERVICE'.padEnd(20) + 'STATUS'.padEnd(12) + 'UPTIME'.padEnd(15) + 'RESPONSE')
      .foreground(rgbColor('#888888'))
      .bold();
    console.log(tableHeader.toString());
    
    // Separator
    moveCursor(4, 2);
    console.log('─'.repeat(60));
    
    // Services
    this.services.forEach((service, index) => {
      moveCursor(5 + index, 2);
      this.renderService(service);
    });
    
    // Footer
    moveCursor(15, 2);
    const footer = string(`Last updated: ${new Date().toLocaleTimeString()} • Press Ctrl+C to exit`)
      .foreground(rgbColor('#888888'));
    console.log(footer.toString());
  }
  
  private renderService(service: ServiceStatus) {
    const name = service.name.padEnd(20);
    const status = this.formatStatus(service.status);
    const uptime = (service.uptime || 'N/A').padEnd(15);
    const response = service.responseTime ? `${service.responseTime}ms` : 'N/A';
    
    console.log(`${name}${status}${uptime}${response}`);
  }
  
  private formatStatus(status: ServiceStatus['status']): string {
    const statusText = status.toUpperCase().padEnd(12);
    
    switch (status) {
      case 'online':
        return string(statusText).foreground(rgbColor('#00FF00')).toString();
      case 'warning':
        return string(statusText).foreground(rgbColor('#FFA500')).toString();
      case 'offline':
        return string(statusText).foreground(rgbColor('#FF0000')).bold().toString();
      case 'unknown':
        return string(statusText).foreground(rgbColor('#888888')).toString();
    }
  }
  
  stop() {
    this.cleanup();
    process.exit(0);
  }
  
  private cleanup() {
    showCursor();
    exitAltScreen();
  }
}

// Usage
const dashboard = new StatusDashboard();
dashboard.start();
```

## Best Practices

### 1. Environment Detection

Always check terminal capabilities before using advanced features:

```typescript
import { colorProfile, Profile, envNoColor } from '@tsports/termenv';

function safeColor() {
  if (envNoColor()) {
    return false; // User explicitly disabled colors
  }
  
  const profile = colorProfile();
  return profile > Profile.Ascii;
}

// Use colors only if supported
const text = safeColor() ? 
  string('Colorful text').foreground(rgbColor('#FF0000')) :
  string('Plain text');
```

### 2. Graceful Degradation

Design your output to work across all terminal types:

```typescript
import { colorProfile, Profile, string, rgbColor, ansiColor } from '@tsports/termenv';

function adaptiveOutput(level: 'error' | 'success' | 'info', message: string) {
  const profile = colorProfile();
  let styled = string(message);
  
  if (profile >= Profile.ANSI) {
    switch (level) {
      case 'error':
        styled = styled.foreground(profile >= Profile.TrueColor ? 
          rgbColor('#FF0000') : ansiColor(1));
        break;
      case 'success':
        styled = styled.foreground(profile >= Profile.TrueColor ? 
          rgbColor('#00FF00') : ansiColor(2));
        break;
      case 'info':
        styled = styled.foreground(profile >= Profile.TrueColor ? 
          rgbColor('#0000FF') : ansiColor(4));
        break;
    }
  }
  
  return styled.toString();
}
```

### 3. Cleanup and Error Handling

Always cleanup terminal state:

```typescript
import { altScreen, exitAltScreen, hideCursor, showCursor } from '@tsports/termenv';

class TerminalApp {
  private cleanupFunctions: (() => void)[] = [];
  
  initialize() {
    // Setup terminal
    altScreen();
    hideCursor();
    
    // Register cleanup functions
    this.cleanupFunctions.push(() => showCursor());
    this.cleanupFunctions.push(() => exitAltScreen());
    
    // Register cleanup on various exit conditions
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
    process.on('uncaughtException', (err) => {
      console.error(err);
      this.cleanup();
      process.exit(1);
    });
  }
  
  cleanup() {
    this.cleanupFunctions.forEach(fn => {
      try { fn(); } catch (e) { /* ignore cleanup errors */ }
    });
  }
}
```

### 4. Testing

Mock terminal capabilities for consistent tests:

```typescript
import { newOutput, withProfile, Profile } from '@tsports/termenv';

// Test with specific profiles
describe('Color output', () => {
  test('handles TrueColor profile', () => {
    const output = newOutput(process.stdout, withProfile(Profile.TrueColor));
    const styled = output.string('test').foreground(output.color('#FF0000'));
    expect(styled.toString()).toContain('38;2;255;0;0');
  });
  
  test('handles Ascii profile', () => {
    const output = newOutput(process.stdout, withProfile(Profile.Ascii));
    const styled = output.string('test').foreground(output.color('#FF0000'));
    expect(styled.toString()).toBe('test'); // No color codes
  });
});
```

This comprehensive guide covers the most common usage patterns and real-world applications of `@tsports/termenv`. The examples demonstrate both simple and complex use cases, showing how to build robust, cross-platform terminal applications.
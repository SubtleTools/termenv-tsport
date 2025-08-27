# Examples Collection

This comprehensive collection of examples demonstrates various features of `@tsports/termenv`, ported and expanded from the original Go implementation.

## Basic Examples

### Hello World (Port of Go Example)

This is a TypeScript port of the original Go hello-world example.

```typescript
import { 
  colorProfile, profileName, string, rgbColor, 
  newOutput, Profile 
} from '@tsports/termenv';

async function helloWorld() {
  // Get color profile information
  const profile = colorProfile();
  console.log(`Terminal supports: ${profileName(profile)}`);
  
  // Create a basic styled string
  const hello = string('Hello, world!')
    .foreground(rgbColor('#71BEF2'))
    .bold();
  
  console.log(hello.toString());
  
  // Show profile-specific examples
  if (profile >= Profile.TrueColor) {
    const trueColor = string('✨ TrueColor Example')
      .foreground(rgbColor('#FF6B35'))
      .background(rgbColor('#000000'));
    console.log(trueColor.toString());
  }
  
  if (profile >= Profile.ANSI256) {
    const ansi256 = string('🎨 256-Color Example')
      .foreground(ansi256Color(208)) // Orange
      .background(ansi256Color(235)); // Dark gray
    console.log(ansi256.toString());
  }
  
  if (profile >= Profile.ANSI) {
    const ansi = string('🌈 Basic ANSI Example')
      .foreground(ansiColor(9)) // Bright red
      .background(ansiColor(0)); // Black
    console.log(ansi.toString());
  }
}

await helloWorld();
```

### Color Chart (Port of Go Example)

Display all available colors in your terminal.

```typescript
import { 
  colorProfile, Profile, string, ansiColor, ansi256Color, 
  convertToRGB, profileName 
} from '@tsports/termenv';

function displayColorChart() {
  const profile = colorProfile();
  console.log(`=== Color Chart for ${profileName(profile)} ===\n`);
  
  // ANSI Colors (0-15)
  console.log('=== Standard ANSI Colors (0-15) ===');
  for (let i = 0; i < 16; i++) {
    const color = ansiColor(i);
    const rgb = convertToRGB(color);
    const hex = rgb ? `#${rgb.hex().toUpperCase()}` : 'N/A';
    
    // Choose contrasting text color
    const textColor = rgb && rgb.isDark() ? ansiColor(15) : ansiColor(0);
    
    const sample = string(`  ${i.toString().padStart(2)}  `)
      .background(color)
      .foreground(textColor);
    
    const label = string(`ANSI ${i.toString().padStart(2)}: ${hex}`)
      .foreground(color);
    
    console.log(`${sample.toString()} ${label.toString()}`);
    
    // New line after every 8 colors
    if (i === 7) console.log();
  }
  
  console.log();
  
  // Extended colors (16-231) - only if supported
  if (profile >= Profile.ANSI256) {
    console.log('=== Extended ANSI Colors (16-231) ===');
    
    // 6x6x6 color cube
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        let line = '';
        for (let b = 0; b < 6; b++) {
          const colorIndex = 16 + (r * 36) + (g * 6) + b;
          const color = ansi256Color(colorIndex);
          const sample = string(`${colorIndex.toString().padStart(3)} `)
            .background(color);
          line += sample.toString();
        }
        console.log(line);
      }
      console.log(); // Separate each red level
    }
    
    // Grayscale ramp (232-255)
    console.log('=== Grayscale Colors (232-255) ===');
    let grayscaleLine = '';
    for (let i = 232; i < 256; i++) {
      const color = ansi256Color(i);
      const rgb = convertToRGB(color);
      const textColor = rgb && rgb.isDark() ? ansiColor(15) : ansiColor(0);
      
      const sample = string(`${i}`)
        .background(color)
        .foreground(textColor);
      
      grayscaleLine += sample.toString() + ' ';
      
      if ((i - 232 + 1) % 8 === 0) {
        console.log(grayscaleLine);
        grayscaleLine = '';
      }
    }
    
    if (grayscaleLine) {
      console.log(grayscaleLine);
    }
  }
}

displayColorChart();
```

## Intermediate Examples

### Progress Bar with Color Transitions

```typescript
import { 
  string, rgbColor, clearLine, cursorUp, moveCursor,
  colorProfile, Profile 
} from '@tsports/termenv';

class ColorProgressBar {
  private total: number;
  private current = 0;
  private width: number;
  private startTime = Date.now();
  
  constructor(total: number, width = 50) {
    this.total = total;
    this.width = width;
    console.log('Starting process...');
  }
  
  private getColor(percentage: number): string {
    const profile = colorProfile();
    
    if (profile >= Profile.TrueColor) {
      // Smooth color transition from red to green
      if (percentage < 50) {
        const intensity = Math.round((percentage / 50) * 255);
        return `#${intensity.toString(16).padStart(2, '0')}${(255 - intensity).toString(16).padStart(2, '0')}00`;
      } else {
        const intensity = Math.round(((percentage - 50) / 50) * 255);
        return `#${(255 - intensity).toString(16).padStart(2, '0')}FF00`;
      }
    } else {
      // Fallback to basic colors
      return percentage < 33 ? '#FF0000' : 
             percentage < 66 ? '#FFFF00' : '#00FF00';
    }
  }
  
  update(current: number, status = '') {
    this.current = current;
    const percentage = Math.round((current / this.total) * 100);
    const filled = Math.round((current / this.total) * this.width);
    const empty = this.width - filled;
    
    // Calculate timing
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const eta = current > 0 ? 
      Math.round((elapsed * this.total / current) - elapsed) : 0;
    
    // Create progress bar
    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);
    const bar = filledBar + emptyBar;
    
    const color = this.getColor(percentage);
    
    // Move up and clear line
    cursorUp(1);
    clearLine();
    
    const progressText = string(`Progress: [${bar}] ${percentage}%`)
      .foreground(rgbColor(color));
    
    const statsText = string(` (${current}/${this.total}) ETA: ${eta}s`)
      .foreground(rgbColor('#888888'));
    
    const statusText = status ? 
      string(` ${status}`).foreground(rgbColor('#71BEF2')) : '';
    
    console.log(progressText.toString() + statsText.toString() + statusText.toString());
  }
  
  complete(message = 'Complete!') {
    this.update(this.total, message);
    const completedText = string(`✅ ${message}`)
      .foreground(rgbColor('#00FF00'))
      .bold();
    console.log(completedText.toString());
  }
}

// Usage example
async function processItems() {
  const items = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`);
  const progress = new ColorProgressBar(items.length);
  
  for (let i = 0; i < items.length; i++) {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    progress.update(i + 1, `Processing ${items[i]}`);
  }
  
  progress.complete('All items processed!');
}

await processItems();
```

### Styled Logger System

```typescript
import { 
  string, rgbColor, ansiColor, ANSIBrightRed, ANSIBrightYellow, 
  ANSIBrightGreen, ANSIBrightBlue, ANSIBrightCyan 
} from '@tsports/termenv';

interface LogLevel {
  name: string;
  color: ReturnType<typeof rgbColor | typeof ansiColor>;
  icon: string;
  bold?: boolean;
}

class StyledLogger {
  private levels: Record<string, LogLevel> = {
    error: { 
      name: 'ERROR', 
      color: ANSIBrightRed, 
      icon: '❌', 
      bold: true 
    },
    warn: { 
      name: 'WARN ', 
      color: ANSIBrightYellow, 
      icon: '⚠️ ' 
    },
    info: { 
      name: 'INFO ', 
      color: ANSIBrightBlue, 
      icon: 'ℹ️ ' 
    },
    success: { 
      name: 'SUCCESS', 
      color: ANSIBrightGreen, 
      icon: '✅', 
      bold: true 
    },
    debug: { 
      name: 'DEBUG', 
      color: rgbColor('#888888'), 
      icon: '🐛' 
    },
    trace: { 
      name: 'TRACE', 
      color: ANSIBrightCyan, 
      icon: '🔍' 
    }
  };
  
  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19);
  }
  
  private log(level: string, message: string, ...args: any[]) {
    const logLevel = this.levels[level];
    if (!logLevel) {
      throw new Error(`Unknown log level: ${level}`);
    }
    
    const timestamp = string(`[${this.formatTimestamp()}]`)
      .foreground(rgbColor('#666666'));
    
    let levelText = string(`[${logLevel.name}]`)
      .foreground(logLevel.color);
    
    if (logLevel.bold) {
      levelText = levelText.bold();
    }
    
    const icon = logLevel.icon;
    const fullMessage = [message, ...args].join(' ');
    
    console.log(`${timestamp.toString()} ${levelText.toString()} ${icon} ${fullMessage}`);
  }
  
  error(message: string, ...args: any[]) { this.log('error', message, ...args); }
  warn(message: string, ...args: any[]) { this.log('warn', message, ...args); }
  info(message: string, ...args: any[]) { this.log('info', message, ...args); }
  success(message: string, ...args: any[]) { this.log('success', message, ...args); }
  debug(message: string, ...args: any[]) { this.log('debug', message, ...args); }
  trace(message: string, ...args: any[]) { this.log('trace', message, ...args); }
}

// Usage example
const logger = new StyledLogger();

logger.info('Application starting up');
logger.debug('Loading configuration from config.json');
logger.success('Database connection established');
logger.warn('Configuration file missing, using defaults');
logger.error('Failed to connect to external API', 'timeout after 30s');
logger.trace('Processing user request', { userId: 12345, action: 'login' });
```

## Advanced Examples

### Full-Screen Dashboard Application

```typescript
import { 
  altScreen, exitAltScreen, clearScreen, hideCursor, showCursor,
  moveCursor, string, rgbColor, enableMouse, disableMouse,
  setWindowTitle 
} from '@tsports/termenv';

interface Widget {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  render(): string[];
}

class StatusWidget implements Widget {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public title: string,
    private status: 'online' | 'offline' | 'warning'
  ) {}
  
  render(): string[] {
    const lines: string[] = [];
    
    // Title bar
    const titleBar = string(`┌─ ${this.title} ${'─'.repeat(Math.max(0, this.width - this.title.length - 4))}┐`)
      .foreground(rgbColor('#71BEF2'));
    lines.push(titleBar.toString());
    
    // Status content
    const statusColor = this.status === 'online' ? '#00FF00' :
                       this.status === 'warning' ? '#FFA500' : '#FF0000';
    
    const statusText = string(`Status: ${this.status.toUpperCase()}`)
      .foreground(rgbColor(statusColor))
      .bold();
    
    lines.push(`│ ${statusText.toString()}${' '.repeat(Math.max(0, this.width - statusText.toString().length - 3))}│`);
    
    // Fill remaining height
    for (let i = 2; i < this.height - 1; i++) {
      lines.push(`│${' '.repeat(this.width - 2)}│`);
    }
    
    // Bottom border
    const bottomBar = string(`└${'─'.repeat(this.width - 2)}┘`)
      .foreground(rgbColor('#71BEF2'));
    lines.push(bottomBar.toString());
    
    return lines;
  }
}

class MetricsWidget implements Widget {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public title: string,
    private metrics: Array<{ name: string; value: string; color: string }>
  ) {}
  
  render(): string[] {
    const lines: string[] = [];
    
    // Title bar
    const titleBar = string(`┌─ ${this.title} ${'─'.repeat(Math.max(0, this.width - this.title.length - 4))}┐`)
      .foreground(rgbColor('#FF6B35'));
    lines.push(titleBar.toString());
    
    // Metrics content
    for (let i = 0; i < Math.min(this.metrics.length, this.height - 3); i++) {
      const metric = this.metrics[i];
      const name = string(metric.name).foreground(rgbColor('#CCCCCC'));
      const value = string(metric.value).foreground(rgbColor(metric.color)).bold();
      const line = `│ ${name.toString()}: ${value.toString()}`;
      const padding = ' '.repeat(Math.max(0, this.width - line.length + name.toString().length + value.toString().length - 3));
      lines.push(line + padding + '│');
    }
    
    // Fill remaining height
    for (let i = lines.length; i < this.height - 1; i++) {
      lines.push(`│${' '.repeat(this.width - 2)}│`);
    }
    
    // Bottom border
    const bottomBar = string(`└${'─'.repeat(this.width - 2)}┘`)
      .foreground(rgbColor('#FF6B35'));
    lines.push(bottomBar.toString());
    
    return lines;
  }
}

class Dashboard {
  private widgets: Widget[] = [];
  private running = false;
  
  constructor() {
    this.setupWidgets();
  }
  
  private setupWidgets() {
    // Status widgets
    this.widgets.push(new StatusWidget(2, 2, 25, 8, 'Web Server', 'online'));
    this.widgets.push(new StatusWidget(29, 2, 25, 8, 'Database', 'online'));
    this.widgets.push(new StatusWidget(56, 2, 25, 8, 'Cache', 'warning'));
    
    // Metrics widget
    this.widgets.push(new MetricsWidget(2, 11, 40, 10, 'System Metrics', [
      { name: 'CPU Usage', value: '45%', color: '#FFA500' },
      { name: 'Memory', value: '2.1GB / 8GB', color: '#00FF00' },
      { name: 'Disk I/O', value: '1.2MB/s', color: '#71BEF2' },
      { name: 'Network', value: '150KB/s', color: '#00FF00' },
      { name: 'Active Users', value: '1,234', color: '#FF6B35' }
    ]));
  }
  
  async start() {
    // Setup full-screen mode
    altScreen();
    hideCursor();
    enableMouse();
    clearScreen();
    setWindowTitle('System Dashboard');
    
    this.running = true;
    
    // Setup cleanup
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
    
    // Render loop
    this.render();
    const interval = setInterval(() => {
      if (!this.running) {
        clearInterval(interval);
        return;
      }
      this.render();
    }, 1000);
  }
  
  private render() {
    clearScreen();
    
    // Header
    moveCursor(1, 2);
    const header = string('🚀 System Dashboard')
      .foreground(rgbColor('#FF6B35'))
      .bold()
      .underline();
    console.log(header.toString());
    
    // Render all widgets
    for (const widget of this.widgets) {
      const lines = widget.render();
      for (let i = 0; i < lines.length; i++) {
        moveCursor(widget.y + i, widget.x);
        console.log(lines[i]);
      }
    }
    
    // Footer
    moveCursor(25, 2);
    const footer = string(`Last updated: ${new Date().toLocaleTimeString()} | Press Ctrl+C to exit`)
      .foreground(rgbColor('#888888'));
    console.log(footer.toString());
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
const dashboard = new Dashboard();
await dashboard.start();
```

### Interactive Color Picker

```typescript
import { 
  altScreen, exitAltScreen, clearScreen, hideCursor, showCursor,
  moveCursor, string, rgbColor, enableMouse, disableMouse 
} from '@tsports/termenv';

class ColorPicker {
  private selectedColor = '#FF0000';
  private running = false;
  
  private hue = 0;
  private saturation = 100;
  private lightness = 50;
  
  async start() {
    altScreen();
    hideCursor();
    enableMouse();
    clearScreen();
    
    this.running = true;
    
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.stop());
    
    // Setup keyboard input
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => this.handleInput(key));
    
    this.render();
  }
  
  private hslToHex(h: number, s: number, l: number): string {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  
  private render() {
    clearScreen();
    
    // Title
    moveCursor(1, 2);
    const title = string('🎨 Interactive Color Picker')
      .foreground(rgbColor('#FF6B35'))
      .bold()
      .underline();
    console.log(title.toString());
    
    // Current color display
    moveCursor(3, 2);
    this.selectedColor = this.hslToHex(this.hue, this.saturation, this.lightness);
    const colorSample = string('    SAMPLE TEXT    ')
      .foreground(rgbColor('#FFFFFF'))
      .background(rgbColor(this.selectedColor));
    console.log(`Current Color: ${colorSample.toString()} ${this.selectedColor}`);
    
    // HSL Values
    moveCursor(5, 2);
    const hueText = string(`Hue:        ${this.hue.toString().padStart(3)}°`)
      .foreground(rgbColor('#FF0000'));
    console.log(hueText.toString());
    
    moveCursor(6, 2);
    const satText = string(`Saturation: ${this.saturation.toString().padStart(3)}%`)
      .foreground(rgbColor('#00FF00'));
    console.log(satText.toString());
    
    moveCursor(7, 2);
    const lightText = string(`Lightness:  ${this.lightness.toString().padStart(3)}%`)
      .foreground(rgbColor('#0000FF'));
    console.log(lightText.toString());
    
    // Hue spectrum
    moveCursor(9, 2);
    console.log('Hue Spectrum:');
    moveCursor(10, 2);
    let spectrum = '';
    for (let h = 0; h < 360; h += 10) {
      const color = this.hslToHex(h, 100, 50);
      const marker = h === Math.round(this.hue / 10) * 10 ? '█' : '▇';
      spectrum += string(marker).foreground(rgbColor(color)).toString();
    }
    console.log(spectrum);
    
    // Instructions
    moveCursor(12, 2);
    console.log('Controls:');
    moveCursor(13, 2);
    console.log('  ← → : Adjust Hue');
    moveCursor(14, 2);
    console.log('  ↑ ↓ : Adjust Saturation (with Shift for Lightness)');
    moveCursor(15, 2);
    console.log('  Q   : Quit');
    
    // Color palette examples
    moveCursor(17, 2);
    console.log('Palette variations:');
    moveCursor(18, 2);
    const variations = [
      this.hslToHex(this.hue, this.saturation, Math.max(10, this.lightness - 20)),
      this.hslToHex(this.hue, this.saturation, Math.max(5, this.lightness - 10)),
      this.selectedColor,
      this.hslToHex(this.hue, this.saturation, Math.min(90, this.lightness + 10)),
      this.hslToHex(this.hue, this.saturation, Math.min(95, this.lightness + 20))
    ];
    
    let paletteDisplay = '';
    for (const color of variations) {
      paletteDisplay += string('  ██  ').background(rgbColor(color)).toString();
    }
    console.log(paletteDisplay);
    
    moveCursor(19, 2);
    console.log(variations.join('  '));
  }
  
  private handleInput(key: Buffer) {
    const keyStr = key.toString();
    
    switch (keyStr) {
      case '\u001B[D': // Left arrow
        this.hue = Math.max(0, this.hue - 5);
        break;
      case '\u001B[C': // Right arrow
        this.hue = Math.min(360, this.hue + 5);
        break;
      case '\u001B[A': // Up arrow
        if (key[0] === 27 && key[1] === 91 && key[2] === 49 && key[3] === 59 && key[4] === 50) {
          // Shift+Up: increase lightness
          this.lightness = Math.min(100, this.lightness + 5);
        } else {
          // Up: increase saturation
          this.saturation = Math.min(100, this.saturation + 5);
        }
        break;
      case '\u001B[B': // Down arrow
        if (key[0] === 27 && key[1] === 91 && key[2] === 49 && key[3] === 59 && key[4] === 50) {
          // Shift+Down: decrease lightness
          this.lightness = Math.max(0, this.lightness - 5);
        } else {
          // Down: decrease saturation
          this.saturation = Math.max(0, this.saturation - 5);
        }
        break;
      case 'q':
      case 'Q':
      case '\u0003': // Ctrl+C
        this.stop();
        return;
    }
    
    this.render();
  }
  
  stop() {
    this.running = false;
    this.cleanup();
    
    // Show final color
    console.log(`\nSelected color: ${this.selectedColor}`);
    console.log(`HSL: ${this.hue}°, ${this.saturation}%, ${this.lightness}%`);
    
    process.exit(0);
  }
  
  private cleanup() {
    disableMouse();
    showCursor();
    exitAltScreen();
    process.stdin.setRawMode?.(false);
    process.stdin.pause();
  }
}

// Usage
const colorPicker = new ColorPicker();
await colorPicker.start();
```

## Utility Examples

### Terminal Capability Tester

```typescript
import { 
  colorProfile, Profile, profileName, hasDarkBackground,
  foregroundColor, backgroundColor, envNoColor, envColorProfile,
  string, rgbColor, ansiColor, ansi256Color, createHyperlink,
  sendNotification 
} from '@tsports/termenv';

function testTerminalCapabilities() {
  console.log('=== Terminal Capability Test ===\n');
  
  // Basic information
  console.log(`Platform: ${process.platform}`);
  console.log(`Node.js: ${process.version}`);
  console.log(`TTY: ${process.stdout.isTTY}`);
  console.log(`TERM: ${process.env.TERM || 'not set'}`);
  console.log(`COLORTERM: ${process.env.COLORTERM || 'not set'}`);
  
  // Color profile information
  const profile = colorProfile();
  const envProfile = envColorProfile();
  console.log(`\nDetected color profile: ${profileName(profile)} (${profile})`);
  console.log(`Environment color profile: ${profileName(envProfile)} (${envProfile})`);
  console.log(`NO_COLOR environment: ${envNoColor()}`);
  
  // Background detection
  const isDark = hasDarkBackground();
  console.log(`\nDark background: ${isDark}`);
  
  try {
    const fgColor = foregroundColor();
    const bgColor = backgroundColor();
    console.log(`Foreground color: ${fgColor.toString()}`);
    console.log(`Background color: ${bgColor.toString()}`);
  } catch (e) {
    console.log('Could not detect terminal colors');
  }
  
  console.log('\n=== Color Tests ===\n');
  
  // Test different color types
  if (profile >= Profile.ANSI) {
    console.log('ANSI Colors (4-bit):');
    const ansiTest = string('ANSI Color Test').foreground(ansiColor(9)).bold();
    console.log(`  ${ansiTest.toString()}`);
  }
  
  if (profile >= Profile.ANSI256) {
    console.log('ANSI 256 Colors (8-bit):');
    const ansi256Test = string('ANSI 256 Color Test').foreground(ansi256Color(208)).bold();
    console.log(`  ${ansi256Test.toString()}`);
  }
  
  if (profile >= Profile.TrueColor) {
    console.log('TrueColor (24-bit):');
    const trueColorTest = string('TrueColor Test').foreground(rgbColor('#FF6B35')).bold();
    console.log(`  ${trueColorTest.toString()}`);
  }
  
  // Style tests
  console.log('\n=== Style Tests ===\n');
  
  const styles = [
    { name: 'Bold', style: (s: any) => s.bold() },
    { name: 'Italic', style: (s: any) => s.italic() },
    { name: 'Underline', style: (s: any) => s.underline() },
    { name: 'Strikethrough', style: (s: any) => s.strikethrough() },
    { name: 'Reverse', style: (s: any) => s.reverse() },
    { name: 'Faint', style: (s: any) => s.faint() },
  ];
  
  for (const { name, style } of styles) {
    const styledText = style(string(`${name} text`));
    console.log(`${name}: ${styledText.toString()}`);
  }
  
  // Advanced feature tests
  console.log('\n=== Advanced Features ===\n');
  
  // Hyperlink test
  try {
    const hyperlink = createHyperlink('https://example.com', 'Test Hyperlink');
    console.log(`Hyperlink: ${hyperlink}`);
    console.log('(Click the link above if your terminal supports OSC 8)');
  } catch (e) {
    console.log('Hyperlinks not supported or failed');
  }
  
  // Notification test
  try {
    console.log('Sending test notification...');
    sendNotification('Terminal Test', 'This is a test notification from termenv!');
    console.log('Notification sent (check if you received it)');
  } catch (e) {
    console.log('Notifications not supported or failed');
  }
  
  console.log('\n=== Test Complete ===');
}

testTerminalCapabilities();
```

### Color Palette Generator

```typescript
import { string, rgbColor, colorProfile, Profile } from '@tsports/termenv';

interface ColorPalette {
  name: string;
  colors: string[];
  description: string;
}

class PaletteGenerator {
  private palettes: ColorPalette[] = [
    {
      name: 'Sunset',
      colors: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FF6B6B'],
      description: 'Warm sunset colors'
    },
    {
      name: 'Ocean',
      colors: ['#006A6B', '#0F7173', '#40A4C8', '#71BEF2', '#A8E6CF'],
      description: 'Cool ocean blues and greens'
    },
    {
      name: 'Forest',
      colors: ['#2D5016', '#3F6622', '#61892F', '#86AC41', '#A2C523'],
      description: 'Natural forest greens'
    },
    {
      name: 'Monochrome',
      colors: ['#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF'],
      description: 'Grayscale palette'
    },
    {
      name: 'Pastel',
      colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
      description: 'Soft pastel colors'
    }
  ];
  
  displayPalette(palette: ColorPalette) {
    console.log(`\n=== ${palette.name} Palette ===`);
    console.log(palette.description);
    console.log();
    
    // Color swatches
    let swatches = '';
    let hexCodes = '';
    
    for (const color of palette.colors) {
      const swatch = string('████').foreground(rgbColor(color));
      swatches += swatch.toString() + ' ';
      hexCodes += `${color} `;
    }
    
    console.log(swatches);
    console.log(hexCodes);
    
    // Usage examples
    console.log('\nUsage examples:');
    for (let i = 0; i < palette.colors.length; i++) {
      const example = string(`Example text ${i + 1}`)
        .foreground(rgbColor(palette.colors[i]));
      console.log(`  ${example.toString()} - ${palette.colors[i]}`);
    }
  }
  
  displayAllPalettes() {
    const profile = colorProfile();
    
    if (profile < Profile.TrueColor) {
      console.log('Note: Your terminal does not support TrueColor. Colors may be approximated.');
    }
    
    console.log('🎨 Color Palette Generator');
    console.log('==========================');
    
    for (const palette of this.palettes) {
      this.displayPalette(palette);
    }
    
    // Interactive palette
    console.log('\n=== Custom Gradient ===');
    this.displayGradient('#FF0000', '#00FF00', 10);
  }
  
  private displayGradient(startColor: string, endColor: string, steps: number) {
    console.log(`Gradient from ${startColor} to ${endColor} (${steps} steps):`);
    
    const start = this.hexToRgb(startColor);
    const end = this.hexToRgb(endColor);
    
    let gradient = '';
    let codes = '';
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(start.r + (end.r - start.r) * ratio);
      const g = Math.round(start.g + (end.g - start.g) * ratio);
      const b = Math.round(start.b + (end.b - start.b) * ratio);
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const swatch = string('██').foreground(rgbColor(hex));
      
      gradient += swatch.toString();
      codes += `${hex} `;
    }
    
    console.log(gradient);
    console.log(codes);
  }
  
  private hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
}

// Usage
const generator = new PaletteGenerator();
generator.displayAllPalettes();
```

These examples demonstrate the full range of capabilities available in `@tsports/termenv`, from basic text styling to complex interactive applications. Each example is designed to work across different terminal environments while gracefully degrading when advanced features are not available.

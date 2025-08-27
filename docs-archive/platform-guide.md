# Platform-Specific Guide

This guide covers platform-specific considerations and terminal compatibility for `@tsports/termenv`, ported from the original Go implementation with additional TypeScript/Node.js specific details.

## Platform Support Overview

| Platform           | Support Level | Notes                                        |
| ------------------ | ------------- | -------------------------------------------- |
| **Linux**          | ✅ Excellent  | Full feature support across distributions    |
| **macOS**          | ✅ Excellent  | Native terminal and iTerm2 fully supported   |
| **Windows 10+**    | ✅ Good       | Requires Windows 10 v1511+ for color support |
| **Windows Legacy** | ⚠️ Limited     | Basic functionality, no colors               |
| **CI/CD**          | ✅ Good       | Auto-detects and adapts to CI environments   |

## Windows Support

### Windows 10/11 (Recommended)

Windows 10 version 1511 (build 10586) and later support Virtual Terminal Processing, enabling full color and terminal control features.

#### Automatic Detection

```typescript
import { colorProfile, profileName, newOutput } from '@tsports/termenv';

// termenv automatically enables Virtual Terminal Processing when possible
const profile = colorProfile();
console.log(`Windows terminal supports: ${profileName(profile)}`);

// Create output - VTP is handled automatically
const output = newOutput(process.stdout);
const styled = output.string('Colored text')
  .foreground(output.color('#FF0000'));
console.log(styled.toString());
```

#### Manual VTP Control (Advanced)

```typescript
import { newOutput, withUnsafe } from '@tsports/termenv';

// Enable unsafe mode for manual VTP control
const output = newOutput(process.stdout, withUnsafe());

// Check if running on Windows
if (process.platform === 'win32') {
  console.log('Running on Windows - VTP should be automatically enabled');
}
```

### Windows Terminal vs Command Prompt

#### Windows Terminal (Recommended)

- ✅ Full TrueColor support
- ✅ Hyperlink support (OSC 8)
- ✅ All terminal control sequences
- ✅ Mouse support

```typescript
import { colorProfile, Profile } from '@tsports/termenv';

// Windows Terminal typically supports TrueColor
if (colorProfile() === Profile.TrueColor) {
  console.log('Running in Windows Terminal or similar modern terminal');
}
```

#### Command Prompt (Legacy)

- ⚠️ Limited color support (16 colors maximum)
- ❌ No hyperlink support
- ⚠️ Basic terminal control only

```typescript
import { colorProfile, Profile, string, ansiColor } from '@tsports/termenv';

// Adapt for older Command Prompt
if (process.platform === 'win32' && colorProfile() <= Profile.ANSI) {
  // Use basic ANSI colors only
  const text = string('Warning: Limited color support')
    .foreground(ansiColor(3)); // Yellow
  console.log(text.toString());
}
```

### PowerShell Considerations

PowerShell has its own terminal handling that may affect color output:

```typescript
import { envNoColor, colorProfile } from '@tsports/termenv';

// Check if running in PowerShell
const isPowerShell = process.env.PSModulePath !== undefined;

if (isPowerShell) {
  console.log('Running in PowerShell');
  if (envNoColor()) {
    console.log('Colors disabled in PowerShell environment');
  }
}
```

### Windows-Specific Example

```typescript
import { 
  string, colorProfile, Profile, rgbColor, ansiColor,
  clearScreen, moveCursor 
} from '@tsports/termenv';

function windowsDemo() {
  console.log(`Platform: ${process.platform}`);
  console.log(`Node version: ${process.version}`);
  
  const profile = colorProfile();
  console.log(`Color profile: ${profileName(profile)}`);
  
  // Adapt colors based on Windows terminal capabilities
  let titleColor;
  if (profile >= Profile.TrueColor) {
    titleColor = rgbColor('#0078d4'); // Windows blue
  } else if (profile >= Profile.ANSI) {
    titleColor = ansiColor(4); // Blue
  } else {
    titleColor = null; // No color
  }
  
  const title = titleColor ? 
    string('Windows Application').foreground(titleColor) :
    string('Windows Application');
  
  clearScreen();
  moveCursor(1, 1);
  console.log(title.toString());
}

if (process.platform === 'win32') {
  windowsDemo();
}
```

## Linux Support

Linux terminals generally have excellent support for all termenv features.

### Common Linux Terminals

#### GNOME Terminal

- ✅ TrueColor support
- ✅ All terminal control features
- ✅ Mouse support

#### Konsole (KDE)

- ✅ TrueColor support
- ✅ Hyperlink support
- ✅ All terminal control features

#### XTerm

- ⚠️ TrueColor support (recent versions)
- ✅ Basic terminal control
- ⚠️ Limited mouse support

```typescript
import { colorProfile, Profile, string, rgbColor } from '@tsports/termenv';

// Check terminal capabilities on Linux
if (process.platform === 'linux') {
  const profile = colorProfile();
  const termEnv = process.env.TERM || 'unknown';
  
  console.log(`TERM: ${termEnv}`);
  console.log(`Color profile: ${profileName(profile)}`);
  
  // Ubuntu/GNOME Terminal typically supports TrueColor
  if (profile === Profile.TrueColor) {
    const ubuntuOrange = string('Ubuntu Orange')
      .foreground(rgbColor('#E95420'));
    console.log(ubuntuOrange.toString());
  }
}
```

### Server/Headless Linux

Many Linux servers run without full terminal capabilities:

```typescript
import { colorProfile, Profile, envNoColor } from '@tsports/termenv';

function detectServerEnvironment() {
  const isTTY = process.stdout.isTTY;
  const profile = colorProfile();
  const noColor = envNoColor();
  
  console.log(`TTY: ${isTTY}`);
  console.log(`Color profile: ${profileName(profile)}`);
  console.log(`NO_COLOR set: ${noColor}`);
  
  if (!isTTY || profile === Profile.Ascii || noColor) {
    console.log('Running in headless/server environment');
    return false;
  }
  
  return true;
}

const hasColors = detectServerEnvironment();
```

## macOS Support

macOS has excellent terminal support across different applications.

### Terminal.app (Default)

- ✅ TrueColor support (macOS 10.12+)
- ⚠️ Limited hyperlink support
- ✅ Basic terminal control

### iTerm2 (Recommended)

- ✅ Full TrueColor support
- ✅ Hyperlink support (OSC 8)
- ✅ Advanced terminal control
- ✅ Mouse support
- ✅ Notification support

```typescript
import { 
  colorProfile, Profile, string, rgbColor,
  createHyperlink, sendNotification 
} from '@tsports/termenv';

function macOSDemo() {
  const profile = colorProfile();
  
  // macOS typically supports TrueColor
  if (profile === Profile.TrueColor) {
    const appleBlue = string('macOS Blue')
      .foreground(rgbColor('#007AFF'));
    console.log(appleBlue.toString());
  }
  
  // Test iTerm2 features
  if (process.env.TERM_PROGRAM === 'iTerm.app') {
    console.log('Running in iTerm2');
    
    // Hyperlinks work well in iTerm2
    const link = createHyperlink('https://iterm2.com', 'iTerm2 Website');
    console.log(`Visit: ${link}`);
    
    // Notifications are supported
    sendNotification('macOS Demo', 'This notification works in iTerm2!');
  }
}

if (process.platform === 'darwin') {
  macOSDemo();
}
```

## Terminal Compatibility Matrix

### Color Support

| Terminal             | Ascii | ANSI (16) | ANSI256 | TrueColor | Notes                       |
| -------------------- | ----- | --------- | ------- | --------- | --------------------------- |
| **Windows Terminal** | ✅    | ✅        | ✅      | ✅        | Recommended for Windows     |
| **Command Prompt**   | ✅    | ✅        | ❌      | ❌        | Windows 10+ only            |
| **PowerShell**       | ✅    | ✅        | ⚠️       | ⚠️         | Depends on host terminal    |
| **GNOME Terminal**   | ✅    | ✅        | ✅      | ✅        | Linux default               |
| **Konsole**          | ✅    | ✅        | ✅      | ✅        | KDE default                 |
| **XTerm**            | ✅    | ✅        | ✅      | ⚠️         | Depends on version          |
| **Terminal.app**     | ✅    | ✅        | ✅      | ✅        | macOS default               |
| **iTerm2**           | ✅    | ✅        | ✅      | ✅        | macOS recommended           |
| **Alacritty**        | ✅    | ✅        | ✅      | ✅        | Cross-platform GPU terminal |
| **kitty**            | ✅    | ✅        | ✅      | ✅        | Fast, feature-rich          |

### Advanced Features

| Terminal             | Hyperlinks | Mouse | Alt Screen | Notifications |
| -------------------- | ---------- | ----- | ---------- | ------------- |
| **Windows Terminal** | ✅         | ✅    | ✅         | ❌            |
| **Command Prompt**   | ❌         | ❌    | ⚠️          | ❌            |
| **GNOME Terminal**   | ⚠️          | ✅    | ✅         | ❌            |
| **Konsole**          | ✅         | ✅    | ✅         | ❌            |
| **Terminal.app**     | ⚠️          | ✅    | ✅         | ❌            |
| **iTerm2**           | ✅         | ✅    | ✅         | ✅            |
| **Alacritty**        | ✅         | ✅    | ✅         | ❌            |
| **kitty**            | ✅         | ✅    | ✅         | ✅            |

## CI/CD Environment Support

### GitHub Actions

```typescript
import { colorProfile, envNoColor } from '@tsports/termenv';

// GitHub Actions sets CI=true and often NO_COLOR
if (process.env.CI === 'true') {
  console.log('Running in CI environment');
  
  if (envNoColor()) {
    console.log('Colors disabled in CI');
  } else {
    console.log(`CI color profile: ${profileName(colorProfile())}`);
  }
}
```

### Docker Containers

```typescript
import { colorProfile, Profile } from '@tsports/termenv';

// Docker containers often lack TTY
if (!process.stdout.isTTY) {
  console.log('No TTY detected (possibly Docker)');
}

// Check if running in Docker
const isDocker = process.env.container === 'docker' || 
                process.env.DOCKER_CONTAINER === 'true';

if (isDocker) {
  console.log('Running in Docker container');
}
```

### Common CI Environment Detection

```typescript
function detectCIEnvironment() {
  const ciEnvs = {
    'GITHUB_ACTIONS': 'GitHub Actions',
    'GITLAB_CI': 'GitLab CI',
    'TRAVIS': 'Travis CI', 
    'CIRCLECI': 'CircleCI',
    'BUILDKITE': 'Buildkite',
    'JENKINS_URL': 'Jenkins',
    'TEAMCITY_VERSION': 'TeamCity'
  };
  
  for (const [env, name] of Object.entries(ciEnvs)) {
    if (process.env[env]) {
      return name;
    }
  }
  
  return process.env.CI === 'true' ? 'Generic CI' : null;
}

const ciEnv = detectCIEnvironment();
if (ciEnv) {
  console.log(`Detected CI: ${ciEnv}`);
  
  // Adapt behavior for CI
  import { newOutput, withProfile, Profile } from '@tsports/termenv';
  const output = newOutput(process.stdout, withProfile(Profile.ANSI));
}
```

## Environment Variables

These environment variables work across all platforms:

### Color Control

```bash
# Disable all colors
export NO_COLOR=1

# Disable colors (alternative)
export CLICOLOR=0

# Force colors even without TTY
export CLICOLOR_FORCE=1

# Enable TrueColor explicitly
export COLORTERM=truecolor
```

### Terminal Type

```bash
# Set terminal capabilities
export TERM=xterm-256color  # 256-color support
export TERM=xterm-truecolor # TrueColor support
export TERM=dumb           # No color/control support
```

### Platform-Specific Environment Variables

#### Windows

```typescript
// Check Windows version for VTP support
const windowsVersion = process.getSystemVersion?.() || 'unknown';
console.log(`Windows version: ${windowsVersion}`);

// Windows Terminal sets this
if (process.env.WT_SESSION) {
  console.log('Running in Windows Terminal');
}
```

#### Linux/Unix

```typescript
// Check for common terminal environments
const displayEnv = process.env.DISPLAY || process.env.WAYLAND_DISPLAY;
if (!displayEnv) {
  console.log('No GUI display detected (headless)');
}

// SSH detection
if (process.env.SSH_CLIENT || process.env.SSH_TTY) {
  console.log('Running over SSH');
}
```

## Best Practices by Platform

### Windows Development

```typescript
import { colorProfile, Profile, string, rgbColor, ansiColor } from '@tsports/termenv';

function windowsBestPractices() {
  const profile = colorProfile();
  
  // Always test with both Windows Terminal and Command Prompt
  if (process.platform === 'win32') {
    console.log('Windows detected');
    
    // Provide fallbacks for older terminals
    const color = profile >= Profile.TrueColor ? 
      rgbColor('#0078d4') : 
      profile >= Profile.ANSI ? ansiColor(4) : null;
    
    const text = color ? 
      string('Windows-styled text').foreground(color) :
      string('Plain text for compatibility');
    
    console.log(text.toString());
  }
}
```

### Linux Server Deployment

```typescript
function linuxServerBestPractices() {
  // Always check TTY availability
  if (!process.stdout.isTTY) {
    console.log('No TTY - using plain text output');
    return;
  }
  
  // Respect NO_COLOR in server environments
  if (envNoColor()) {
    console.log('Colors disabled by NO_COLOR');
    return;
  }
  
  // Use colors sparingly in server logs
  const profile = colorProfile();
  if (profile >= Profile.ANSI) {
    // Use basic colors for better compatibility
    const error = string('ERROR').foreground(ansiColor(1));
    const success = string('SUCCESS').foreground(ansiColor(2));
    console.log(`${error.toString()}: Something failed`);
    console.log(`${success.toString()}: Operation completed`);
  }
}
```

### Cross-Platform Applications

```typescript
import { colorProfile, Profile, string, rgbColor, ansiColor } from '@tsports/termenv';

function crossPlatformColors() {
  const profile = colorProfile();
  
  // Define colors that work well across platforms
  const colors = {
    error: profile >= Profile.TrueColor ? rgbColor('#FF0000') : ansiColor(1),
    success: profile >= Profile.TrueColor ? rgbColor('#00FF00') : ansiColor(2),
    info: profile >= Profile.TrueColor ? rgbColor('#0000FF') : ansiColor(4),
    warning: profile >= Profile.TrueColor ? rgbColor('#FFA500') : ansiColor(3),
  };
  
  console.log(string('Error message').foreground(colors.error).toString());
  console.log(string('Success message').foreground(colors.success).toString());
  console.log(string('Info message').foreground(colors.info).toString());
  console.log(string('Warning message').foreground(colors.warning).toString());
}
```

This platform guide ensures your termenv applications work reliably across different operating systems and terminal environments while taking advantage of each platform's capabilities.

# API Reference - Go to TypeScript Port

This document provides a comprehensive mapping between the original Go termenv API and our TypeScript port.

## Import Patterns

### Go Import
```go
import "github.com/muesli/termenv"
```

### TypeScript Imports

**Modern TypeScript API (Recommended)**
```typescript
import { 
  string, colorProfile, rgbColor, ansiColor, 
  newOutput, clearScreen, moveCursor 
} from '@tsports/termenv';
```

**Go-Compatible API**
```typescript
import { 
  String, ColorProfile, RGBColor, ANSIColor,
  NewOutput, ClearScreen, MoveCursor 
} from '@tsports/termenv/go-style';
```

## Core Functions

### Color Profile Detection

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.ColorProfile()` | `colorProfile()` | `ColorProfile()` |
| `termenv.EnvColorProfile()` | `envColorProfile()` | `EnvColorProfile()` |
| `termenv.EnvNoColor()` | `envNoColor()` | `EnvNoColor()` |
| `termenv.HasDarkBackground()` | `hasDarkBackground()` | `HasDarkBackground()` |

**Examples:**

```go
// Go
profile := termenv.ColorProfile()
isDark := termenv.HasDarkBackground()
```

```typescript
// TypeScript Modern
const profile = colorProfile();
const isDark = hasDarkBackground();

// TypeScript Go-Style
const profile = ColorProfile();
const isDark = HasDarkBackground();
```

### Color Creation

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.NoColor()` | `noColor()` | `NoColor()` |
| `termenv.ANSIColor(n)` | `ansiColor(n)` | `ANSIColor(n)` |
| `termenv.ANSI256Color(n)` | `ansi256Color(n)` | `ANSI256Color(n)` |
| `termenv.RGBColor("#hex")` | `rgbColor('#hex')` | `RGBColor('#hex')` |

**Examples:**

```go
// Go
red := termenv.RGBColor("#FF0000")
blue := termenv.ANSIColor(4)
orange := termenv.ANSI256Color(208)
```

```typescript
// TypeScript Modern
const red = rgbColor('#FF0000');
const blue = ansiColor(4);
const orange = ansi256Color(208);

// TypeScript Go-Style
const red = RGBColor('#FF0000');
const blue = ANSIColor(4);
const orange = ANSI256Color(208);
```

### String Styling

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.String(s)` | `string(s)` | `String(s)` |
| `.Foreground(color)` | `.foreground(color)` | `.Foreground(color)` |
| `.Background(color)` | `.background(color)` | `.Background(color)` |
| `.Bold()` | `.bold()` | `.Bold()` |
| `.Italic()` | `.italic()` | `.Italic()` |
| `.Underline()` | `.underline()` | `.Underline()` |

**Examples:**

```go
// Go
s := termenv.String("Hello")
  .Foreground(termenv.RGBColor("#FF0000"))
  .Bold()
  .Underline()
fmt.Print(s)
```

```typescript
// TypeScript Modern
const s = string('Hello')
  .foreground(rgbColor('#FF0000'))
  .bold()
  .underline();
console.log(s.toString());

// TypeScript Go-Style
const s = String('Hello')
  .Foreground(RGBColor('#FF0000'))
  .Bold()
  .Underline();
console.log(s.String());
```

## Output Instance Methods

### Creating Output

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.NewOutput(w)` | `newOutput(w)` | `NewOutput(w)` |
| `termenv.NewOutput(w, opts...)` | `newOutput(w, ...opts)` | `NewOutput(w, ...opts)` |

**Examples:**

```go
// Go
out := termenv.NewOutput(os.Stdout)
out = termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
```

```typescript
// TypeScript Modern
const out = newOutput(process.stdout);
const out2 = newOutput(process.stdout, withProfile(Profile.TrueColor));

// TypeScript Go-Style
const out = NewOutput(process.stdout);
const out2 = NewOutput(process.stdout, WithProfile(Profile.TrueColor));
```

### Output Methods

| Go Method | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `out.String(s)` | `out.string(s)` | `out.String(s)` |
| `out.Color(s)` | `out.color(s)` | `out.Color(s)` |
| `out.ColorProfile()` | `out.colorProfile()` | `out.ColorProfile()` |
| `out.HasDarkBackground()` | `out.hasDarkBackground()` | `out.HasDarkBackground()` |
| `out.ForegroundColor()` | `out.foregroundColor()` | `out.ForegroundColor()` |
| `out.BackgroundColor()` | `out.backgroundColor()` | `out.BackgroundColor()` |

## Screen Control

### Cursor Management

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.MoveCursor(row, col)` | `moveCursor(row, col)` | `MoveCursor(row, col)` |
| `termenv.CursorUp(n)` | `cursorUp(n)` | `CursorUp(n)` |
| `termenv.CursorDown(n)` | `cursorDown(n)` | `CursorDown(n)` |
| `termenv.HideCursor()` | `hideCursor()` | `HideCursor()` |
| `termenv.ShowCursor()` | `showCursor()` | `ShowCursor()` |

### Screen Operations

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.ClearScreen()` | `clearScreen()` | `ClearScreen()` |
| `termenv.ClearLine()` | `clearLine()` | `ClearLine()` |
| `termenv.AltScreen()` | `altScreen()` | `AltScreen()` |
| `termenv.ExitAltScreen()` | `exitAltScreen()` | `ExitAltScreen()` |

**Examples:**

```go
// Go
termenv.ClearScreen()
termenv.MoveCursor(10, 5)
termenv.HideCursor()
```

```typescript
// TypeScript Modern
clearScreen();
moveCursor(10, 5);
hideCursor();

// TypeScript Go-Style
ClearScreen();
MoveCursor(10, 5);
HideCursor();
```

## Advanced Features

### Mouse Support

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.EnableMouse()` | `enableMouse()` | `EnableMouse()` |
| `termenv.DisableMouse()` | `disableMouse()` | `DisableMouse()` |
| `out.EnableMouseCellMotion()` | `out.enableMouseCellMotion()` | `out.EnableMouseCellMotion()` |
| `out.EnableMouseAllMotion()` | `out.enableMouseAllMotion()` | `out.EnableMouseAllMotion()` |

### Hyperlinks

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.Hyperlink(url, name)` | `createHyperlink(url, name)` | `Hyperlink(url, name)` |
| `out.Hyperlink(url, name)` | `out.hyperlink(url, name)` | `out.Hyperlink(url, name)` |

### Notifications

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.Notify(title, body)` | `sendNotification(title, body)` | `Notify(title, body)` |
| `out.Notify(title, body)` | `out.notify(title, body)` | `out.Notify(title, body)` |

## Configuration Options

### Profile Options

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `termenv.WithProfile(p)` | `withProfile(p)` | `WithProfile(p)` |
| `termenv.WithColorCache(b)` | `withColorCache(b)` | `WithColorCache(b)` |
| `termenv.WithTTY(b)` | `withTTY(b)` | `WithTTY(b)` |
| `termenv.WithUnsafe()` | `withUnsafe()` | `WithUnsafe()` |

### Profile Constants

| Go | TypeScript | Value |
|---|---|---|
| `termenv.Ascii` | `Profile.Ascii` | 0 |
| `termenv.ANSI` | `Profile.ANSI` | 1 |
| `termenv.ANSI256` | `Profile.ANSI256` | 2 |
| `termenv.TrueColor` | `Profile.TrueColor` | 3 |

## Color Constants

### ANSI Color Constants

| Go | TypeScript |
|---|---|
| `termenv.ANSIBlack` | `ANSIBlack` |
| `termenv.ANSIRed` | `ANSIRed` |
| `termenv.ANSIGreen` | `ANSIGreen` |
| `termenv.ANSIYellow` | `ANSIYellow` |
| `termenv.ANSIBlue` | `ANSIBlue` |
| `termenv.ANSIMagenta` | `ANSIMagenta` |
| `termenv.ANSICyan` | `ANSICyan` |
| `termenv.ANSIWhite` | `ANSIWhite` |
| `termenv.ANSIBrightBlack` | `ANSIBrightBlack` |
| `termenv.ANSIBrightRed` | `ANSIBrightRed` |
| `termenv.ANSIBrightGreen` | `ANSIBrightGreen` |
| `termenv.ANSIBrightYellow` | `ANSIBrightYellow` |
| `termenv.ANSIBrightBlue` | `ANSIBrightBlue` |
| `termenv.ANSIBrightMagenta` | `ANSIBrightMagenta` |
| `termenv.ANSIBrightCyan` | `ANSIBrightCyan` |
| `termenv.ANSIBrightWhite` | `ANSIBrightWhite` |

## Type Conversions

### Style Methods Return Values

| Go | TypeScript Modern | TypeScript Go-Style |
|---|---|---|
| `fmt.Print(style)` | `console.log(style.toString())` | `console.log(style.String())` |
| `string(style)` | `style.toString()` | `style.String()` |

### Color Interface Methods

Both APIs implement the same Color interface with these key methods:

| Method | Description | Both APIs |
|---|---|---|
| `sequence(bg)` | Get ANSI sequence | ✓ |
| `toString()` / `String()` | String representation | ✓ |

## Complete Migration Example

### Original Go Code

```go
package main

import (
    "fmt"
    "os"
    "github.com/muesli/termenv"
)

func main() {
    // Create output with TrueColor profile
    out := termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
    
    // Create styled text
    title := out.String("My Application")
        .Foreground(out.Color("#FF6B35"))
        .Bold()
        .Underline()
    
    status := out.String("Running")
        .Foreground(termenv.ANSIBrightGreen)
        .Background(termenv.ANSIBlack)
    
    // Terminal control
    termenv.ClearScreen()
    termenv.MoveCursor(1, 1)
    
    // Output
    fmt.Println(title)
    fmt.Printf("Status: %s\n", status)
    
    // Hyperlink
    out.Hyperlink("https://example.com", "Visit our site")
    
    // Notification
    out.Notify("App Started", "Application is now running")
}
```

### TypeScript Modern API

```typescript
import { 
  newOutput, withProfile, Profile, string, 
  clearScreen, moveCursor, ANSIBrightGreen, ANSIBlack 
} from '@tsports/termenv';

// Create output with TrueColor profile  
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Create styled text
const title = out.string('My Application')
  .foreground(out.color('#FF6B35'))
  .bold()
  .underline();

const status = out.string('Running')
  .foreground(ANSIBrightGreen)
  .background(ANSIBlack);

// Terminal control
clearScreen();
moveCursor(1, 1);

// Output
console.log(title.toString());
console.log(`Status: ${status.toString()}`);

// Hyperlink
out.hyperlink('https://example.com', 'Visit our site');

// Notification  
out.notify('App Started', 'Application is now running');
```

### TypeScript Go-Compatible API

```typescript
import { 
  NewOutput, WithProfile, Profile, String,
  ClearScreen, MoveCursor, ANSIBrightGreen, ANSIBlack 
} from '@tsports/termenv/go-style';

// Create output with TrueColor profile
const out = NewOutput(process.stdout, WithProfile(Profile.TrueColor));

// Create styled text  
const title = out.String('My Application')
  .Foreground(out.Color('#FF6B35'))
  .Bold()
  .Underline();

const status = out.String('Running')
  .Foreground(ANSIBrightGreen)
  .Background(ANSIBlack);

// Terminal control
ClearScreen();
MoveCursor(1, 1);

// Output
console.log(title.String());
console.log(`Status: ${status.String()}`);

// Hyperlink
out.Hyperlink('https://example.com', 'Visit our site');

// Notification
out.Notify('App Started', 'Application is now running');
```

## Key Differences Summary

1. **Import syntax**: Go uses single import, TypeScript uses named imports
2. **Method naming**: Go uses PascalCase, TypeScript modern uses camelCase 
3. **Output**: Go uses `fmt.Print()`, TypeScript uses `console.log()` with `.toString()`
4. **File handle**: Go uses `os.Stdout`, TypeScript uses `process.stdout`
5. **String conversion**: Go implicit, TypeScript requires `.toString()` or `.String()`

Both TypeScript APIs maintain 100% functional compatibility with the original Go implementation while providing idiomatic TypeScript patterns.
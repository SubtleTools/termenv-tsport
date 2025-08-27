# Migration Guide: Go termenv to TypeScript

This guide helps developers migrate from the original Go [termenv](https://github.com/muesli/termenv) package to our TypeScript port `@tsports/termenv`.

## Overview of Changes

Our TypeScript port maintains **100% API compatibility** with the original Go package while providing two distinct APIs:

1. **Go-Compatible API** - Exact same function names and patterns as Go
2. **Modern TypeScript API** - Idiomatic TypeScript with camelCase naming

## Installation Migration

### Go (Original)
```bash
go get github.com/muesli/termenv
```

### TypeScript (Our Port)
```bash
bun add @tsports/termenv
# or
npm install @tsports/termenv
```

## Import Migration

### Go Import Pattern
```go
import "github.com/muesli/termenv"
```

### TypeScript Import Options

**Option 1: Modern TypeScript API (Recommended)**
```typescript
import { 
  string, colorProfile, rgbColor, ansiColor,
  clearScreen, moveCursor, newOutput 
} from '@tsports/termenv';
```

**Option 2: Go-Compatible API (Easiest Migration)**
```typescript
import { 
  String, ColorProfile, RGBColor, ANSIColor,
  ClearScreen, MoveCursor, NewOutput 
} from '@tsports/termenv/go-style';
```

## Basic Usage Migration

### Simple Text Styling

#### Go Version
```go
package main

import (
    "fmt"
    "github.com/muesli/termenv"
)

func main() {
    s := termenv.String("Hello World")
    s.Foreground(termenv.RGBColor("#FF0000"))
    s.Bold()
    fmt.Print(s)
}
```

#### TypeScript - Go-Compatible API
```typescript
import { String, RGBColor } from '@tsports/termenv/go-style';

const s = String('Hello World')
  .Foreground(RGBColor('#FF0000'))
  .Bold();
console.log(s.String());
```

#### TypeScript - Modern API
```typescript
import { string, rgbColor } from '@tsports/termenv';

const s = string('Hello World')
  .foreground(rgbColor('#FF0000'))
  .bold();
console.log(s.toString());
```

### Color Profile Detection

#### Go Version
```go
profile := termenv.ColorProfile()
fmt.Printf("Terminal supports: %s\n", profile)

isDark := termenv.HasDarkBackground()
```

#### TypeScript Migration
```typescript
// Go-Compatible API
import { ColorProfile, HasDarkBackground } from '@tsports/termenv/go-style';
const profile = ColorProfile();
console.log(`Terminal supports: ${profile}`);
const isDark = HasDarkBackground();

// Modern TypeScript API  
import { colorProfile, hasDarkBackground, profileName } from '@tsports/termenv';
const profile = colorProfile();
console.log(`Terminal supports: ${profileName(profile)}`);
const isDark = hasDarkBackground();
```

## Advanced Usage Migration

### Using Output Instances

#### Go Version
```go
out := termenv.NewOutput(os.Stdout)
s := out.String("Hello")
s.Foreground(out.Color("#abcdef"))
fmt.Print(s)
```

#### TypeScript Migration
```typescript
// Go-Compatible API
import { NewOutput } from '@tsports/termenv/go-style';
const out = NewOutput(process.stdout);
const s = out.String('Hello')
  .Foreground(out.Color('#abcdef'));
console.log(s.String());

// Modern TypeScript API
import { newOutput } from '@tsports/termenv';
const out = newOutput(process.stdout);
const s = out.string('Hello')
  .foreground(out.color('#abcdef'));
console.log(s.toString());
```

### Profile Configuration

#### Go Version
```go
out := termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
```

#### TypeScript Migration
```typescript
// Go-Compatible API
import { NewOutput, WithProfile, Profile } from '@tsports/termenv/go-style';
const out = NewOutput(process.stdout, WithProfile(Profile.TrueColor));

// Modern TypeScript API
import { newOutput, withProfile, Profile } from '@tsports/termenv';
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));
```

## Screen Control Migration

### Terminal Control Functions

#### Go Version
```go
termenv.ClearScreen()
termenv.MoveCursor(10, 5)
termenv.HideCursor()
termenv.ShowCursor()
termenv.AltScreen()
termenv.ExitAltScreen()
```

#### TypeScript Migration
```typescript
// Go-Compatible API
import { 
  ClearScreen, MoveCursor, HideCursor, ShowCursor,
  AltScreen, ExitAltScreen 
} from '@tsports/termenv/go-style';

ClearScreen();
MoveCursor(10, 5);
HideCursor();
ShowCursor();
AltScreen();
ExitAltScreen();

// Modern TypeScript API
import { 
  clearScreen, moveCursor, hideCursor, showCursor,
  altScreen, exitAltScreen 
} from '@tsports/termenv';

clearScreen();
moveCursor(10, 5);
hideCursor();
showCursor();
altScreen();
exitAltScreen();
```

## Complete Example Migration

### Original Go Application

```go
package main

import (
    "fmt"
    "os"
    "time"
    "github.com/muesli/termenv"
)

func main() {
    // Setup
    out := termenv.NewOutput(os.Stdout, termenv.WithProfile(termenv.TrueColor))
    
    // Clear screen and hide cursor
    termenv.ClearScreen()
    termenv.HideCursor()
    defer termenv.ShowCursor()
    
    // Create styled text
    title := out.String("My Terminal App")
        .Foreground(out.Color("#FF6B35"))
        .Bold()
        .Underline()
    
    status := out.String("Running")
        .Foreground(termenv.ANSIBrightGreen)
        .Background(termenv.ANSIBlack)
    
    // Position and display
    termenv.MoveCursor(1, 1)
    fmt.Println(title)
    fmt.Printf("Status: %s\n", status)
    
    // Progress simulation
    for i := 0; i <= 100; i += 10 {
        termenv.MoveCursor(3, 1)
        progress := out.String(fmt.Sprintf("Progress: %d%%", i))
            .Foreground(out.Color("#71BEF2"))
        fmt.Print(progress)
        time.Sleep(time.Millisecond * 200)
    }
    
    // Hyperlink and notification
    out.Hyperlink("https://example.com", "Visit our site")
    out.Notify("App Complete", "Application finished successfully")
}
```

### TypeScript Migration - Go-Compatible API

```typescript
import { 
  NewOutput, WithProfile, Profile, String,
  ClearScreen, HideCursor, ShowCursor, MoveCursor,
  ANSIBrightGreen, ANSIBlack
} from '@tsports/termenv/go-style';

async function main() {
  // Setup
  const out = NewOutput(process.stdout, WithProfile(Profile.TrueColor));
  
  // Clear screen and hide cursor
  ClearScreen();
  HideCursor();
  process.on('exit', () => ShowCursor());
  
  // Create styled text
  const title = out.String('My Terminal App')
    .Foreground(out.Color('#FF6B35'))
    .Bold()
    .Underline();
  
  const status = out.String('Running')
    .Foreground(ANSIBrightGreen)
    .Background(ANSIBlack);
  
  // Position and display
  MoveCursor(1, 1);
  console.log(title.String());
  console.log(`Status: ${status.String()}`);
  
  // Progress simulation
  for (let i = 0; i <= 100; i += 10) {
    MoveCursor(3, 1);
    const progress = out.String(`Progress: ${i}%`)
      .Foreground(out.Color('#71BEF2'));
    process.stdout.write(progress.String());
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Hyperlink and notification
  out.Hyperlink('https://example.com', 'Visit our site');
  out.Notify('App Complete', 'Application finished successfully');
}

await main();
```

### TypeScript Migration - Modern API

```typescript
import { 
  newOutput, withProfile, Profile, string,
  clearScreen, hideCursor, showCursor, moveCursor,
  ANSIBrightGreen, ANSIBlack
} from '@tsports/termenv';

async function main() {
  // Setup
  const out = newOutput(process.stdout, withProfile(Profile.TrueColor));
  
  // Clear screen and hide cursor
  clearScreen();
  hideCursor();
  process.on('exit', () => showCursor());
  
  // Create styled text
  const title = out.string('My Terminal App')
    .foreground(out.color('#FF6B35'))
    .bold()
    .underline();
  
  const status = out.string('Running')
    .foreground(ANSIBrightGreen)
    .background(ANSIBlack);
  
  // Position and display
  moveCursor(1, 1);
  console.log(title.toString());
  console.log(`Status: ${status.toString()}`);
  
  // Progress simulation
  for (let i = 0; i <= 100; i += 10) {
    moveCursor(3, 1);
    const progress = out.string(`Progress: ${i}%`)
      .foreground(out.color('#71BEF2'));
    process.stdout.write(progress.toString());
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Hyperlink and notification
  out.hyperlink('https://example.com', 'Visit our site');
  out.notify('App Complete', 'Application finished successfully');
}

await main();
```

## Key Differences Summary

| Aspect | Go | TypeScript Go-API | TypeScript Modern |
|--------|----|--------------------|-------------------|
| **Import** | `import "github.com/muesli/termenv"` | `import { ... } from '@tsports/termenv/go-style'` | `import { ... } from '@tsports/termenv'` |
| **Function Names** | `PascalCase` | `PascalCase` | `camelCase` |
| **String Conversion** | Implicit `fmt.Print(s)` | `s.String()` | `s.toString()` |
| **Output Stream** | `os.Stdout` | `process.stdout` | `process.stdout` |
| **Sleep/Delay** | `time.Sleep()` | `setTimeout()` | `setTimeout()` |
| **Error Handling** | Go idioms | JavaScript/TypeScript patterns | JavaScript/TypeScript patterns |

## Migration Steps Checklist

### Phase 1: Basic Migration
- [ ] Replace Go imports with TypeScript imports
- [ ] Change `fmt.Print()` to `console.log()` 
- [ ] Replace `os.Stdout` with `process.stdout`
- [ ] Add `.String()` or `.toString()` to styled text output

### Phase 2: Choose API Style
- [ ] **Option A**: Use Go-Compatible API for minimal changes
- [ ] **Option B**: Migrate to Modern TypeScript API for better TypeScript integration

### Phase 3: Language-Specific Updates
- [ ] Replace `time.Sleep()` with `setTimeout()` or `await` patterns
- [ ] Update error handling from Go patterns to JavaScript/TypeScript
- [ ] Replace Go string formatting with template literals
- [ ] Update loop patterns if needed

### Phase 4: Testing and Optimization
- [ ] Test color output across different terminals
- [ ] Verify all terminal control functions work
- [ ] Add TypeScript type annotations if using Modern API
- [ ] Update build and deployment scripts

## Common Migration Patterns

### 1. String Formatting Migration

```go
// Go
message := fmt.Sprintf("Processing %d of %d items", current, total)
```

```typescript
// TypeScript
const message = `Processing ${current} of ${total} items`;
```

### 2. Loop Pattern Migration

```go
// Go
for i := 0; i < 10; i++ {
    // work
    time.Sleep(time.Millisecond * 100)
}
```

```typescript
// TypeScript
for (let i = 0; i < 10; i++) {
  // work
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### 3. Error Handling Migration

```go
// Go
if err != nil {
    fmt.Printf("Error: %v\n", err)
    return
}
```

```typescript
// TypeScript
try {
  // operation
} catch (error) {
  console.error(`Error: ${error}`);
  return;
}
```

### 4. Cleanup Pattern Migration

```go
// Go
defer termenv.ShowCursor()
defer termenv.ExitAltScreen()
```

```typescript
// TypeScript
process.on('exit', () => {
  showCursor();
  exitAltScreen();
});

// Or using try/finally
try {
  // main logic
} finally {
  showCursor();
  exitAltScreen();
}
```

## Environment Variables

Both Go and TypeScript versions respect the same environment variables:

| Variable | Effect |
|----------|---------|
| `NO_COLOR` | Disable color output |
| `CLICOLOR=0` | Disable color output |
| `CLICOLOR_FORCE=1` | Force color output |
| `COLORTERM=truecolor` | Enable TrueColor |
| `TERM` | Terminal type detection |
| `CI=true` | CI environment detection |

## Performance Considerations

The TypeScript port includes several optimizations:

- **Color caching** - Similar to Go version
- **Lazy evaluation** - ANSI sequences generated only when needed
- **Profile-aware conversions** - Only convert when necessary

Performance is comparable to the Go version for most use cases.

## Troubleshooting Migration Issues

### Issue: Colors not appearing

```typescript
// Check environment
import { envNoColor, colorProfile, profileName } from '@tsports/termenv';

if (envNoColor()) {
  console.log('Colors disabled by environment');
}
console.log(`Color profile: ${profileName(colorProfile())}`);
```

### Issue: TypeScript compilation errors

Ensure you're importing from the correct module:

```typescript
// ✅ Correct
import { string } from '@tsports/termenv';

// ❌ Incorrect
import { String } from '@tsports/termenv'; // This is in go-style
```

### Issue: Terminal control not working

Verify your terminal supports the features:

```typescript
import { colorProfile, Profile } from '@tsports/termenv';

const profile = colorProfile();
if (profile === Profile.Ascii) {
  console.log('Terminal has limited capabilities');
}
```

## Benefits of Migration

1. **Modern Ecosystem**: Access to Node.js/TypeScript tooling and libraries
2. **Type Safety**: Full TypeScript support with intellisense 
3. **NPM Integration**: Easy dependency management
4. **Cross-Platform**: Works on Windows, macOS, Linux
5. **CI/CD Ready**: Integrates with JavaScript CI/CD pipelines
6. **Performance**: Comparable performance to Go version
7. **Compatibility**: 100% API compatible with original

This migration guide should help you smoothly transition from Go termenv to our TypeScript port while maintaining all functionality and improving development experience.
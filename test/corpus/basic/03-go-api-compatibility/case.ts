// biome-ignore lint/suspicious/noShadowRestrictedNames: Go API compatibility requires this name
import { ANSIColor, RGBColor, String } from '../../../../src/go-style.js';

// Test global convenience functions - using Go-style API exactly
console.log(String('Global Red').Foreground(RGBColor('#FF0000')).String());
console.log(String('Global Blue').Bold().Foreground(RGBColor('#0000FF')).String());

// Test ANSI colors
console.log(String('ANSI Red').Foreground(ANSIColor(1)).String());
console.log(String('ANSI Blue').Foreground(ANSIColor(4)).String());

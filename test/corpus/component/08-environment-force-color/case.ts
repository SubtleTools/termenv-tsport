import {
  ANSI256Color,
  ANSIColor,
  ColorProfile,
  EnvColorProfile,
  EnvNoColor,
  NewOutput,
  RGBColor,
} from '../../../../src/go-style.js';

console.log('--- Environment Detection: FORCE_COLOR Test ---');

// Create output with default settings
const out = NewOutput(process.stdout);

// Test color profile detection with FORCE_COLOR
const profile = ColorProfile();
console.log(`ColorProfile(): ${profile}`);

// Test environment-based color profile
const envProfile = EnvColorProfile();
console.log(`EnvColorProfile(): ${envProfile}`);

// Test EnvNoColor (should be false with FORCE_COLOR)
const noColor = EnvNoColor();
console.log(`EnvNoColor(): ${noColor}`);

// Test color rendering with FORCE_COLOR set
const red = out.String('Red Text').Foreground(RGBColor('#FF0000'));
const blue = out.String('Blue Text').Foreground(RGBColor('#0000FF'));
const green = out.String('Green Text').Foreground(RGBColor('#00FF00'));

console.log(`Red Text: ${red.String()}`);
console.log(`Blue Text: ${blue.String()}`);
console.log(`Green Text: ${green.String()}`);

// Test with ANSI colors
const ansiRed = out.String('ANSI Red').Foreground(ANSIColor(1));
const ansiBlue = out.String('ANSI Blue').Foreground(ANSIColor(4));

console.log(`ANSI Red: ${ansiRed.String()}`);
console.log(`ANSI Blue: ${ansiBlue.String()}`);

// Test with ANSI256 colors
const ansi256Red = out.String('ANSI256 Red').Foreground(ANSI256Color(196));
const ansi256Blue = out.String('ANSI256 Blue').Foreground(ANSI256Color(21));

console.log(`ANSI256 Red: ${ansi256Red.String()}`);
console.log(`ANSI256 Blue: ${ansi256Blue.String()}`);

// Test styling
const bold = out.String('Bold Text').Bold();
const italic = out.String('Italic Text').Italic();

console.log(`Bold Text: ${bold.String()}`);
console.log(`Italic Text: ${italic.String()}`);

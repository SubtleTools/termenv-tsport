import {
  ANSIColor,
  ColorProfile,
  EnvColorProfile,
  EnvNoColor,
  NewOutput,
  RGBColor,
} from '../../../../src/go-style.js';

console.log('--- Environment Detection: CLICOLOR Test ---');

// Create output with default settings
const out = NewOutput(process.stdout);

// Test color profile detection with CLICOLOR
const profile = ColorProfile();
console.log(`ColorProfile(): ${profile}`);

// Test environment-based color profile
const envProfile = EnvColorProfile();
console.log(`EnvColorProfile(): ${envProfile}`);

// Test envNoColor with CLICOLOR
const noColor = EnvNoColor();
console.log(`EnvNoColor(): ${noColor}`);

// Test color rendering with CLICOLOR=0 (should disable colors)
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

// Test styling (should also be disabled)
const bold = out.String('Bold Text').Bold();
const italic = out.String('Italic Text').Italic();
const underline = out.String('Underlined Text').Underline();

console.log(`Bold Text: ${bold.String()}`);
console.log(`Italic Text: ${italic.String()}`);
console.log(`Underlined Text: ${underline.String()}`);

// Test background colors
const bgRed = out.String('Background Red').Background(RGBColor('#FF0000'));
console.log(`Background Red: ${bgRed.String()}`);

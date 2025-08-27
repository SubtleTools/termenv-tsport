import {
  ANSI256Color,
  ANSIColor,
  EnvColorProfile,
  EnvNoColor,
  NewOutput,
  RGBColor,
} from '../../../../src/go-style.js';

console.log('--- Environment Detection: NO_COLOR Test ---');

// Create output with default settings
const out = NewOutput(process.stdout);

// Test EnvNoColor function
const noColor = EnvNoColor();
console.log(`EnvNoColor(): ${noColor}`);

// Test EnvColorProfile function
const envProfile = EnvColorProfile();
console.log(`EnvColorProfile(): ${envProfile}`);

// Test color rendering with NO_COLOR set
const red = out.String('Red Text').Foreground(RGBColor('#FF0000'));
const blue = out.String('Blue Text').Foreground(RGBColor('#0000FF'));
const bold = out.String('Bold Text').Bold();

console.log(`Red Text: ${red.String()}`);
console.log(`Blue Text: ${blue.String()}`);
console.log(`Bold Text: ${bold.String()}`);

// Test with different color types
const ansiRed = out.String('ANSI Red').Foreground(ANSIColor(1));
const ansi256Red = out.String('ANSI256 Red').Foreground(ANSI256Color(196));

console.log(`ANSI Red: ${ansiRed.String()}`);
console.log(`ANSI256 Red: ${ansi256Red.String()}`);

// Test background colors
const bgRed = out.String('Background Red').Background(RGBColor('#FF0000'));
console.log(`Background Red: ${bgRed.String()}`);

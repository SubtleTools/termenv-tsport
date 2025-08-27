import {
  ansi256Color,
  ansiColor,
  newOutput,
  Profile,
  rgbColor,
  withProfile,
} from '../../../../src/index.js';

// Force Ascii profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.Ascii));

// Test NoColor with various color attempts
console.log('--- NoColor Tests (ASCII Profile) ---');

// Test with RGB colors - should render as plain text
const red = out.string('Red Text').foreground(rgbColor('#FF0000'));
const blue = out.string('Blue Text').foreground(rgbColor('#0000FF'));
const green = out.string('Green Text').foreground(rgbColor('#00FF00'));

console.log(`RGB Red: ${red.toString()}`);
console.log(`RGB Blue: ${blue.toString()}`);
console.log(`RGB Green: ${green.toString()}`);

// Test with ANSI colors - should render as plain text
const ansiRed = out.string('ANSI Red').foreground(ansiColor(1));
const ansiBlue = out.string('ANSI Blue').foreground(ansiColor(4));

console.log(`ANSI Red: ${ansiRed.toString()}`);
console.log(`ANSI Blue: ${ansiBlue.toString()}`);

// Test with ANSI256 colors - should render as plain text
const ansi256Red = out.string('ANSI256 Red').foreground(ansi256Color(196));
const ansi256Blue = out.string('ANSI256 Blue').foreground(ansi256Color(21));

console.log(`ANSI256 Red: ${ansi256Red.toString()}`);
console.log(`ANSI256 Blue: ${ansi256Blue.toString()}`);

// Test styling - should also render as plain text
const bold = out.string('Bold Text').bold();
const italic = out.string('Italic Text').italic();
const underline = out.string('Underlined Text').underline();

console.log(`Bold: ${bold.toString()}`);
console.log(`Italic: ${italic.toString()}`);
console.log(`Underline: ${underline.toString()}`);

// Test background colors - should render as plain text
const bgRed = out.string('Background Red').background(rgbColor('#FF0000'));

console.log(`Background: ${bgRed.toString()}`);

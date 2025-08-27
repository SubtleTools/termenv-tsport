import {
  ansi256Color,
  ansiColor,
  newOutput,
  Profile,
  rgbColor,
  withProfile,
} from '../../../../src/index.js';

console.log('--- Profile Types Test ---');

// Test Ascii profile
const asciiOut = newOutput(process.stdout, withProfile(Profile.Ascii));
const asciiStyled = asciiOut.string('Ascii Profile Text').bold().foreground(rgbColor('#FF0000'));
console.log(`Ascii Profile: ${asciiStyled.toString()}`);

// Test ANSI profile
const ansiOut = newOutput(process.stdout, withProfile(Profile.ANSI));
const ansiStyled = ansiOut.string('ANSI Profile Text').bold().foreground(ansiColor(1));
console.log(`ANSI Profile: ${ansiStyled.toString()}`);

// Test ANSI256 profile
const ansi256Out = newOutput(process.stdout, withProfile(Profile.ANSI256));
const ansi256Styled = ansi256Out
  .string('ANSI256 Profile Text')
  .bold()
  .foreground(ansi256Color(196));
console.log(`ANSI256 Profile: ${ansi256Styled.toString()}`);

// Test TrueColor profile
const trueColorOut = newOutput(process.stdout, withProfile(Profile.TrueColor));
const trueColorStyled = trueColorOut
  .string('TrueColor Profile Text')
  .bold()
  .foreground(rgbColor('#FF0000'));
console.log(`TrueColor Profile: ${trueColorStyled.toString()}`);

// Test color conversion across profiles
console.log('\n--- Color Conversion Test ---');

// RGB color in different profiles
const rgbColorValue = rgbColor('#FF6600');

const asciiRgb = asciiOut.string('RGB in Ascii').foreground(rgbColorValue);
const ansiRgb = ansiOut.string('RGB in ANSI').foreground(rgbColorValue);
const ansi256Rgb = ansi256Out.string('RGB in ANSI256').foreground(rgbColorValue);
const trueColorRgb = trueColorOut.string('RGB in TrueColor').foreground(rgbColorValue);

console.log(`RGB #FF6600 in Ascii: ${asciiRgb.toString()}`);
console.log(`RGB #FF6600 in ANSI: ${ansiRgb.toString()}`);
console.log(`RGB #FF6600 in ANSI256: ${ansi256Rgb.toString()}`);
console.log(`RGB #FF6600 in TrueColor: ${trueColorRgb.toString()}`);

// ANSI256 color in different profiles
const ansi256ColorValue = ansi256Color(214);

const asciiAnsi256 = asciiOut.string('ANSI256 in Ascii').foreground(ansi256ColorValue);
const ansiAnsi256 = ansiOut.string('ANSI256 in ANSI').foreground(ansi256ColorValue);
const ansi256Ansi256 = ansi256Out.string('ANSI256 in ANSI256').foreground(ansi256ColorValue);
const trueColorAnsi256 = trueColorOut.string('ANSI256 in TrueColor').foreground(ansi256ColorValue);

console.log(`ANSI256 214 in Ascii: ${asciiAnsi256.toString()}`);
console.log(`ANSI256 214 in ANSI: ${ansiAnsi256.toString()}`);
console.log(`ANSI256 214 in ANSI256: ${ansi256Ansi256.toString()}`);
console.log(`ANSI256 214 in TrueColor: ${trueColorAnsi256.toString()}`);

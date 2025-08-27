import { ansi256Color, newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

console.log('--- Color Conversion Edge Cases Test ---');

// Test color conversion between different profiles
const asciiOut = newOutput(process.stdout, withProfile(Profile.Ascii));
const ansiOut = newOutput(process.stdout, withProfile(Profile.ANSI));
const ansi256Out = newOutput(process.stdout, withProfile(Profile.ANSI256));
const trueColorOut = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Test edge case hex colors
const edgeColors = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Pure Red
  '#00FF00', // Pure Green
  '#0000FF', // Pure Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#808080', // Gray
  '#FF8000', // Orange
  '#8000FF', // Purple
  '#000080', // Navy
  '#008000', // Dark Green
  '#800000', // Maroon
];

for (const hexColor of edgeColors) {
  const color = rgbColor(hexColor);

  const asciiResult = asciiOut.string(hexColor).foreground(color);
  const ansiResult = ansiOut.string(hexColor).foreground(color);
  const ansi256Result = ansi256Out.string(hexColor).foreground(color);
  const trueColorResult = trueColorOut.string(hexColor).foreground(color);

  console.log(`${hexColor} -> Ascii: ${asciiResult.toString()}`);
  console.log(`${hexColor} -> ANSI: ${ansiResult.toString()}`);
  console.log(`${hexColor} -> ANSI256: ${ansi256Result.toString()}`);
  console.log(`${hexColor} -> TrueColor: ${trueColorResult.toString()}`);
  console.log();
}

// Test ANSI256 to ANSI conversion edge cases
console.log('--- ANSI256 to ANSI Conversion ---');
const edgeAnsi256Colors = [0, 1, 7, 8, 15, 16, 231, 232, 255];

for (const ansi256Value of edgeAnsi256Colors) {
  const color = ansi256Color(ansi256Value);

  const ansiResult = ansiOut.string(`ANSI256 ${ansi256Value}`).foreground(color);
  const ansi256Result = ansi256Out.string(`ANSI256 ${ansi256Value}`).foreground(color);

  console.log(`ANSI256 ${ansi256Value} -> ANSI: ${ansiResult.toString()}`);
  console.log(`ANSI256 ${ansi256Value} -> ANSI256: ${ansi256Result.toString()}`);
  console.log();
}

// Test very close colors
console.log('--- Close Colors Test ---');
const closeColors = [
  '#FF0000',
  '#FF0001',
  '#FF0100',
  '#FF1000',
  '#000000',
  '#010101',
  '#020202',
  '#0F0F0F',
  '#FFFFFF',
  '#FEFEFE',
  '#FDFDFD',
  '#F0F0F0',
];

for (const hexColor of closeColors) {
  const color = rgbColor(hexColor);
  const ansiResult = ansiOut.string(hexColor).foreground(color);
  console.log(`${hexColor} -> ANSI: ${ansiResult.toString()}`);
}

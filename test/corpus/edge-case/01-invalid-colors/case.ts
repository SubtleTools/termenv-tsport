import {
  ansi256Color,
  ansiColor,
  newOutput,
  noColor,
  Profile,
  rgbColor,
  withProfile,
} from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

console.log('--- Invalid Colors Edge Case Test ---');

// Test invalid hex colors
const invalidHexColors = ['invalid', '#ZZZZZZ', '#12345', '#1234567', '', ' ', '#'];

for (const invalidHex of invalidHexColors) {
  const color = rgbColor(invalidHex);
  const styled = out.string(`Invalid hex '${invalidHex}'`).foreground(color);
  console.log(`Invalid hex '${invalidHex}': ${styled.toString()}`);
}

// Test out-of-range ANSI colors
const invalidAnsiColors = [-1, 16, 256, 999];

for (const invalidAnsi of invalidAnsiColors) {
  const color = ansiColor(invalidAnsi);
  const styled = out.string(`Invalid ANSI ${invalidAnsi}`).foreground(color);
  console.log(`Invalid ANSI ${invalidAnsi}: ${styled.toString()}`);
}

// Test out-of-range ANSI256 colors
const invalidAnsi256Colors = [-1, 256, 300, 999];

for (const invalidAnsi256 of invalidAnsi256Colors) {
  const color = ansi256Color(invalidAnsi256);
  const styled = out.string(`Invalid ANSI256 ${invalidAnsi256}`).foreground(color);
  console.log(`Invalid ANSI256 ${invalidAnsi256}: ${styled.toString()}`);
}

// Test empty string styling
const emptyStyled = out.string('').bold().foreground(rgbColor('#FF0000'));
console.log(`Empty string styled: '${emptyStyled.toString()}'`);

// Test whitespace-only strings
const whitespaceStyled = out.string('   ').bold().foreground(rgbColor('#00FF00'));
console.log(`Whitespace styled: '${whitespaceStyled.toString()}'`);

// Test null color (NoColor equivalent)
const color = noColor();
const noColorStyled = out.string('NoColor test').foreground(color);
console.log(`NoColor styled: ${noColorStyled.toString()}`);

// Test chaining with invalid colors
const chainedInvalid = out
  .string('Chained with invalid')
  .bold()
  .foreground(rgbColor('#INVALID'))
  .background(ansi256Color(-5))
  .italic();

console.log(`Chained with invalid: ${chainedInvalid.toString()}`);

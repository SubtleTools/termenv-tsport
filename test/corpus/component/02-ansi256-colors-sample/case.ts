import { ansi256Color, newOutput, Profile, withProfile } from '../../../../src/index.js';

// Force ANSI256 profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.ANSI256));

// Test representative ANSI256 colors (16-255)
// Test standard 216 color cube samples
const sampleColors = [
  16, 21, 27, 33, 39, 45, 51, 57, 63, 69, 75, 81, 87, 93, 99, 105, 111, 117, 123, 129, 135, 141,
  147, 153, 159, 165, 171, 177, 183, 189, 195, 201, 207, 213, 219, 225, 231,
];

console.log('--- ANSI256 Color Cube Samples ---');
for (const colorValue of sampleColors) {
  const color = ansi256Color(colorValue);
  const styled = out.string(`ANSI256 Color ${colorValue}`).foreground(color);
  console.log(styled.toString());
}

// Test grayscale colors (232-255)
console.log('\n--- Grayscale Colors ---');
for (let i = 232; i <= 255; i++) {
  const color = ansi256Color(i);
  const styled = out.string(`Gray ${i}`).foreground(color);
  console.log(styled.toString());
}

// Test background colors
console.log('\n--- Background Colors ---');
for (const colorValue of [196, 46, 21, 33]) {
  const color = ansi256Color(colorValue);
  const styled = out.string(`BG ${colorValue}`).background(color);
  console.log(styled.toString());
}

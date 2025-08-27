import { newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Test basic RGB colors
const basicColors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF',
  '#FFFFFF',
  '#000000',
];
const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan', 'White', 'Black'];

console.log('--- Basic RGB Colors ---');
for (let i = 0; i < basicColors.length; i++) {
  const hex = basicColors[i]!;
  const name = colorNames[i]!;
  const color = rgbColor(hex);
  const styled = out.string(name).foreground(color);
  console.log(`${styled.toString()} (${hex})`);
}

// Test RGB color variations
console.log('\n--- RGB Color Variations ---');
const variations = [
  '#FF8080',
  '#80FF80',
  '#8080FF',
  '#FFFF80',
  '#FF80FF',
  '#80FFFF',
  '#808080',
  '#C0C0C0',
];

for (const hex of variations) {
  const color = rgbColor(hex);
  const styled = out.string(`Color ${hex}`).foreground(color);
  console.log(styled.toString());
}

// Test 3-digit hex colors
console.log('\n--- 3-Digit Hex Colors ---');
const shortHex = ['#F00', '#0F0', '#00F', '#FF0', '#F0F', '#0FF', '#FFF', '#000'];

for (const hex of shortHex) {
  const color = rgbColor(hex);
  const styled = out.string(`Short ${hex}`).foreground(color);
  console.log(styled.toString());
}

// Test background colors
console.log('\n--- Background RGB Colors ---');
const bgColors = ['#FF0000', '#00FF00', '#0000FF', '#808080'];

for (const hex of bgColors) {
  const color = rgbColor(hex);
  const styled = out.string(`BG ${hex}`).background(color);
  console.log(styled.toString());
}

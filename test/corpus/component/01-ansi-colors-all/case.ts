import { ansiColor, newOutput, Profile, withProfile } from '../../../../src/index.js';

// Force ANSI profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.ANSI));

// Test all 16 ANSI colors (0-15)
for (let i = 0; i <= 15; i++) {
  const color = ansiColor(i);
  const styled = out.string(`ANSI Color ${i}`).foreground(color);
  console.log(styled.toString());
}

// Test ANSI colors as background
console.log('\n--- Background Colors ---');
for (let i = 0; i <= 7; i++) {
  // Only test first 8 colors for background
  const color = ansiColor(i);
  const styled = out.string(`BG ${i}`).background(color);
  console.log(styled.toString());
}

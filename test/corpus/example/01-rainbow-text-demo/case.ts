import { newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

// Force TrueColor profile for best results
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

console.log('--- Rainbow Text Demo ---');

// Rainbow colors
const colors = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
];

const text = 'RAINBOW';

// Create rainbow text
let rainbow = '';
for (let i = 0; i < text.length; i++) {
  const char = text[i]!;
  const color = rgbColor(colors[i % colors.length]!);
  const styled = out.string(char).bold().foreground(color);
  rainbow += styled.toString();
}

console.log(`Rainbow Text: ${rainbow}`);

// Rainbow with gradient background
console.log('\n--- Rainbow with Background ---');
let rainbowBg = '';
for (let i = 0; i < text.length; i++) {
  const char = text[i]!;
  const fgColor = rgbColor(colors[i % colors.length]!);
  const bgColor = rgbColor('#000080'); // Navy background
  const styled = out.string(char).bold().foreground(fgColor).background(bgColor);
  rainbowBg += styled.toString();
}

console.log(`Rainbow with BG: ${rainbowBg}`);

// Different styles for each letter
console.log('\n--- Varied Styles ---');
const styles = [
  (s: any) => s.bold(),
  (s: any) => s.italic(),
  (s: any) => s.underline(),
  (s: any) => s.overline(),
  (s: any) => s.reverse(),
  (s: any) => s.blink(),
  (s: any) => s.crossOut(),
];

let variedStyles = '';
for (let i = 0; i < text.length; i++) {
  const char = text[i]!;
  const color = rgbColor(colors[i % colors.length]!);
  let styled = out.string(char).foreground(color);
  styled = styles[i % styles.length]?.(styled);
  variedStyles += styled.toString();
}

console.log(`Varied Styles: ${variedStyles}`);

// Create a border
console.log('\n--- Border Demo ---');
const border = out.string('═══════════════════').bold().foreground(rgbColor('#00FFFF'));
console.log(border.toString());

const centeredText = out
  .string('  TERMENV DEMO  ')
  .bold()
  .foreground(rgbColor('#FFFFFF'))
  .background(rgbColor('#FF0080'));
console.log(centeredText.toString());

console.log(border.toString());

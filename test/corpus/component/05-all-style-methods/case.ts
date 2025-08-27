import { newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

console.log('--- All Style Methods Test ---');

// Test basic text styling methods
const bold = out.string('Bold Text').bold();
const faint = out.string('Faint Text').faint();
const italic = out.string('Italic Text').italic();
const underline = out.string('Underlined Text').underline();
const overline = out.string('Overlined Text').overline();

console.log(`Bold: ${bold.toString()}`);
console.log(`Faint: ${faint.toString()}`);
console.log(`Italic: ${italic.toString()}`);
console.log(`Underline: ${underline.toString()}`);
console.log(`Overline: ${overline.toString()}`);

// Test special effects
const blink = out.string('Blinking Text').blink();
const reverse = out.string('Reversed Text').reverse();
const crossOut = out.string('Crossed Out Text').crossOut();

console.log(`Blink: ${blink.toString()}`);
console.log(`Reverse: ${reverse.toString()}`);
console.log(`CrossOut: ${crossOut.toString()}`);

// Test color combinations with styles
const styledColor = out.string('Bold Red Text').bold().foreground(rgbColor('#FF0000'));
const styledBg = out.string('Italic Blue Background').italic().background(rgbColor('#0000FF'));

console.log(`Styled Color: ${styledColor.toString()}`);
console.log(`Styled Background: ${styledBg.toString()}`);

// Test complex combinations
const complex = out
  .string('Bold Italic Underlined Red on Blue')
  .bold()
  .italic()
  .underline()
  .foreground(rgbColor('#FF0000'))
  .background(rgbColor('#0000FF'));

console.log(`Complex: ${complex.toString()}`);

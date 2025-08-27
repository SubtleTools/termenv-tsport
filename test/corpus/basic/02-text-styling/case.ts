import { newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Test basic text styling
const bold = out.string('Bold Text').bold();
const italic = out.string('Italic Text').italic();
const underline = out.string('Underlined Text').underline();
const combined = out.string('Bold Italic Red').bold().italic().foreground(rgbColor('#FF0000'));

console.log(bold.toString());
console.log(italic.toString());
console.log(underline.toString());
console.log(combined.toString());

import { newOutput, Profile, rgbColor, withProfile } from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

// Test basic color rendering
const red = out.string('Red Text').foreground(rgbColor('#FF0000'));
const blue = out.string('Blue Text').foreground(rgbColor('#0000FF'));
const green = out.string('Green Text').foreground(rgbColor('#00FF00'));

console.log(red.toString());
console.log(blue.toString());
console.log(green.toString());

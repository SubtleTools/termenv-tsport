import {
  NewOutput,
  Profile,
  RGBColor,
  WithProfile,
  WithTTY,
  WithUnsafe,
} from '../../../../src/go-style.js';

console.log('--- Non-TTY Environment Test ---');

// Test with default output (should detect non-TTY)
const out = NewOutput(process.stdout);

// Test color profile detection in non-TTY
const profile = out.ColorProfile();
console.log(`Non-TTY ColorProfile: ${profile}`);

// Test color rendering in non-TTY environment
const red = out.String('Red Text').Foreground(RGBColor('#FF0000'));
const blue = out.String('Blue Text').Foreground(RGBColor('#0000FF'));
const bold = out.String('Bold Text').Bold();

console.log(`Non-TTY Red: ${red.String()}`);
console.log(`Non-TTY Blue: ${blue.String()}`);
console.log(`Non-TTY Bold: ${bold.String()}`);

// Test with forced TTY
const forcedTTYOut = NewOutput(process.stdout, WithTTY(true));

const forcedProfile = forcedTTYOut.ColorProfile();
console.log(`Forced TTY ColorProfile: ${forcedProfile}`);

const forcedRed = forcedTTYOut.String('Forced TTY Red').Foreground(RGBColor('#FF0000'));
const forcedBlue = forcedTTYOut.String('Forced TTY Blue').Foreground(RGBColor('#0000FF'));
const forcedBold = forcedTTYOut.String('Forced TTY Bold').Bold();

console.log(`Forced TTY Red: ${forcedRed.String()}`);
console.log(`Forced TTY Blue: ${forcedBlue.String()}`);
console.log(`Forced TTY Bold: ${forcedBold.String()}`);

// Test with unsafe mode
const unsafeOut = NewOutput(process.stdout, WithUnsafe());

const unsafeProfile = unsafeOut.ColorProfile();
console.log(`Unsafe ColorProfile: ${unsafeProfile}`);

const unsafeRed = unsafeOut.String('Unsafe Red').Foreground(RGBColor('#FF0000'));
const unsafeBlue = unsafeOut.String('Unsafe Blue').Foreground(RGBColor('#0000FF'));
const unsafeBold = unsafeOut.String('Unsafe Bold').Bold();

console.log(`Unsafe Red: ${unsafeRed.String()}`);
console.log(`Unsafe Blue: ${unsafeBlue.String()}`);
console.log(`Unsafe Bold: ${unsafeBold.String()}`);

// Test various combinations
const combinedOut = NewOutput(process.stdout, WithTTY(false), WithProfile(Profile.TrueColor));

const combinedProfile = combinedOut.ColorProfile();
console.log(`Combined (TTY=false, TrueColor) Profile: ${combinedProfile}`);

const combinedStyled = combinedOut.String('Combined Test').Bold().Foreground(RGBColor('#FF6600'));
console.log(`Combined styled: ${combinedStyled.String()}`);

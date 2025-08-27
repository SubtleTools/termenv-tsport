// biome-ignore lint/suspicious/noShadowRestrictedNames: Go API compatibility requires this name
import {
  ANSI256,
  ANSI256Color,
  ANSIColor,
  ColorProfile,
  EnvColorProfile,
  EnvNoColor,
  HasDarkBackground,
  NewOutput,
  RGBColor,
  String,
  TrueColor,
  WithColorCache,
  WithProfile,
  WithTTY,
  WithUnsafe,
} from '../../../../src/go-style.js';

console.log('--- Go API Full Compatibility Test ---');

// Test global convenience functions (PascalCase)
console.log(`ColorProfile: ${ColorProfile()}`);
console.log(`EnvColorProfile: ${EnvColorProfile()}`);
console.log(`EnvNoColor: ${EnvNoColor()}`);
console.log(`HasDarkBackground: ${HasDarkBackground()}`);

// Test color creation functions
const rgbColor = RGBColor('#FF0000');
const ansiColor = ANSIColor(1);
const ansi256Color = ANSI256Color(196);

console.log(`RGBColor sequence: ${rgbColor.sequence(false)}`);
console.log(`ANSIColor: ${ansiColor.toString()}`);
console.log(`ANSI256Color: ${ansi256Color.toString()}`);

// Test String function (global convenience)
const globalString = String('Global String Test');
console.log(`Global String (plain): ${globalString.toString()}`);

const globalStyled = String('Global Styled').bold().foreground(rgbColor);
console.log(`Global String (styled): ${globalStyled.toString()}`);

// Test NewOutput function
const out = NewOutput(process.stdout, WithProfile(TrueColor));

// Test Output methods
const outputString = out.string('Output String Test');
console.log(`Output String (plain): ${outputString.toString()}`);

const outputStyled = out.string('Output Styled').bold().foreground(out.color('#00FF00')!);
console.log(`Output String (styled): ${outputStyled.toString()}`);

// Test String() method on Style
const style = out.string('Style String Method').bold().foreground(rgbColor);
console.log(`Style.String(): ${style.toString()}`);

// Test all style methods
const allStyles = out
  .string('All Styles')
  .bold()
  .faint()
  .italic()
  .underline()
  .overline()
  .blink()
  .reverse()
  .crossOut()
  .foreground(rgbColor)
  .background(ansi256Color);

console.log(`All Styles: ${allStyles.toString()}`);

// Test color factory through Output.color
const outputRgbColor = out.color('#FF6600')!;
const outputColorStyled = out.string('Output Color').foreground(outputRgbColor);
console.log(`Output Color: ${outputColorStyled.toString()}`);

// Test WithProfile, WithTTY, WithColorCache, WithUnsafe
const configuredOut = NewOutput(
  process.stdout,
  WithProfile(ANSI256),
  WithTTY(true),
  WithColorCache(true),
  WithUnsafe()
);

const configuredStyled = configuredOut
  .string('Configured Output')
  .bold()
  .foreground(ANSI256Color(46));
console.log(`Configured Output: ${configuredStyled.toString()}`);

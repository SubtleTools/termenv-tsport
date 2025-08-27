import {
  BackgroundColor,
  ColorProfile,
  EnvColorProfile,
  type Environ,
  EnvNoColor,
  ForegroundColor,
  HasDarkBackground,
  NewOutput,
  Profile,
  RGBColor,
  WithColorCache,
  WithEnvironment,
  WithProfile,
  WithTTY,
  WithUnsafe,
} from '../../../../src/go-style.js';

class TestEnviron implements Environ {
  private vars: Record<string, string>;

  constructor(vars: Record<string, string>) {
    this.vars = vars;
  }

  getenv(key: string): string {
    return this.vars[key] || '';
  }

  environ(): string[] {
    return Object.entries(this.vars).map(([k, v]) => `${k}=${v}`);
  }
}

console.log('--- Output Methods Comprehensive Test ---');

// Test newOutput factory with various options
console.log('--- NewOutput Factory Tests ---');

// Default output
const defaultOut = NewOutput(process.stdout);
console.log(`Default profile: ${defaultOut.ColorProfile()}`);

// With profile
const profileOut = NewOutput(process.stdout, WithProfile(Profile.TrueColor));
console.log(`TrueColor profile: ${profileOut.ColorProfile()}`);

// With TTY forced
const ttyOut = NewOutput(process.stdout, WithTTY(true));
console.log(`TTY forced profile: ${ttyOut.ColorProfile()}`);

// With color cache
const cacheOut = NewOutput(process.stdout, WithColorCache(true));
console.log(`Cache enabled profile: ${cacheOut.ColorProfile()}`);

// With unsafe mode
const unsafeOut = NewOutput(process.stdout, WithUnsafe());
console.log(`Unsafe mode profile: ${unsafeOut.ColorProfile()}`);

// Test with custom environment
const customEnv = new TestEnviron({
  FORCE_COLOR: '3',
  TERM: 'xterm-256color',
});
const envOut = NewOutput(process.stdout, WithEnvironment(customEnv));
console.log(`Custom env profile: ${envOut.ColorProfile()}`);

// Test combined options
const combinedOut = NewOutput(
  process.stdout,
  WithProfile(Profile.ANSI256),
  WithTTY(true),
  WithColorCache(true),
  WithUnsafe()
);
console.log(`Combined options profile: ${combinedOut.ColorProfile()}`);

// Test global functions
console.log('\n--- Global Functions Tests ---');

console.log(`ColorProfile(): ${ColorProfile()}`);
console.log(`EnvColorProfile(): ${EnvColorProfile()}`);
console.log(`EnvNoColor(): ${EnvNoColor()}`);
console.log(`HasDarkBackground(): ${HasDarkBackground()}`);

// Test color detection functions
const fgColor = ForegroundColor();
const bgColor = BackgroundColor();
console.log(`ForegroundColor sequence: ${fgColor.sequence(false)}`);
console.log(`BackgroundColor sequence: ${bgColor.sequence(false)}`);

// Test output color methods
console.log('\n--- Output Color Methods Tests ---');

const outFgColor = defaultOut.ForegroundColor();
const outBgColor = defaultOut.BackgroundColor();
console.log(`Output ForegroundColor sequence: ${outFgColor.sequence(false)}`);
console.log(`Output BackgroundColor sequence: ${outBgColor.sequence(false)}`);
console.log(`Output HasDarkBackground: ${defaultOut.HasDarkBackground()}`);

// Test output environment methods
console.log(`Output EnvNoColor: ${defaultOut.EnvNoColor()}`);
console.log(`Output EnvColorProfile: ${defaultOut.EnvColorProfile()}`);

// Test color factory method
const colorRed = defaultOut.Color('#FF0000');
const colorBlue = defaultOut.Color('4'); // ANSI color
const colorGreen = defaultOut.Color('46'); // ANSI256 color

const redStyled = defaultOut.String('Red from Color()').Foreground(colorRed!);
const blueStyled = defaultOut.String('Blue from Color()').Foreground(colorBlue!);
const greenStyled = defaultOut.String('Green from Color()').Foreground(colorGreen!);

console.log(`Color() red: ${redStyled.String()}`);
console.log(`Color() blue: ${blueStyled.String()}`);
console.log(`Color() green: ${greenStyled.String()}`);

// Test profile compatibility
console.log('\n--- Profile Compatibility Tests ---');

const profiles = [Profile.Ascii, Profile.ANSI, Profile.ANSI256, Profile.TrueColor];
const profileNames = ['Ascii', 'ANSI', 'ANSI256', 'TrueColor'];

const testColor = RGBColor('#FF6600');

for (let i = 0; i < profiles.length; i++) {
  const profile = profiles[i]!;
  const profileName = profileNames[i]!;
  const profileOut = NewOutput(process.stdout, WithProfile(profile));
  const styled = profileOut.String(`${profileName} Test`).Foreground(testColor);
  console.log(`${profileName} profile: ${styled.String()}`);
}

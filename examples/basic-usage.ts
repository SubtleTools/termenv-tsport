#!/usr/bin/env bun

/**
 * Basic usage example for @tsports/termenv
 * 
 * Run with: bun examples/basic-usage.ts
 */

import {
  colorProfile,
  profileName,
  envNoColor,
  hasDarkBackground,
  newOutput,
  withProfile,
  withTTY,
  Profile,
  Colors,
  string,
} from '../src/index.js';

// Detect terminal capabilities
console.log('=== Terminal Environment Detection ===');
const profile = colorProfile();
console.log(`Color profile: ${profileName(profile)}`);
console.log(`Environment disables color: ${envNoColor()}`);
console.log(`Has dark background: ${hasDarkBackground()}`);
console.log();

// Create different output configurations
console.log('=== Output Configuration Examples ===');

// Default output (auto-detects profile)
const defaultOutput = newOutput();
console.log(`Default output profile: ${profileName(defaultOutput.profile)}`);

// Force TrueColor profile
const trueColorOutput = newOutput(process.stdout, withProfile(Profile.TrueColor));
console.log(`Forced TrueColor profile: ${profileName(trueColorOutput.profile)}`);

// Force TTY mode (useful for testing)
const forcedTTYOutput = newOutput(process.stdout, withTTY(true));
console.log(`Forced TTY output profile: ${profileName(forcedTTYOutput.profile)}`);
console.log();

// Color examples
console.log('=== Color Examples ===');

// Basic ANSI colors
console.log('ANSI Colors:');
console.log(`  ${Colors.Red().sequence(false)}Red text${Colors.Red().sequence(false) ? '\x1b[0m' : ''}`);
console.log(`  ${Colors.Green().sequence(false)}Green text${Colors.Green().sequence(false) ? '\x1b[0m' : ''}`);
console.log(`  ${Colors.Blue().sequence(false)}Blue text${Colors.Blue().sequence(false) ? '\x1b[0m' : ''}`);

// RGB colors (if supported)
if (profile === Profile.TrueColor) {
  console.log('\nTrueColor RGB:');
  const magenta = trueColorOutput.profile;
  console.log(`  RGB color support available`);
}

console.log();

// Style examples
console.log('=== Style Examples ===');
const style = string('Hello World');
console.log('Basic styled text:');
console.log(`  ${style.foreground(Colors.Cyan()).render()}`);
console.log(`  ${style.background(Colors.Yellow()).foreground(Colors.Black()).render()}`);
console.log(`  ${style.setBold().foreground(Colors.Red()).render()}`);
console.log(`  ${style.setItalic().setUnderline().foreground(Colors.Green()).render()}`);

console.log();

// Profile-specific examples
console.log('=== Profile-Specific Examples ===');
const testText = 'Color Test';

// Show same color in different profiles
const profiles = [Profile.TrueColor, Profile.ANSI256, Profile.ANSI, Profile.Ascii];
profiles.forEach(p => {
  const output = newOutput(process.stdout, withProfile(p));
  const style = output.string(testText).foreground(Colors.Red());
  console.log(`${profileName(p).padEnd(10)}: ${style.render()}`);
});

console.log();
console.log('=== Environment Information ===');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`TERM: ${process.env.TERM || 'not set'}`);
console.log(`COLORTERM: ${process.env.COLORTERM || 'not set'}`);
console.log(`NO_COLOR: ${process.env.NO_COLOR || 'not set'}`);
console.log(`CLICOLOR: ${process.env.CLICOLOR || 'not set'}`);
console.log(`CLICOLOR_FORCE: ${process.env.CLICOLOR_FORCE || 'not set'}`);
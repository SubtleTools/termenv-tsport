import {
  ansi256Color,
  ansiColor,
  newOutput,
  Profile,
  rgbColor,
  withProfile,
} from '../../../../src/index.js';

// Force TrueColor profile for consistent testing
const out = newOutput(process.stdout, withProfile(Profile.TrueColor));

console.log('--- Complex Method Chaining Test ---');

// Test progressive chaining
const base = out.string('Progressive Chaining');
const step1 = base.bold();
const step2 = step1.italic();
const step3 = step2.underline();
const step4 = step3.foreground(rgbColor('#FF0000'));
const final = step4.background(rgbColor('#FFFF00'));

console.log(`Base: ${base.toString()}`);
console.log(`Step 1 (Bold): ${step1.toString()}`);
console.log(`Step 2 (+ Italic): ${step2.toString()}`);
console.log(`Step 3 (+ Underline): ${step3.toString()}`);
console.log(`Step 4 (+ Red FG): ${step4.toString()}`);
console.log(`Final (+ Yellow BG): ${final.toString()}`);

// Test all-in-one chaining
const allInOne = out
  .string('All In One Chain')
  .bold()
  .italic()
  .underline()
  .overline()
  .blink()
  .reverse()
  .crossOut()
  .foreground(rgbColor('#00FF00'))
  .background(rgbColor('#FF00FF'));

console.log(`All in One: ${allInOne.toString()}`);

// Test chaining with different color types
const ansiChain = out.string('ANSI Chain').bold().foreground(ansiColor(2)).background(ansiColor(5));

const ansi256Chain = out
  .string('ANSI256 Chain')
  .italic()
  .underline()
  .foreground(ansi256Color(196))
  .background(ansi256Color(21));

const rgbChain = out
  .string('RGB Chain')
  .faint()
  .overline()
  .foreground(rgbColor('#FF8C00'))
  .background(rgbColor('#4B0082'));

console.log(`ANSI Chain: ${ansiChain.toString()}`);
console.log(`ANSI256 Chain: ${ansi256Chain.toString()}`);
console.log(`RGB Chain: ${rgbChain.toString()}`);

// Test chaining order independence
const order1 = out
  .string('Order Test 1')
  .foreground(rgbColor('#FF0000'))
  .bold()
  .background(rgbColor('#0000FF'));

const order2 = out
  .string('Order Test 2')
  .bold()
  .background(rgbColor('#0000FF'))
  .foreground(rgbColor('#FF0000'));

console.log(`Order 1 (FG-Bold-BG): ${order1.toString()}`);
console.log(`Order 2 (Bold-BG-FG): ${order2.toString()}`);

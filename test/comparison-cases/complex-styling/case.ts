#!/usr/bin/env bun
import { rgbColor, string } from '../../../../src/index.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
// biome-ignore lint/suspicious/noExplicitAny: Test utility function requires any for stdout mock
(process.stdout.write as any) = (chunk: string | Uint8Array) => {
  capturedOutput += chunk.toString();
  return true;
};

try {
  const styled = string('Complex')
    .foreground(rgbColor('#FF0000'))
    .background(rgbColor('#00FF00'))
    .bold()
    .underline()
    .italic();
  process.stdout.write(styled.toString());

  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

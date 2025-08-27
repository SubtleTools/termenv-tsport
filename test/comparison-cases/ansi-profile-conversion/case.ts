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
  // Force ANSI profile and convert RGB color
  const styled = string('RGB to ANSI').foreground(rgbColor('#FF0000'));
  process.stdout.write(styled.toString());

  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

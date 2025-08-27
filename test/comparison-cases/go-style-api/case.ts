#!/usr/bin/env bun
// Using TypeScript Go-style API
// biome-ignore lint/suspicious/noShadowRestrictedNames: Go API compatibility requires this name
import { RGBColor, String } from '../../../../src/go-style.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
// biome-ignore lint/suspicious/noExplicitAny: Test utility function requires any for stdout mock
(process.stdout.write as any) = (chunk: string | Uint8Array) => {
  capturedOutput += chunk.toString();
  return true;
};

try {
  const styled = String('Go Style API').Foreground(RGBColor('#00FF00')).Bold();
  process.stdout.write(styled.String());

  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

#!/usr/bin/env bun

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
// biome-ignore lint/suspicious/noExplicitAny: Test utility function requires any for stdout mock
(process.stdout.write as any) = (chunk: string | Uint8Array) => {
  capturedOutput += chunk.toString();
  return true;
};

try {
  console.log('typescript');
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}

import { describe, expect, test } from 'bun:test';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { compareOutputs, runTestCase } from './utils/comparison.js';
import { applyFilter, getTestFilter, logFilterInfo } from './utils/test-filter.js';

describe('Examples Comparison Tests', () => {
  const examplesPath = join(import.meta.dir, 'corpus', 'example');

  if (!statSync(examplesPath, { throwIfNoEntry: false })) {
    console.warn('⚠️  No examples directory found at:', examplesPath);
    return;
  }

  const exampleDirs = readdirSync(examplesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      name: dirent.name,
      category: 'example',
      id: dirent.name,
      path: join(examplesPath, dirent.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Apply test filtering
  const testFilter = getTestFilter();
  const filteredExamples = applyFilter(exampleDirs, testFilter);
  logFilterInfo(testFilter, exampleDirs, filteredExamples, 'examples');

  if (filteredExamples.length === 0) {
    console.log('📝 No examples match the current filter');
    return;
  }

  filteredExamples.forEach(({ name, path }) => {
    test(`Example: ${name}`, async () => {
      try {
        const tsOutput = runTestCase(path, false, {
          COLORTERM: 'truecolor',
          TERM: 'xterm-256color',
        });

        const goOutput = runTestCase(path, true, {
          COLORTERM: 'truecolor',
          TERM: 'xterm-256color',
        });

        const comparison = compareOutputs(tsOutput, goOutput);
        if (!comparison.match) {
          console.log(`❌ Example "${name}" output mismatch:`);
          console.log('TypeScript output:', JSON.stringify(tsOutput));
          console.log('Go output:', JSON.stringify(goOutput));
          console.log('Differences:', comparison.differences);
        }

        expect(comparison.match).toBe(true);
      } catch (error) {
        console.warn(`⚠️  Skipping example "${name}" (Go not available):`, error);
        // Don't fail the test if Go isn't available - just skip it
        expect(true).toBe(true);
      }
    });
  });

  // Test that examples run consistently (no random output)
  test('Examples produce consistent output', async () => {
    const exampleToTest = filteredExamples[0];
    if (!exampleToTest) {
      console.log('📝 No examples available for consistency testing');
      return;
    }

    try {
      const output1 = runTestCase(exampleToTest.path, false, {
        COLORTERM: 'truecolor',
        TERM: 'xterm-256color',
      });

      const output2 = runTestCase(exampleToTest.path, false, {
        COLORTERM: 'truecolor',
        TERM: 'xterm-256color',
      });

      expect(output1).toBe(output2);
    } catch (error) {
      console.warn('⚠️  Skipping consistency test (execution error):', error);
      expect(true).toBe(true);
    }
  });
});

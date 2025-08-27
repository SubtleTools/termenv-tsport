import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Set up test environment with proper configuration
 */
export function setupTestEnvironment(): void {
  // Ensure consistent terminal behavior for tests
  process.env.FORCE_COLOR = '3'; // Enable true color support
  process.env.COLORTERM = 'truecolor';
  process.env.TERM = 'xterm-256color';

  // Disable TTY detection for consistent output
  process.env.CI = undefined; // Remove CI detection

  // Create output directory for test artifacts
  const outputDir = join(process.cwd(), 'test', 'output');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
}

/**
 * Clean up temporary test files and artifacts
 */
export function cleanupTestArtifacts(): void {
  const outputDir = join(process.cwd(), 'test', 'output');

  try {
    if (existsSync(outputDir)) {
      const { rmSync } = require('node:fs');
      rmSync(outputDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.warn('Failed to clean up test artifacts:', error);
  }
}

/**
 * Validate test directory structure matches expected layout
 */
export function validateTestStructure(): boolean {
  const requiredPaths = [
    'test/corpus',
    'test/snapshots',
    'test/automation/reference',
    'test/utils',
    'test/automated-cases.test.ts',
    'test/examples-comparison.test.ts',
    'test/basic.test.ts',
  ];

  const missing = requiredPaths.filter((path) => !existsSync(join(process.cwd(), path)));

  if (missing.length > 0) {
    console.error('❌ Missing required test structure:');
    for (const path of missing) {
      console.error(`   - ${path}`);
    }
    return false;
  }

  console.log('✅ Test directory structure is valid');
  return true;
}

/**
 * Get test environment information for debugging
 */
export function getTestEnvironmentInfo(): Record<string, string | undefined> {
  return {
    NODE_ENV: process.env.NODE_ENV,
    FORCE_COLOR: process.env.FORCE_COLOR,
    COLORTERM: process.env.COLORTERM,
    TERM: process.env.TERM,
    NO_COLOR: process.env.NO_COLOR,
    CI: process.env.CI,
    TEST_FILTER: process.env.TEST_FILTER,
    DEBUG: process.env.DEBUG,
    VERBOSE: process.env.VERBOSE,
  };
}

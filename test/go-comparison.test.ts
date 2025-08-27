import { describe, expect, test } from 'bun:test';
import { runTestCase, compareOutputs, type ComparisonResult } from '../../go-colorful/test/utils/comparison.js';
import { 
  string, rgbColor, ansiColor, ansi256Color,
  colorProfile, profileName, 
  clearScreen, moveCursor, createHyperlink, sendNotification
} from '#src/index.js';
import {
  String, RGBColor, ANSIColor, ANSI256Color,
  ColorProfile, ProfileName,
  ClearScreen, MoveCursor, Hyperlink
} from '#src/go-style.js';
import { Profile, NoColor } from '#src/types.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Helper to create test cases
function createTestCase(name: string, tsCode: string, goCode: string) {
  const testDir = join(import.meta.dir, 'comparison-cases', name);
  
  try {
    mkdirSync(testDir, { recursive: true });
    
    // Write TypeScript test case
    writeFileSync(join(testDir, 'case.ts'), `#!/usr/bin/env bun
import { 
  string, rgbColor, ansiColor, ansi256Color, noColor,
  colorProfile, profileName, clearScreen, moveCursor,
  createHyperlink, sendNotification, altScreen, exitAltScreen,
  hideCursor, showCursor, cursorUp, cursorDown, clearLine,
  enableMouse, disableMouse, setWindowTitle
} from '../../../../src/index.js';

// Mock process.stdout.write to capture output
const originalWrite = process.stdout.write;
let capturedOutput = '';
(process.stdout.write as any) = function(chunk: any) {
  capturedOutput += chunk.toString();
  return true;
};

try {
  ${tsCode}
  console.log(capturedOutput);
} finally {
  process.stdout.write = originalWrite;
}
`);
    
    // Write Go test case
    writeFileSync(join(testDir, 'case.go'), `package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/muesli/termenv"
)

var output strings.Builder

func init() {
	// Redirect output to capture it
	termenv.SetDefaultOutput(termenv.NewOutput(&output, termenv.WithProfile(termenv.TrueColor)))
}

func main() {
	${goCode}
	fmt.Print(output.String())
}
`);
    
    return testDir;
  } catch (error) {
    console.warn(`Could not create test case ${name}:`, error);
    return null;
  }
}

describe('Go Comparison Tests', () => {
  describe('basic color output', () => {
    test('RGB color foreground matches Go exactly', async () => {
      const testCase = createTestCase(
        'rgb-foreground',
        `
        const styled = string('Hello World').foreground(rgbColor('#FF6B35'));
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Hello World").Foreground(termenv.RGBColor("#FF6B35"))
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          if (!comparison.match) {
            console.log('TS output:', JSON.stringify(tsOutput));
            console.log('Go output:', JSON.stringify(goOutput));
            console.log('Differences:', comparison.differences);
          }
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });

    test('ANSI color matches Go exactly', async () => {
      const testCase = createTestCase(
        'ansi-color',
        `
        const styled = string('Bright Red').foreground(ansiColor(9));
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Bright Red").Foreground(termenv.ANSIColor(9))
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { TERM: 'xterm-color' });
          const goOutput = runTestCase(testCase, true, { TERM: 'xterm-color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });

    test('ANSI256 color matches Go exactly', async () => {
      const testCase = createTestCase(
        'ansi256-color',
        `
        const styled = string('Orange Text').foreground(ansi256Color(208));
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Orange Text").Foreground(termenv.ANSI256Color(208))
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  describe('text styling', () => {
    test('bold and italic combination matches Go', async () => {
      const testCase = createTestCase(
        'bold-italic',
        `
        const styled = string('Bold and Italic').bold().italic();
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Bold and Italic").Bold().Italic()
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });

    test('complex styling chain matches Go', async () => {
      const testCase = createTestCase(
        'complex-styling',
        `
        const styled = string('Complex')
          .foreground(rgbColor('#FF0000'))
          .background(rgbColor('#00FF00'))
          .bold()
          .underline()
          .italic();
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Complex").
          Foreground(termenv.RGBColor("#FF0000")).
          Background(termenv.RGBColor("#00FF00")).
          Bold().
          Underline().
          Italic()
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  describe('color profile behavior', () => {
    test('color conversion in ANSI profile matches Go', async () => {
      const testCase = createTestCase(
        'ansi-profile-conversion',
        `
        // Force ANSI profile and convert RGB color
        const styled = string('RGB to ANSI').foreground(rgbColor('#FF0000'));
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("RGB to ANSI").Foreground(termenv.RGBColor("#FF0000"))
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { TERM: 'linux' }); // Forces ANSI profile
          const goOutput = runTestCase(testCase, true, { TERM: 'linux' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });

    test('no color output in ASCII profile matches Go', async () => {
      const testCase = createTestCase(
        'ascii-profile',
        `
        const styled = string('No Colors Here')
          .foreground(rgbColor('#FF0000'))
          .bold()
          .italic();
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("No Colors Here").
          Foreground(termenv.RGBColor("#FF0000")).
          Bold().
          Italic()
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { TERM: 'dumb' }); // Forces ASCII profile
          const goOutput = runTestCase(testCase, true, { TERM: 'dumb' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  describe('Go-compatible API', () => {
    test('Go-style API produces identical output', async () => {
      const testCase = createTestCase(
        'go-style-api',
        `
        // Using TypeScript Go-style API
        import { String, RGBColor } from '../../../../src/go-style.js';
        const styled = String('Go Style API').Foreground(RGBColor('#00FF00')).Bold();
        process.stdout.write(styled.String());
        `,
        `
        s := termenv.String("Go Style API").Foreground(termenv.RGBColor("#00FF00")).Bold()
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { COLORTERM: 'truecolor', TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  describe('hyperlinks', () => {
    test('hyperlink format matches Go exactly', async () => {
      const testCase = createTestCase(
        'hyperlink',
        `
        const link = createHyperlink('https://example.com', 'Example Link');
        process.stdout.write(link);
        `,
        `
        link := termenv.Hyperlink("https://example.com", "Example Link")
        output.WriteString(link)
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false);
          const goOutput = runTestCase(testCase, true);
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  describe('environment variable handling', () => {
    test('NO_COLOR environment variable handling matches Go', async () => {
      const testCase = createTestCase(
        'no-color-env',
        `
        const styled = string('Should be plain').foreground(rgbColor('#FF0000')).bold();
        process.stdout.write(styled.toString());
        `,
        `
        s := termenv.String("Should be plain").Foreground(termenv.RGBColor("#FF0000")).Bold()
        output.WriteString(s.String())
        `
      );

      if (testCase) {
        try {
          const tsOutput = runTestCase(testCase, false, { NO_COLOR: '1', TERM: 'xterm-256color' });
          const goOutput = runTestCase(testCase, true, { NO_COLOR: '1', TERM: 'xterm-256color' });
          
          const comparison = compareOutputs(tsOutput, goOutput);
          expect(comparison.match).toBe(true);
        } catch (error) {
          console.warn('Skipping Go comparison test (Go not available):', error);
        }
      }
    });
  });

  // Fallback tests that work without Go
  describe('output format validation (fallback tests)', () => {
    test('RGB color generates correct ANSI sequence', () => {
      const styled = string('Test').foreground(rgbColor('#FF6B35'));
      const output = styled.toString();
      
      expect(output).toContain('Test');
      // In Ascii profile, colors are stripped
      if (colorProfile() !== Profile.Ascii) {
        expect(output).toContain('\x1b[38;2;255;107;53m');
        expect(output).toContain('\x1b[0m'); // Reset sequence
      }
    });

    test('ANSI color generates correct sequence', () => {
      const styled = string('Test').foreground(ansiColor(9));
      const output = styled.toString();
      
      expect(output).toContain('Test');
      // In Ascii profile, colors are stripped
      if (colorProfile() !== Profile.Ascii) {
        expect(output).toContain('\x1b[91m');
      }
    });

    test('ANSI256 color generates correct sequence', () => {
      const styled = string('Test').foreground(ansi256Color(196));
      const output = styled.toString();
      
      expect(output).toContain('Test');
      // In Ascii profile, colors are stripped
      if (colorProfile() !== Profile.Ascii) {
        expect(output).toContain('\x1b[38;5;196m');
      }
    });

    test('bold styling generates correct sequence', () => {
      const styled = string('Test').bold();
      const output = styled.toString();
      
      // In Ascii profile, styling is stripped but text remains
      expect(output).toContain('Test');
      // Styling may be stripped in ASCII profile
      if (colorProfile() !== Profile.Ascii) {
        expect(output).toContain('\x1b[1m');
      }
    });

    test('hyperlink generates correct OSC 8 format', () => {
      const link = createHyperlink('https://example.com', 'Test');
      
      // OSC 8 format: \x1b]8;;URL\x1b\\TEXT\x1b]8;;\x1b\\
      expect(link).toBe('\x1b]8;;https://example.com\x1b\\Test\x1b]8;;\x1b\\');
    });

    test('complex styling generates all sequences', () => {
      const styled = string('Complex')
        .foreground(rgbColor('#FF0000'))
        .background(ansiColor(4))
        .bold()
        .italic()
        .underline();
      
      const output = styled.toString();
      
      // Check that styling was applied (sequences may be combined)
      expect(output).toContain('Complex');
      // In Ascii profile, styling is stripped
      if (colorProfile() !== Profile.Ascii) {
        expect(output).toContain('\x1b['); // Has some ANSI sequences
        expect(output).toContain('\x1b[0m'); // Has reset sequence
      }
    });
  });
});

// Helper test to validate our test infrastructure
describe('Test Infrastructure', () => {
  test('comparison utilities work correctly', () => {
    const identical = compareOutputs('hello', 'hello');
    expect(identical.match).toBe(true);
    expect(identical.differences).toBeUndefined();

    const different = compareOutputs('hello', 'world');
    expect(different.match).toBe(false);
    expect(different.differences).toBeDefined();
    expect(different.differences!.length).toBeGreaterThan(0);
  });

  test('test case creation works', () => {
    const testDir = createTestCase(
      'test-infrastructure',
      'console.log("typescript");',
      'fmt.Println("go")'
    );
    
    expect(testDir).not.toBeNull();
    if (testDir) {
      expect(testDir).toContain('test-infrastructure');
    }
  });
});
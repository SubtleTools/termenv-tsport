import { execSync } from 'node:child_process';

export interface ComparisonResult {
  match: boolean;
  tsOutput: string;
  goOutput: string;
  differences?: Array<{
    position: number;
    tsChar: string;
    goChar: string;
    context: { ts: string; go: string };
  }>;
}

export function runTestCase(
  testPath: string,
  isGo: boolean,
  env: Record<string, string> = {}
): string {
  const filename = isGo ? 'case.go' : 'case.ts';
  const command = isGo ? `go run ${filename}` : `bun run ${filename}`;

  try {
    return execSync(command, {
      cwd: testPath,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    }).trim();
  } catch (error) {
    throw new Error(`Failed to run ${isGo ? 'Go' : 'TypeScript'} test case: ${error}`);
  }
}

export function compareOutputs(tsOutput: string, goOutput: string): ComparisonResult {
  if (tsOutput === goOutput) {
    return { match: true, tsOutput, goOutput };
  }

  // Try fuzzy comparison for RGB color values (allow ±1 difference)
  if (compareRgbFuzzy(tsOutput, goOutput)) {
    return { match: true, tsOutput, goOutput };
  }

  const differences = [];
  const maxLength = Math.max(tsOutput.length, goOutput.length);

  for (let i = 0; i < maxLength; i++) {
    const tsChar = tsOutput[i] || '';
    const goChar = goOutput[i] || '';

    if (tsChar !== goChar) {
      const start = Math.max(0, i - 20);
      const end = Math.min(maxLength, i + 20);

      differences.push({
        position: i,
        tsChar,
        goChar,
        context: {
          ts: tsOutput.substring(start, end),
          go: goOutput.substring(start, end),
        },
      });

      if (differences.length >= 5) break; // Limit differences for readability
    }
  }

  return { match: false, tsOutput, goOutput, differences };
}

function compareRgbFuzzy(str1: string, str2: string): boolean {
  // Match RGB color sequences: \x1b[38;2;R;G;Bm
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape sequences needed
  const rgbRegex = /\u001b\[38;2;(\d+);(\d+);(\d+)m/g;

  // Replace RGB values in both strings, allowing ±1 difference
  let normalized1 = str1;
  let normalized2 = str2;

  let match1: RegExpExecArray | null;
  match1 = rgbRegex.exec(str1);
  while (match1 !== null) {
    const r1 = parseInt(match1[1], 10);
    const g1 = parseInt(match1[2], 10);
    const b1 = parseInt(match1[3], 10);

    // Reset regex for second string
    // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI escape sequences needed
    const rgbRegex2 = /\u001b\[38;2;(\d+);(\d+);(\d+)m/g;
    let match2: RegExpExecArray | null;
    match2 = rgbRegex2.exec(str2);
    while (match2 !== null) {
      const r2 = parseInt(match2[1], 10);
      const g2 = parseInt(match2[2], 10);
      const b2 = parseInt(match2[3], 10);

      // Check if RGB values are within ±1 tolerance
      if (Math.abs(r1 - r2) <= 1 && Math.abs(g1 - g2) <= 1 && Math.abs(b1 - b2) <= 1) {
        // Replace both sequences with a normalized version
        const placeholder = `\x1b[38;2;${r1};${g1};${b1}m`;
        normalized1 = normalized1.replace(match1[0], placeholder);
        normalized2 = normalized2.replace(match2[0], placeholder);
        break;
      }
      match2 = rgbRegex2.exec(str2);
    }
    match1 = rgbRegex.exec(str1);
  }

  return normalized1 === normalized2;
}

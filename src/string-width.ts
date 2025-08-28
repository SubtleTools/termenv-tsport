/**
 * Unicode-aware string width calculation
 * Simplified implementation for terminal display width
 * Based on East Asian Width property and common terminal behavior
 */

/**
 * Check if a code point is a combining character (zero width)
 */
function isCombining(codePoint: number): boolean {
  // Common combining character ranges
  return (
    (codePoint >= 0x0300 && codePoint <= 0x036f) || // Combining Diacritical Marks
    (codePoint >= 0x1ab0 && codePoint <= 0x1aff) || // Combining Diacritical Marks Extended
    (codePoint >= 0x1dc0 && codePoint <= 0x1dff) || // Combining Diacritical Marks Supplement
    (codePoint >= 0x20d0 && codePoint <= 0x20ff) || // Combining Diacritical Marks for Symbols
    (codePoint >= 0xfe20 && codePoint <= 0xfe2f)    // Combining Half Marks
  );
}

/**
 * Check if a code point is East Asian fullwidth or wide
 */
function isWideCharacter(codePoint: number): boolean {
  // Common wide character ranges
  return (
    (codePoint >= 0x1100 && codePoint <= 0x115f) || // Hangul Jamo
    (codePoint >= 0x231a && codePoint <= 0x231b) || // Watch, Hourglass
    (codePoint >= 0x2329 && codePoint <= 0x232a) || // Angle Brackets
    (codePoint >= 0x23e9 && codePoint <= 0x23ec) || // Play/Pause buttons
    (codePoint >= 0x23f0 && codePoint <= 0x23f0) || // Alarm Clock
    (codePoint >= 0x23f3 && codePoint <= 0x23f3) || // Hourglass
    (codePoint >= 0x25fd && codePoint <= 0x25fe) || // Black/White Medium Small Square
    (codePoint >= 0x2614 && codePoint <= 0x2615) || // Umbrella, Hot Beverage
    (codePoint >= 0x2648 && codePoint <= 0x2653) || // Zodiac signs
    (codePoint >= 0x267f && codePoint <= 0x267f) || // Wheelchair Symbol
    (codePoint >= 0x2693 && codePoint <= 0x2693) || // Anchor
    (codePoint >= 0x26a1 && codePoint <= 0x26a1) || // High Voltage
    (codePoint >= 0x26aa && codePoint <= 0x26ab) || // Circles
    (codePoint >= 0x26bd && codePoint <= 0x26be) || // Soccer Ball, Baseball
    (codePoint >= 0x26c4 && codePoint <= 0x26c5) || // Snowman, Sun
    (codePoint >= 0x26ce && codePoint <= 0x26ce) || // Ophiuchus
    (codePoint >= 0x26d4 && codePoint <= 0x26d4) || // No Entry
    (codePoint >= 0x26ea && codePoint <= 0x26ea) || // Church
    (codePoint >= 0x26f2 && codePoint <= 0x26f3) || // Fountain, Flag in Hole
    (codePoint >= 0x26f5 && codePoint <= 0x26f5) || // Sailboat
    (codePoint >= 0x26fa && codePoint <= 0x26fa) || // Tent
    (codePoint >= 0x26fd && codePoint <= 0x26fd) || // Fuel Pump
    (codePoint >= 0x2705 && codePoint <= 0x2705) || // Check Mark
    (codePoint >= 0x270a && codePoint <= 0x270b) || // Fist
    (codePoint >= 0x2728 && codePoint <= 0x2728) || // Sparkles
    (codePoint >= 0x274c && codePoint <= 0x274c) || // Cross Mark
    (codePoint >= 0x274e && codePoint <= 0x274e) || // Cross Mark Button
    (codePoint >= 0x2753 && codePoint <= 0x2755) || // Question Mark
    (codePoint >= 0x2757 && codePoint <= 0x2757) || // Exclamation
    (codePoint >= 0x2795 && codePoint <= 0x2797) || // Plus, Minus, Division
    (codePoint >= 0x27b0 && codePoint <= 0x27b0) || // Curly Loop
    (codePoint >= 0x27bf && codePoint <= 0x27bf) || // Double Curly Loop
    (codePoint >= 0x2b1b && codePoint <= 0x2b1c) || // Squares
    (codePoint >= 0x2b50 && codePoint <= 0x2b50) || // Star
    (codePoint >= 0x2b55 && codePoint <= 0x2b55) || // Circle
    (codePoint >= 0x3000 && codePoint <= 0x303e) || // CJK Symbols and Punctuation
    (codePoint >= 0x3041 && codePoint <= 0x3096) || // Hiragana
    (codePoint >= 0x30a1 && codePoint <= 0x30fa) || // Katakana
    (codePoint >= 0x3105 && codePoint <= 0x312d) || // Bopomofo
    (codePoint >= 0x3131 && codePoint <= 0x318e) || // Hangul Compatibility Jamo
    (codePoint >= 0x3190 && codePoint <= 0x31ba) || // Kanbun
    (codePoint >= 0x31c0 && codePoint <= 0x31e3) || // CJK Strokes
    (codePoint >= 0x31f0 && codePoint <= 0x31ff) || // Katakana Phonetic Extensions
    (codePoint >= 0x3200 && codePoint <= 0x32ff) || // Enclosed CJK Letters and Months
    (codePoint >= 0x3300 && codePoint <= 0x33ff) || // CJK Compatibility
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) || // CJK Extension A
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) || // CJK Unified Ideographs
    (codePoint >= 0xa000 && codePoint <= 0xa48c) || // Yi Syllables
    (codePoint >= 0xa490 && codePoint <= 0xa4c6) || // Yi Radicals
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) || // Hangul Syllables
    (codePoint >= 0xf900 && codePoint <= 0xfaff) || // CJK Compatibility Ideographs
    (codePoint >= 0xfe10 && codePoint <= 0xfe19) || // Vertical Forms
    (codePoint >= 0xfe30 && codePoint <= 0xfe6f) || // CJK Compatibility Forms
    (codePoint >= 0xff00 && codePoint <= 0xff60) || // Fullwidth Forms
    (codePoint >= 0xffe0 && codePoint <= 0xffe6) || // Fullwidth Forms
    (codePoint >= 0x1f004 && codePoint <= 0x1f004) || // Mahjong Tile
    (codePoint >= 0x1f0cf && codePoint <= 0x1f0cf) || // Playing Card
    (codePoint >= 0x1f18e && codePoint <= 0x1f18e) || // AB Button
    (codePoint >= 0x1f191 && codePoint <= 0x1f19a) || // CL Button, etc.
    (codePoint >= 0x1f200 && codePoint <= 0x1f202) || // Square Hiragana, Katakana
    (codePoint >= 0x1f210 && codePoint <= 0x1f23b) || // Squared CJK
    (codePoint >= 0x1f240 && codePoint <= 0x1f248) || // Tortoise Shell Bracketed CJK
    (codePoint >= 0x1f250 && codePoint <= 0x1f251) || // Circled Ideograph
    (codePoint >= 0x1f300 && codePoint <= 0x1f64f) || // Miscellaneous Symbols and Pictographs
    (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) || // Transport and Map Symbols
    (codePoint >= 0x1f910 && codePoint <= 0x1f96b) || // Supplemental Symbols and Pictographs
    (codePoint >= 0x1f980 && codePoint <= 0x1f9e0)    // Supplemental Symbols and Pictographs
  );
}

/**
 * Check if a code point is a control character (zero width)
 */
function isControlCharacter(codePoint: number): boolean {
  return (
    (codePoint >= 0 && codePoint <= 0x1f) ||     // C0 Controls
    (codePoint >= 0x7f && codePoint <= 0x9f) ||  // C1 Controls
    codePoint === 0x200b ||  // Zero Width Space
    codePoint === 0x200c ||  // Zero Width Non-Joiner
    codePoint === 0x200d ||  // Zero Width Joiner
    codePoint === 0x2060 ||  // Word Joiner
    codePoint === 0xfeff     // Zero Width No-Break Space
  );
}

/**
 * Calculate the display width of a string in a monospace terminal
 * This implementation handles:
 * - ANSI escape sequences (width 0)
 * - Control characters (width 0)
 * - Combining characters (width 0)
 * - East Asian wide characters (width 2)
 * - Regular characters (width 1)
 */
export function stringWidth(str: string): number {
  if (!str) return 0;

  let width = 0;
  let i = 0;

  while (i < str.length) {
    // Handle ANSI escape sequences
    if (str[i] === '\x1b' && str[i + 1] === '[') {
      // Skip ANSI escape sequence
      i += 2;
      while (i < str.length && !/[a-zA-Z]/.test(str[i])) {
        i++;
      }
      i++; // Skip the final letter
      continue;
    }

    // Get the Unicode code point
    const codePoint = str.codePointAt(i);
    if (codePoint === undefined) break;

    // Skip high surrogate pairs by advancing extra position
    const charLength = codePoint > 0xffff ? 2 : 1;

    // Calculate width for this character
    if (isControlCharacter(codePoint) || isCombining(codePoint)) {
      // Zero width characters
      width += 0;
    } else if (isWideCharacter(codePoint)) {
      // Wide characters (mostly East Asian)
      width += 2;
    } else {
      // Regular characters
      width += 1;
    }

    i += charLength;
  }

  return width;
}
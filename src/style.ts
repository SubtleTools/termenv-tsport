/**
 * Style implementation for termenv.
 * Port of github.com/muesli/termenv style.go to TypeScript.
 */

// Fallback string width calculation for environments where uniseg is not available
function fallbackStringWidth(s: string): number {
  // Simple character count - not Unicode-aware but works for basic cases and CI
  return s.replace(/\x1b\[[0-9;]*m/g, '').length; // Strip ANSI escape sequences
}
import { type Color, CSI, Profile } from './types.js';

// Sequence definitions - matches Go constants
export const ResetSeq = '0';
export const BoldSeq = '1';
export const FaintSeq = '2';
export const ItalicSeq = '3';
export const UnderlineSeq = '4';
export const BlinkSeq = '5';
export const ReverseSeq = '7';
export const CrossOutSeq = '9';
export const OverlineSeq = '53';

/**
 * Style is a string that various rendering styles can be applied to.
 * Direct port of Go Style struct
 */
export class Style {
  public profile: Profile;
  public string: string;
  public styles: string[];

  constructor(profile: Profile, text?: string) {
    this.profile = profile;
    this.string = text || '';
    this.styles = [];
  }

  /**
   * String returns the styled string
   */
  toString(): string {
    return this.styled(this.string);
  }

  /**
   * String returns the styled string - Go-compatible method name
   */
  String(): string {
    return this.toString();
  }

  /**
   * Styled renders s with all applied styles - matches Go Styled method
   */
  styled(s: string): string {
    if (this.profile === Profile.Ascii) {
      return s;
    }
    if (this.styles.length === 0) {
      return s;
    }

    const seq = this.styles.join(';');
    if (seq === '') {
      return s;
    }

    return `${CSI}${seq}m${s}${CSI}${ResetSeq}m`;
  }

  /**
   * Foreground sets a foreground color - matches Go Foreground method
   */
  foreground(c: Color | null): Style {
    const newStyle = this.copy();
    if (c) {
      const sequence = c.sequence(false);
      // Always push sequence, even if empty, to match Go behavior with invalid colors
      newStyle.styles.push(sequence);
    }
    return newStyle;
  }

  /**
   * Background sets a background color - matches Go Background method
   */
  background(c: Color | null): Style {
    const newStyle = this.copy();
    if (c) {
      const sequence = c.sequence(true);
      // Always push sequence, even if empty, to match Go behavior with invalid colors
      newStyle.styles.push(sequence);
    }
    return newStyle;
  }

  /**
   * Bold enables bold rendering - matches Go Bold method
   */
  bold(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(BoldSeq);
    return newStyle;
  }

  /**
   * Faint enables faint rendering - matches Go Faint method
   */
  faint(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(FaintSeq);
    return newStyle;
  }

  /**
   * Italic enables italic rendering - matches Go Italic method
   */
  italic(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(ItalicSeq);
    return newStyle;
  }

  /**
   * Underline enables underline rendering - matches Go Underline method
   */
  underline(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(UnderlineSeq);
    return newStyle;
  }

  /**
   * Overline enables overline rendering - matches Go Overline method
   */
  overline(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(OverlineSeq);
    return newStyle;
  }

  /**
   * Blink enables blink mode - matches Go Blink method
   */
  blink(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(BlinkSeq);
    return newStyle;
  }

  /**
   * Reverse enables reverse color mode - matches Go Reverse method
   */
  reverse(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(ReverseSeq);
    return newStyle;
  }

  /**
   * CrossOut enables crossed-out rendering - matches Go CrossOut method
   */
  crossOut(): Style {
    const newStyle = this.copy();
    newStyle.styles.push(CrossOutSeq);
    return newStyle;
  }

  /**
   * Width returns the width required to print all runes in Style
   * Uses @tsports/uniseg for width calculation like Go version
   */
  width(): number {
    // For now, use fallback implementation - this will be replaced with proper uniseg integration
    return fallbackStringWidth(this.string);
  }

  /**
   * Create a copy of this style
   */
  private copy(): Style {
    const newStyle = new Style(this.profile, this.string);
    newStyle.styles = [...this.styles];
    return newStyle;
  }

  // Go-compatible PascalCase method aliases

  /**
   * Foreground sets a foreground color - Go-compatible method name
   */
  Foreground(c: Color | null): Style {
    return this.foreground(c);
  }

  /**
   * Background sets a background color - Go-compatible method name
   */
  Background(c: Color | null): Style {
    return this.background(c);
  }

  /**
   * Bold enables bold rendering - Go-compatible method name
   */
  Bold(): Style {
    return this.bold();
  }

  /**
   * Faint enables faint rendering - Go-compatible method name
   */
  Faint(): Style {
    return this.faint();
  }

  /**
   * Italic enables italic rendering - Go-compatible method name
   */
  Italic(): Style {
    return this.italic();
  }

  /**
   * Underline enables underline rendering - Go-compatible method name
   */
  Underline(): Style {
    return this.underline();
  }

  /**
   * Overline enables overline rendering - Go-compatible method name
   */
  Overline(): Style {
    return this.overline();
  }

  /**
   * Blink enables blink mode - Go-compatible method name
   */
  Blink(): Style {
    return this.blink();
  }

  /**
   * Reverse enables reverse color mode - Go-compatible method name
   */
  Reverse(): Style {
    return this.reverse();
  }

  /**
   * CrossOut enables crossed-out rendering - Go-compatible method name
   */
  CrossOut(): Style {
    return this.crossOut();
  }

  /**
   * Width returns the width required to print all runes in Style - Go-compatible method name
   */
  Width(): number {
    return this.width();
  }
}

/**
 * NewString returns a new Style - matches Go String function
 */
export function NewString(...s: string[]): Style {
  return new Style(Profile.ANSI, s.join(' '));
}

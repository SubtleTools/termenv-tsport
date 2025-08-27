/**
 * Hyperlink support using OSC 8
 * Port of github.com/muesli/termenv/hyperlink.go
 */

import type { Output } from './types.js';

/**
 * Creates a clickable hyperlink using OSC 8 escape sequences
 * @param link The URL to link to
 * @param name The display text for the link
 * @returns The formatted hyperlink string
 */
export function hyperlink(link: string, name: string): string {
  if (!link) {
    return name;
  }

  // OSC 8 format: \e]8;;URL\e\\TEXT\e]8;;\e\\
  return `\x1b]8;;${link}\x1b\\${name}\x1b]8;;\x1b\\`;
}

/**
 * Hyperlink functionality for Output instances
 */
export class HyperlinkControl {
  constructor(private output: Output) {}

  /**
   * Writes a hyperlink to the output
   * @param link The URL to link to
   * @param name The display text for the link
   * @returns This instance for chaining
   */
  hyperlink(link: string, name: string): this {
    this.output.writeString(hyperlink(link, name));
    return this;
  }
}

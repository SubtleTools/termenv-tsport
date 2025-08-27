/**
 * Terminal notification support using OSC 777
 * Port of github.com/muesli/termenv/notification.go
 */

import type { Output } from './types.js';

/**
 * Creates a terminal notification using OSC 777 escape sequences
 * @param title The notification title
 * @param body The notification body
 * @returns The formatted notification string
 */
export function notify(title: string, body: string): string {
  // OSC 777 format: \e]777;notify;TITLE;BODY\e\\
  return `\x1b]777;notify;${title};${body}\x1b\\`;
}

/**
 * Notification functionality for Output instances
 */
export class NotificationControl {
  constructor(private output: Output) {}

  /**
   * Sends a notification to the terminal
   * @param title The notification title
   * @param body The notification body
   * @returns This instance for chaining
   */
  notify(title: string, body: string): this {
    this.output.writeString(notify(title, body));
    return this;
  }
}

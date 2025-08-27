import { describe, expect, test } from 'bun:test';
import { notify, NotificationControl } from '#src/notification.js';
import { newOutput } from '#src/output.js';

// Mock writer for capturing output
class MockWriter {
  public output: string[] = [];

  write(data: Uint8Array | string): Promise<number> {
    const text = typeof data === 'string' ? data : new TextDecoder().decode(data);
    this.output.push(text);
    return Promise.resolve(text.length);
  }

  clear(): void {
    this.output = [];
  }
}

describe('notify function', () => {
  test('creates correct OSC 777 notification format', () => {
    const result = notify('Test Title', 'Test Body');
    expect(result).toBe('\x1b]777;notify;Test Title;Test Body\x1b\\');
  });

  test('handles empty title and body', () => {
    const result = notify('', '');
    expect(result).toBe('\x1b]777;notify;;\x1b\\');
  });

  test('handles unicode in title and body', () => {
    const result = notify('🔔 通知', 'Unicode notification 测试');
    expect(result).toBe('\x1b]777;notify;🔔 通知;Unicode notification 测试\x1b\\');
  });

  test('handles special characters', () => {
    const result = notify('Title with; semicolon', 'Body with\nnewline');
    expect(result).toBe('\x1b]777;notify;Title with; semicolon;Body with\nnewline\x1b\\');
  });

  test('handles long strings', () => {
    const longTitle = 'Very '.repeat(50) + 'Long Title';
    const longBody = 'Very '.repeat(100) + 'Long Body';
    const result = notify(longTitle, longBody);
    expect(result).toBe(`\x1b]777;notify;${longTitle};${longBody}\x1b\\`);
  });
});

describe('NotificationControl', () => {
  test('writes notification to output', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const notificationControl = new NotificationControl(output);

    notificationControl.notify('Test Title', 'Test Body');
    
    expect(writer.output.length).toBe(1);
    expect(writer.output[0]).toBe('\x1b]777;notify;Test Title;Test Body\x1b\\');
  });

  test('method chaining works correctly', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const notificationControl = new NotificationControl(output);

    const result = notificationControl.notify('Title', 'Body');
    expect(result).toBe(notificationControl);
  });

  test('handles multiple notifications', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const notificationControl = new NotificationControl(output);

    notificationControl
      .notify('First Title', 'First Body')
      .notify('Second Title', 'Second Body');
    
    expect(writer.output.length).toBe(2);
    expect(writer.output[0]).toBe('\x1b]777;notify;First Title;First Body\x1b\\');
    expect(writer.output[1]).toBe('\x1b]777;notify;Second Title;Second Body\x1b\\');
  });

  test('handles empty notification gracefully', () => {
    const writer = new MockWriter();
    const output = newOutput(writer as any);
    const notificationControl = new NotificationControl(output);

    notificationControl.notify('', '');
    
    expect(writer.output.length).toBe(1);
    expect(writer.output[0]).toBe('\x1b]777;notify;;\x1b\\');
  });
});
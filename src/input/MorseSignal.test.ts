import { describe, expect, test } from 'bun:test';
import { isRescueMorseSignal, recognizeMorseSignal } from './MorseSignal';

describe('SOS timing', () => {
  test('accepts held dots and dashes with human timing variation', () => {
    expect(isRescueMorseSignal([90, 110, 100, 260, 310, 280, 95, 105, 100])).toBe(true);
  });

  test('accepts taps followed by longer pauses for the dashes', () => {
    const taps = [100, 110, 90, 105, 95, 100, 110, 90, 100];
    const pauses = [80, 95, 90, 300, 330, 310, 85, 100, 0];
    expect(isRescueMorseSignal(taps, pauses)).toBe(true);
  });

  test('does not let long pauses invalidate a correctly held SOS', () => {
    const heldSos = [100, 105, 95, 300, 310, 290, 102, 98, 104];
    const pauses = [0, 0, 0, 2200, 1800, 2600, 0, 0, 0];
    expect(isRescueMorseSignal(heldSos, pauses)).toBe(true);
  });

  test('rejects nine marks with no dash pattern', () => {
    expect(isRescueMorseSignal([100, 100, 100, 100, 100, 100, 100, 100, 100])).toBe(false);
  });

  test('recognizes WIN as dot-dash-dash, dot-dot, dash-dot', () => {
    expect(recognizeMorseSignal([100, 300, 280, 95, 105, 310, 100])).toBe('WIN');
  });

  test('recognizes WIN when dashes are tapped and represented by longer pauses', () => {
    const taps = [100, 100, 100, 100, 100, 100, 100];
    const pauses = [0, 300, 310, 0, 0, 290, 0];
    expect(recognizeMorseSignal(taps, pauses)).toBe('WIN');
  });
});

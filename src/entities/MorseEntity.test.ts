import { describe, expect, test } from 'bun:test';
import MorseEntity from './MorseEntity';

function recordPulses(entity: MorseEntity, durations: number[]): void {
  let timestamp = 0;
  for (const duration of durations) {
    entity.handleShiftDown({ timeStamp: timestamp } as KeyboardEvent);
    timestamp += duration;
    entity.handleShiftUp({ timeStamp: timestamp } as KeyboardEvent);
  }
}

describe('MorseEntity', () => {
  test('emits a rescue signal after the existing nine-pulse SOS sequence', () => {
    const morse = new MorseEntity();
    let rescues = 0;
    morse.on('rescue', () => rescues += 1);

    recordPulses(morse, [90, 110, 100, 260, 310, 280, 95, 105, 100]);

    expect(rescues).toBe(1);
  });

  test('emits one hint after every nine invalid pulses', () => {
    const morse = new MorseEntity();
    const hints: string[] = [];
    morse.on('hint', (key: string) => hints.push(key));

    recordPulses(morse, Array(9).fill(100));
    expect(hints).toEqual(['copy.nos-estamos-hundiendo-necesitamos-ayuda']);

    recordPulses(morse, Array(9).fill(100));
    expect(hints).toHaveLength(2);
  });
});

export const MORSE_EASTER_EGG_EVENT = 'shift-morse-easter-egg-win';

const MIN_DASH_TO_DOT_RATIO = 1.4;

export type MorseSignal = 'SOS' | 'WIN';

const SIGNAL_PATTERNS: Record<MorseSignal, readonly boolean[]> = {
  SOS: [false, false, false, true, true, true, false, false, false],
  WIN: [false, true, true, false, false, true, false],
};

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function matchesPattern(durations: number[], pattern: readonly boolean[]): boolean {
  if (durations.length !== pattern.length || durations.some((duration) => !Number.isFinite(duration) || duration <= 0)) {
    return false;
  }

  const dots = durations.filter((_duration, index) => !pattern[index]);
  const dashes = durations.filter((_duration, index) => pattern[index]);
  const dotUnit = median(dots);
  if (dotUnit <= 0) return false;

  const dotsAreConsistent = dots.every((duration) => duration >= dotUnit / 3 && duration <= dotUnit * 3);
  const dashesAreLongEnough = dashes.every((duration) => duration >= dotUnit * MIN_DASH_TO_DOT_RATIO);
  return dotsAreConsistent && dashesAreLongEnough;
}

export function recognizeMorseSignal(durations: number[], gapsAfter: number[] = []): MorseSignal | undefined {
  // Normal Morse uses the length of each key press. Test this first so pauses between
  // otherwise valid marks cannot turn a correctly held signal into a false negative.
  for (const [signal, pattern] of Object.entries(SIGNAL_PATTERNS) as [MorseSignal, readonly boolean[]][]) {
    if (matchesPattern(durations, pattern)) return signal;
  }

  // Also accept tapping marks with a longer pause after dash taps.
  for (const [signal, pattern] of Object.entries(SIGNAL_PATTERNS) as [MorseSignal, readonly boolean[]][]) {
    const dashPauses = durations.map((duration, index) => {
      if (!pattern[index]) return duration;
      const gap = gapsAfter[index];
      return Number.isFinite(gap) && gap !== undefined ? Math.max(duration, gap) : duration;
    });

    if (matchesPattern(dashPauses, pattern)) return signal;
  }
  return undefined;
}

export function isRescueMorseSignal(durations: number[], gapsAfter: number[] = []): boolean {
  return recognizeMorseSignal(durations, gapsAfter) === 'SOS';
}

interface ActivePulse {
  code: 'ShiftLeft' | 'ShiftRight';
  startedAt: number;
  modified: boolean;
}

export default class ShiftMorseEasterEgg {
  private enabled = false;
  private activePulse?: ActivePulse;
  private pulseDurations: number[] = [];
  private pulseGapsAfter: number[] = [];
  private lastPulseReleasedAt?: number;

  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    this.reset();
  }

  readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled) return;

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (event.repeat) return;

      if (this.activePulse) {
        this.reset();
        return;
      }

      if (this.pulseDurations.length > 0 && this.lastPulseReleasedAt !== undefined) {
        const lastIndex = this.pulseGapsAfter.length - 1;
        this.pulseGapsAfter[lastIndex] = Math.max(0, event.timeStamp - this.lastPulseReleasedAt);
      }

      this.activePulse = {
        code: event.code,
        startedAt: event.timeStamp,
        modified: false,
      };
      return;
    }

    if (this.activePulse) {
      this.activePulse.modified = true;
    } else {
      this.reset();
    }
  };

  readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (!this.enabled) return;

    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;

    const pulse = this.activePulse;
    if (!pulse || pulse.code !== event.code) return;

    this.activePulse = undefined;
    if (pulse.modified) {
      this.reset();
      return;
    }

    this.pulseDurations.push(Math.max(0, event.timeStamp - pulse.startedAt));
    this.pulseGapsAfter.push(0);
    this.lastPulseReleasedAt = event.timeStamp;

    const signal = recognizeMorseSignal(this.pulseDurations, this.pulseGapsAfter);
    if (signal) {
      this.reset();
      queueMicrotask(() => window.dispatchEvent(new CustomEvent<MorseSignal>(MORSE_EASTER_EGG_EVENT, { detail: signal })));
      return;
    }

    const maxPulses = Math.max(...Object.values(SIGNAL_PATTERNS).map((pattern) => pattern.length));
    if (this.pulseDurations.length < maxPulses) return;
    this.pulseDurations.shift();
    this.pulseGapsAfter.shift();
  };

  readonly resetOnBlur = (): void => {
    this.reset();
  };

  private reset(): void {
    this.activePulse = undefined;
    this.pulseDurations = [];
    this.pulseGapsAfter = [];
    this.lastPulseReleasedAt = undefined;
  }
}

export const shiftMorseEasterEgg = new ShiftMorseEasterEgg();

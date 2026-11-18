export type MorseSignal = 'SOS' | 'WIN';

const MIN_DASH_TO_DOT_RATIO = 1.4;
const SIGNAL_PATTERNS: Record<MorseSignal, readonly boolean[]> = {
  SOS: [false, false, false, true, true, true, false, false, false],
  WIN: [false, true, true, false, false, true, false],
};

/** Shared timestamp and pulse-window bookkeeping for every Morse input context. */
export class MorsePulseRecorder {
  private pressStartedAt?: number;
  private lastPulseReleasedAt?: number;
  private readonly durations: number[] = [];
  private readonly gapsAfter: number[] = [];

  get pulseCount(): number {
    return this.durations.length;
  }

  getPulses(): { durations: number[]; gapsAfter: number[] } {
    return {
      durations: [...this.durations],
      gapsAfter: [...this.gapsAfter],
    };
  }

  startPress(timestamp: number): void {
    if (this.durations.length > 0 && this.lastPulseReleasedAt !== undefined) {
      const lastIndex = this.gapsAfter.length - 1;
      this.gapsAfter[lastIndex] = Math.max(0, timestamp - this.lastPulseReleasedAt);
    }
    this.pressStartedAt = timestamp;
  }

  finishPress(timestamp: number): boolean {
    if (this.pressStartedAt === undefined) return false;

    this.durations.push(Math.max(0, timestamp - this.pressStartedAt));
    this.gapsAfter.push(0);
    this.pressStartedAt = undefined;
    this.lastPulseReleasedAt = timestamp;
    return true;
  }

  discardOldestPulse(): void {
    this.durations.shift();
    this.gapsAfter.shift();
  }

  reset(): void {
    this.pressStartedAt = undefined;
    this.lastPulseReleasedAt = undefined;
    this.durations.length = 0;
    this.gapsAfter.length = 0;
  }
}

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

export function recognizeMorseSignal(
  durations: number[],
  gapsAfter: number[] = [],
): MorseSignal | undefined {
  for (const [signal, pattern] of Object.entries(SIGNAL_PATTERNS) as [MorseSignal, readonly boolean[]][]) {
    if (matchesPattern(durations, pattern)) return signal;
  }

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

export function getMorseWindowSize(): number {
  return Math.max(...Object.values(SIGNAL_PATTERNS).map((pattern) => pattern.length));
}

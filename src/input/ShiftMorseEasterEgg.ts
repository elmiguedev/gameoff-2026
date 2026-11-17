export const MORSE_EASTER_EGG_EVENT = 'shift-morse-easter-egg-win';

const REQUIRED_PULSES = 9;
const MIN_DASH_DOT_RATIO = 1.7;
const MAX_DASH_DOT_RATIO = 5;
const MAX_IN_GROUP_VARIATION = 2.5;

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function isRescueMorseSignal(durations: number[]): boolean {
  if (durations.length !== REQUIRED_PULSES || durations.some((duration) => !Number.isFinite(duration) || duration <= 0)) {
    return false;
  }

  const groups = [durations.slice(0, 3), durations.slice(3, 6), durations.slice(6, 9)];
  const groupAverages = groups.map(average);
  const [firstShort, long, lastShort] = groupAverages;
  if (firstShort === undefined || long === undefined || lastShort === undefined) return false;

  const firstRatio = long / firstShort;
  const lastRatio = long / lastShort;
  if (
    firstRatio < MIN_DASH_DOT_RATIO
    || firstRatio > MAX_DASH_DOT_RATIO
    || lastRatio < MIN_DASH_DOT_RATIO
    || lastRatio > MAX_DASH_DOT_RATIO
  ) {
    return false;
  }

  return groups.every((group, index) => {
    const groupAverage = groupAverages[index];
    if (!groupAverage) return false;
    return group.every((duration) => (
      duration >= groupAverage / MAX_IN_GROUP_VARIATION
      && duration <= groupAverage * MAX_IN_GROUP_VARIATION
    ));
  });
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

    if (this.pulseDurations.length < REQUIRED_PULSES) return;

    if (isRescueMorseSignal(this.pulseDurations)) {
      this.reset();
      queueMicrotask(() => window.dispatchEvent(new Event(MORSE_EASTER_EGG_EVENT)));
      return;
    }

    this.pulseDurations.shift();
  };

  readonly resetOnBlur = (): void => {
    this.reset();
  };

  private reset(): void {
    this.activePulse = undefined;
    this.pulseDurations = [];
  }
}

export const shiftMorseEasterEgg = new ShiftMorseEasterEgg();

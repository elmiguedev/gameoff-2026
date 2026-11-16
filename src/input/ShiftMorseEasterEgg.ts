export const MORSE_EASTER_EGG_EVENT = 'shift-morse-easter-egg-win';

const REQUIRED_PULSES = 9;
const MAX_PAUSE_MS = 6000;
const MIN_LONGER_PULSE_MS = 80;

export function isRescueMorseSignal(durations: number[]): boolean {
  const shortDurations = [...durations.slice(0, 3), ...durations.slice(6, 9)];
  const longDurations = durations.slice(3, 6);
  const shortAverage = shortDurations.reduce((sum, duration) => sum + duration, 0) / shortDurations.length;
  const longAverage = longDurations.reduce((sum, duration) => sum + duration, 0) / longDurations.length;

  return longAverage >= shortAverage * 1.25
    && longAverage - shortAverage >= MIN_LONGER_PULSE_MS;
}

interface ActivePulse {
  code: 'ShiftLeft' | 'ShiftRight';
  startedAt: number;
  modified: boolean;
}

export default class ShiftMorseEasterEgg {
  private activePulse?: ActivePulse;
  private lastPulseAt?: number;
  private pulseDurations: number[] = [];

  readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (event.repeat) return;

      if (this.activePulse) {
        this.reset();
        return;
      }

      if (this.lastPulseAt !== undefined && event.timeStamp - this.lastPulseAt > MAX_PAUSE_MS) {
        this.reset();
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
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;

    const pulse = this.activePulse;
    if (!pulse || pulse.code !== event.code) return;

    this.activePulse = undefined;
    if (pulse.modified) {
      this.reset();
      return;
    }

    this.pulseDurations.push(Math.max(0, event.timeStamp - pulse.startedAt));
    this.lastPulseAt = event.timeStamp;

    if (this.pulseDurations.length < REQUIRED_PULSES) return;

    if (isRescueMorseSignal(this.pulseDurations)) {
      this.reset();
      queueMicrotask(() => window.dispatchEvent(new Event(MORSE_EASTER_EGG_EVENT)));
      return;
    }

    this.reset();
  };

  readonly resetOnBlur = (): void => {
    this.reset();
  };

  private reset(): void {
    this.activePulse = undefined;
    this.lastPulseAt = undefined;
    this.pulseDurations = [];
  }
}

import {
  getMorseWindowSize,
  MorsePulseRecorder,
  recognizeMorseSignal,
  type MorseSignal,
} from './MorseSignal';

export { recognizeMorseSignal, isRescueMorseSignal } from './MorseSignal';
export type { MorseSignal } from './MorseSignal';

export const MORSE_SIGNAL_EVENT = 'morse-signal';

interface ActivePulse {
  code: 'ShiftLeft' | 'ShiftRight';
  modified: boolean;
}

export default class MorseInputComponent {
  private enabled = false;
  private activePulse?: ActivePulse;
  private readonly recorder = new MorsePulseRecorder();

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
        modified: false,
      };
      this.recorder.startPress(event.timeStamp);
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

    this.recorder.finishPress(event.timeStamp);

    const pulses = this.recorder.getPulses();
    const signal = recognizeMorseSignal(pulses.durations, pulses.gapsAfter);
    if (signal) {
      this.reset();
      queueMicrotask(() => window.dispatchEvent(new CustomEvent<MorseSignal>(MORSE_SIGNAL_EVENT, { detail: signal })));
      return;
    }

    if (this.recorder.pulseCount < getMorseWindowSize()) return;
    this.recorder.discardOldestPulse();
  };

  readonly resetOnBlur = (): void => {
    this.reset();
  };

  private reset(): void {
    this.activePulse = undefined;
    this.recorder.reset();
  }
}

export const morseInput = new MorseInputComponent();

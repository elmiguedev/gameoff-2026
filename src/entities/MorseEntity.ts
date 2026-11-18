import {
  MorsePulseRecorder,
  recognizeMorseSignal,
  type MorseSignal,
} from '../input/MorseSignal';
import type { TranslationKey } from '../i18n/i18n';

const PULSE_COUNT = 9;
const RESCUE_SIGNAL: MorseSignal = 'SOS';
const ATTEMPT_HINTS = [
  'copy.nos-estamos-hundiendo-necesitamos-ayuda',
  'copy.necesitamos-ayudaaaaa',
  'copy.la-nave-recibio-nueve-pulsos-no-todos-transmitieron-lo',
  'copy.podes-mantener-shift-para-una-raya-o-soltarlo-y-dejar',
  'copy.una-senal-se-distingue-por-su-ritmo-no-solo-por-la-can',
] as const satisfies readonly TranslationKey[];

type MorseEvent = 'hint' | 'rescue';
type MorseListener = ((key: TranslationKey) => void) | (() => void);

export default class MorseEntity {
  private readonly listeners = new Map<MorseEvent, Set<MorseListener>>();
  private readonly recorder = new MorsePulseRecorder();
  private attempts = 0;
  private pulsesSinceHint = 0;

  handleShiftDown(event: KeyboardEvent): void {
    this.recorder.startPress(event.timeStamp);
  }

  handleShiftUp(event: KeyboardEvent): void {
    if (!this.recorder.finishPress(event.timeStamp)) return;
    this.pulsesSinceHint += 1;
    if (this.recorder.pulseCount > PULSE_COUNT) {
      this.recorder.discardOldestPulse();
    }

    if (this.recorder.pulseCount < PULSE_COUNT) return;

    const pulses = this.recorder.getPulses();
    const signal = recognizeMorseSignal(pulses.durations, pulses.gapsAfter);
    if (signal === RESCUE_SIGNAL) {
      this.emit('rescue');
      return;
    }

    if (this.pulsesSinceHint >= PULSE_COUNT) {
      this.pulsesSinceHint = 0;
      this.showAttemptHint();
    }
  }

  reset(): void {
    this.recorder.reset();
    this.attempts = 0;
    this.pulsesSinceHint = 0;
  }

  on(event: 'hint', listener: (key: TranslationKey) => void): void;
  on(event: 'rescue', listener: () => void): void;
  on(event: MorseEvent, listener: MorseListener): void {
    const listeners = this.listeners.get(event) ?? new Set<MorseListener>();
    listeners.add(listener);
    this.listeners.set(event, listeners);
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }

  private showAttemptHint(): void {
    this.attempts += 1;
    const hintKey = ATTEMPT_HINTS[Math.min(this.attempts - 1, ATTEMPT_HINTS.length - 1)];
    if (hintKey) this.emit('hint', hintKey);
  }

  private emit(event: 'hint', value: TranslationKey): void;
  private emit(event: 'rescue'): void;
  private emit(event: MorseEvent, value?: string): void {
    this.listeners.get(event)?.forEach((listener) => {
      if (event === 'hint') (listener as (key: TranslationKey) => void)(value as TranslationKey);
      else (listener as () => void)();
    });
  }
}

import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { isRescueMorseSignal } from '../../input/ShiftMorseEasterEgg';

const PULSE_COUNT = 9;

export default class MorseRadioRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private pressStartedAt?: number;
  private pulseDurations: number[] = [];
  private pulseGapsAfter: number[] = [];
  private lastPulseReleasedAt?: number;
  private attempts = 0;
  private pulsesSinceHint = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.pressStartedAt = undefined;
    this.pulseDurations = [];
    this.pulseGapsAfter = [];
    this.lastPulseReleasedAt = undefined;
    this.attempts = 0;
    this.pulsesSinceHint = 0;
    this.addRoomObject(this.scene.add.image(640, 350, 'ship').setDisplaySize(480, 320));
  }

  protected onShiftDown(_side: ShiftSide, event: KeyboardEvent): void {
    if (this.pulseDurations.length > 0 && this.lastPulseReleasedAt !== undefined) {
      const lastIndex = this.pulseGapsAfter.length - 1;
      this.pulseGapsAfter[lastIndex] = Math.max(0, event.timeStamp - this.lastPulseReleasedAt);
    }
    this.pressStartedAt = event.timeStamp;
  }

  protected override onShiftUp(_side: ShiftSide, event: KeyboardEvent): void {
    if (this.pressStartedAt === undefined) return;

    const duration = Math.max(0, event.timeStamp - this.pressStartedAt);
    this.pressStartedAt = undefined;
    this.pulseDurations.push(duration);
    this.pulseGapsAfter.push(0);
    this.lastPulseReleasedAt = event.timeStamp;
    this.pulsesSinceHint += 1;
    if (this.pulseDurations.length > PULSE_COUNT) {
      this.pulseDurations.shift();
      this.pulseGapsAfter.shift();
    }

    if (this.pulseDurations.length < PULSE_COUNT) return;

    if (isRescueMorseSignal(this.pulseDurations, this.pulseGapsAfter)) {
      this.complete('Recibido. El barco está a salvo. La tripulación sigue sin aportar mucho.');
      return;
    }

    if (this.pulsesSinceHint >= PULSE_COUNT) {
      this.pulsesSinceHint = 0;
      this.showAttemptHint();
    }
  }

  private showAttemptHint(): void {
    this.attempts += 1;
    if (this.attempts === 1) {
      this.showHint('Nos estamos hundiendo. Necesitamos ayuda.');
    } else if (this.attempts === 2) {
      this.showHint('¡Necesitamos ayudaaaaa!');
    } else if (this.attempts === 3) {
      this.showHint('La nave recibió nueve pulsos. No todos transmitieron lo mismo.');
    } else if (this.attempts === 4) {
      this.showHint('Podés mantener Shift para una raya o soltarlo y dejar una pausa más larga.');
    } else {
      this.showHint('Una señal se distingue por su ritmo, no solo por la cantidad de pulsos.');
    }
  }

}

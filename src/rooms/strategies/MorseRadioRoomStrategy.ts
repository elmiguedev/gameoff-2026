import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { isRescueMorseSignal } from '../../input/ShiftMorseEasterEgg';

const PULSE_COUNT = 9;

export default class MorseRadioRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private pressStartedAt?: number;
  private pulseDurations: number[] = [];
  private attempts = 0;
  private elapsed = 0;
  private hintLevel = 0;
  private radioLamp?: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.pressStartedAt = undefined;
    this.pulseDurations = [];
    this.attempts = 0;
    this.elapsed = 0;
    this.hintLevel = 0;

    this.drawRadioAndBoat();
    this.radioLamp = this.addRoomObject(
      this.scene.add.circle(590, 315, 7, 0xffffff).setStrokeStyle(1, 0x777777),
    );
    this.showHint('El barco tiene problemas. La radio funciona. La tripulación, por ahora, no está aportando mucho.');
  }

  protected onShiftDown(_side: ShiftSide, event: KeyboardEvent): void {
    this.pressStartedAt = event.timeStamp;
    this.radioLamp?.setFillStyle(0x111111);
  }

  protected override onShiftUp(_side: ShiftSide, event: KeyboardEvent): void {
    if (this.pressStartedAt === undefined) return;

    const duration = Math.max(0, event.timeStamp - this.pressStartedAt);
    this.pressStartedAt = undefined;
    this.radioLamp?.setFillStyle(0xffffff);
    this.pulseDurations.push(duration);

    if (this.pulseDurations.length < PULSE_COUNT) return;

    if (isRescueMorseSignal(this.pulseDurations)) {
      this.complete('Recibido. El barco está a salvo. La tripulación sigue sin aportar mucho.');
      return;
    }

    this.resetSignal();
    this.showAttemptHint();
  }

  override update(delta: number): void {
    this.elapsed += delta;
    if (this.hintLevel < 1 && this.elapsed >= 8000) {
      this.hintLevel = 1;
      this.showHint('No hace falta hablar el mismo idioma.');
    } else if (this.hintLevel < 2 && this.elapsed >= 17000) {
      this.hintLevel = 2;
      this.showHint('Mandá una señal reconocible.');
    } else if (this.hintLevel < 3 && this.elapsed >= 28000) {
      this.hintLevel = 3;
      this.showHint('Tres cortas, tres largas, tres cortas.');
    }
  }

  private showAttemptHint(): void {
    this.attempts += 1;
    if (this.attempts === 1) {
      this.showHint('No hace falta hablar el mismo idioma.');
    } else if (this.attempts === 2) {
      this.showHint('Mandá una señal reconocible.');
    } else {
      this.showHint('Tres cortas, tres largas, tres cortas.');
    }
  }

  private resetSignal(): void {
    this.pulseDurations = [];
    this.radioLamp?.setFillStyle(0xffffff);
  }

  private drawRadioAndBoat(): void {
    const illustration = this.addRoomObject(this.scene.add.graphics());
    illustration.lineStyle(3, 0x111111, 1);
    illustration.strokeRoundedRect(500, 285, 185, 120, 10);
    illustration.strokeRect(525, 310, 42, 38);
    illustration.strokeCircle(628, 345, 24);
    illustration.beginPath();
    illustration.moveTo(546, 280);
    illustration.lineTo(530, 240);
    illustration.lineTo(552, 230);
    illustration.strokePath();

    illustration.beginPath();
    illustration.moveTo(735, 393);
    illustration.lineTo(895, 393);
    illustration.lineTo(865, 430);
    illustration.lineTo(760, 430);
    illustration.closePath();
    illustration.moveTo(810, 390);
    illustration.lineTo(810, 330);
    illustration.lineTo(855, 390);
    illustration.strokePath();
    illustration.lineStyle(1, 0xaaaaaa, 1);
    illustration.beginPath();
    illustration.moveTo(720, 450);
    illustration.lineTo(905, 450);
    illustration.moveTo(750, 461);
    illustration.lineTo(880, 461);
    illustration.strokePath();
  }
}

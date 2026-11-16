import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

const HOLD_TO_OPEN_MS = 2400;
const DIAL_X = 640;
const DIAL_Y = 360;
const DIAL_RADIUS = 66;

export default class HoldShiftRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private heldDuration = 0;
  private dial?: Phaser.GameObjects.Graphics;
  private hasShownTapHint = false;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.heldDuration = 0;
    this.hasShownTapHint = false;
    this.drawDoorAndClock();
    this.addLabel(640, 205, 'La puerta espera.', 18, '#555555');
    this.dial = this.addRoomObject(this.scene.add.graphics());
    this.drawDial(0);
    this.addLabel(640, 475, 'Sin apuro.', 14, '#888888');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.heldDuration = 0;
  }

  protected override onShiftUp(_side: ShiftSide): void {
    if (this.heldDuration > 0 && this.heldDuration < HOLD_TO_OPEN_MS && !this.hasShownTapHint) {
      this.hasShownTapHint = true;
      this.showHint('La puerta alcanzó a notarlo. No parece haber sido suficiente.');
    }
    this.heldDuration = 0;
    this.drawDial(0);
  }

  override update(delta: number): void {
    if (!this.isShiftHeld()) return;

    this.heldDuration = Math.min(HOLD_TO_OPEN_MS, this.heldDuration + delta);
    const progress = this.heldDuration / HOLD_TO_OPEN_MS;
    this.drawDial(progress);

    if (progress >= 1) {
      this.complete('¡Eso era! Mantener una tecla. Una hazaña que recordaré durante, como mínimo, tres segundos.');
    }
  }

  private drawDial(progress: number): void {
    const dial = this.dial;
    if (!dial) return;

    dial.clear();
    dial.lineStyle(2, 0x222222, 1);
    dial.strokeCircle(DIAL_X, DIAL_Y, DIAL_RADIUS);

    if (progress <= 0) return;
    dial.lineStyle(7, 0x222222, 1);
    dial.beginPath();
    dial.arc(DIAL_X, DIAL_Y, DIAL_RADIUS - 1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    dial.strokePath();
  }

  private drawDoorAndClock(): void {
    const illustration = this.addRoomObject(this.scene.add.graphics());
    illustration.lineStyle(3, 0x111111, 1);
    illustration.strokeRect(475, 250, 330, 270);
    illustration.strokeCircle(770, 390, 6);
    illustration.strokeCircle(850, 290, 25);
    illustration.beginPath();
    illustration.moveTo(850, 290);
    illustration.lineTo(850, 273);
    illustration.moveTo(850, 290);
    illustration.lineTo(863, 298);
    illustration.strokePath();
  }

  private addLabel(x: number, y: number, text: string, fontSize: number, color: string): void {
    this.addRoomObject(this.scene.add.text(x, y, text, {
      color,
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: `${fontSize}px`,
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));
  }
}

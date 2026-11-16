import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

const PRESS_GAIN = 0.035;
const DECAY_PER_SECOND = 0.28;
const DECAY_GRACE_MS = 250;
const METER_RADIUS = 220;

export default class AlternatingShiftRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private previousSide?: ShiftSide;
  private charge = 0;
  private timeSinceLastPress = 0;
  private hasStartedCharging = false;
  private meter?: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.previousSide = undefined;
    this.charge = 0;
    this.timeSinceLastPress = 0;
    this.hasStartedCharging = false;
    this.meter = this.addRoomObject(this.scene.add.graphics());
    this.drawMeter();
  }

  protected onShiftDown(side: ShiftSide): void {
    if (side === this.previousSide) {
      return;
    }

    this.previousSide = side;
    this.charge = Math.min(1, this.charge + PRESS_GAIN);
    this.timeSinceLastPress = 0;
    this.hasStartedCharging = true;
    this.drawMeter();

    if (this.charge >= 1) {
      this.complete('Ah, trabajo en equipo. Los dos Shifts encontraron algo en común.');
    }
  }

  override update(delta: number): void {
    if (!this.hasStartedCharging || this.charge <= 0) return;

    this.timeSinceLastPress += delta;
    if (this.timeSinceLastPress <= DECAY_GRACE_MS) return;

    this.charge = Math.max(0, this.charge - DECAY_PER_SECOND * delta / 1000);
    if (this.charge <= 0) this.hasStartedCharging = false;
    this.drawMeter();
  }

  private drawMeter(): void {
    const meter = this.meter;
    if (!meter) return;

    meter.clear();
    if (this.charge <= 0) return;

    meter.fillStyle(0x111111, 1);
    meter.fillCircle(640, 360, METER_RADIUS * this.charge);
  }
}

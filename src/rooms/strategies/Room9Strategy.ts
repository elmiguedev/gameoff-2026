import type Phaser from 'phaser';
import ChargingCircleEntity from '../../entities/ChargingCircleEntity';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

const PRESS_GAIN = 0.028;
const DECAY_PER_SECOND = 0.36;
const DECAY_GRACE_MS = 150;

export default class Room9Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private previousSide?: ShiftSide;
  private charge = 0;
  private timeSinceLastPress = 0;
  private hasStartedCharging = false;
  private meter?: ChargingCircleEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.previousSide = undefined;
    this.charge = 0;
    this.timeSinceLastPress = 0;
    this.hasStartedCharging = false;
    this.meter = this.addRoomObject(new ChargingCircleEntity(this.scene));
  }

  protected onShiftDown(side: ShiftSide): void {
    if (side === this.previousSide) {
      return;
    }

    this.previousSide = side;
    this.charge = Math.min(1, this.charge + PRESS_GAIN);
    this.timeSinceLastPress = 0;
    this.hasStartedCharging = true;
    this.meter?.setCharge(this.charge);

    if (this.charge >= 1) {
      this.complete('copy.ah-trabajo-en-equipo-los-dos-shifts-encontraron-algo-e');
    }
  }

  override update(delta: number): void {
    if (!this.hasStartedCharging || this.charge <= 0) return;

    this.timeSinceLastPress += delta;
    if (this.timeSinceLastPress <= DECAY_GRACE_MS) {
      return;
    }

    this.charge = Math.max(0, this.charge - DECAY_PER_SECOND * delta / 1000);
    if (this.charge <= 0) {
      this.hasStartedCharging = false;
      this.meter?.clear();
    }
    else this.meter?.updateCharge(this.charge);
  }

  override exit(): void {
    this.meter = undefined;
    super.exit();
  }
}

import RoomBaseStrategy, { type ShiftSide } from './RoomBaseStrategy';
import type { RoomActions, RoomProgress } from './RoomBaseStrategy';
import type Phaser from 'phaser';
import ShiftEntity from '../../entities/ShiftEntity';

export default class Room2Strategy extends RoomBaseStrategy {
  readonly prompt = '';
  private shiftKey?: ShiftEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 350, 520, 520 / 3));
  }

  protected onShiftDown(side: ShiftSide): void {
    if (side === this.progress.firstShiftSide) {
      this.showHint('copy.no-hay-un-solo-shift');
      return;
    }

    this.complete('copy.la-puerta-cedio-no-te-acostumbres-no-suele-pasar-cuand');
  }

  protected override onShiftVisualDown(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, true);
  }

  protected override onShiftVisualUp(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, false);
  }

  protected override onShiftHeldAtEntry(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, true);
  }
}

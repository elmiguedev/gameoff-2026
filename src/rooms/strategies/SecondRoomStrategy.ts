import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type { RoomActions, RoomProgress } from './RoomStrategy';
import type Phaser from 'phaser';
import ShiftEntity from '../../entities/ShiftEntity';

export default class SecondRoomStrategy extends RoomStrategy {
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
      this.showHint('No hay un solo Shift…');
      return;
    }

    this.complete('La puerta cedió. No te acostumbres: no suele pasar cuando hacés lo mismo dos veces.');
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

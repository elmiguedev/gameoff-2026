import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type { RoomActions, RoomProgress } from './RoomStrategy';
import type Phaser from 'phaser';
import ShiftEntity from '../../entities/ShiftEntity';

export default class FirstRoomStrategy extends RoomStrategy {
  readonly prompt = '';
  private shiftKey?: ShiftEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 350, 520, 520 / 3));
  }

  protected onShiftDown(side: ShiftSide): void {
    this.progress.firstShiftSide = side;
    this.complete('Bien. Apretar Shift funcionaba. De nada por la complicación.');
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

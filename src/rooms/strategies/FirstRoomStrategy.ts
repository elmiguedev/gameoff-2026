import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type { RoomActions, RoomProgress } from './RoomStrategy';
import type Phaser from 'phaser';

export default class FirstRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const logo = this.scene.add.image(640, 350, 'shift-logo');
    logo.setDisplaySize(520, 520 / 3);
    this.addRoomObject(logo);
  }

  protected onShiftDown(side: ShiftSide): void {
    this.progress.firstShiftSide = side;
    this.complete('Bien. Apretar Shift funcionaba. De nada por la complicación.');
  }
}

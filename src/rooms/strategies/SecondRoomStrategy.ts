import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type { RoomActions, RoomProgress } from './RoomStrategy';
import type Phaser from 'phaser';

export default class SecondRoomStrategy extends RoomStrategy {
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
    if (side === this.progress.firstShiftSide) {
      this.showHint('No hay un solo Shift…');
      return;
    }

    this.complete('Eso. Dos Shifts. Una puerta. Y ahora sí, un mínimo de aprendizaje.');
  }
}

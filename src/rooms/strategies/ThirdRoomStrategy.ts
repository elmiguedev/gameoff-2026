import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ThirdRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const shiftLogo = this.scene.add.image(640, 350, 'shift-logo');
    shiftLogo
      .setDisplaySize(520, 520 / 3)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHint('¿En serio?'));
    this.addRoomObject(shiftLogo);

    const mouseCursor = this.scene.add.image(799, 399, 'mouse-cursor');
    mouseCursor.setDisplaySize(78, 71);
    this.addRoomObject(mouseCursor);
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.complete('Bien. Era una tecla dibujada. El dibujo estaba haciendo su mejor esfuerzo.');
  }
}

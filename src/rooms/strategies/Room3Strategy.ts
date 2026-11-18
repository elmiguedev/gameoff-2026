import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room3Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const shiftLogo = this.scene.add.image(640, 350, 'shift-logo');
    shiftLogo
      .setDisplaySize(520, 520 / 3)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHint('copy.en-serio'));
    this.addRoomObject(shiftLogo);

    const mouseCursor = this.scene.add.image(799, 399, 'mouse-cursor');
    mouseCursor.setDisplaySize(78, 71);
    this.addRoomObject(mouseCursor);
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.complete('copy.bien-era-una-tecla-dibujada-el-dibujo-estaba-haciendo');
  }
}

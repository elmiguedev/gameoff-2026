import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ThirdRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const keycap = this.addRoomObject(
      this.scene.add.rectangle(640, 350, 360, 120, 0xffffff).setStrokeStyle(3, 0x111111),
    );

    keycap
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHint('¿En serio?'));

    this.addRoomObject(
      this.scene
        .add.text(640, 350, 'SHIFT', {
          color: '#111111',
          fontFamily: 'IBM Plex Mono, Menlo, monospace',
          fontSize: '24px',
        })
        .setOrigin(0.5)
        .setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );

    const cursor = this.scene.add.graphics();
    cursor.fillStyle(0xffffff, 1);
    cursor.lineStyle(3, 0x111111, 1);
    cursor.beginPath();
    cursor.moveTo(0, 0);
    cursor.lineTo(0, 34);
    cursor.lineTo(9, 25);
    cursor.lineTo(16, 39);
    cursor.lineTo(22, 36);
    cursor.lineTo(15, 23);
    cursor.lineTo(28, 23);
    cursor.closePath();
    cursor.fillPath();
    cursor.strokePath();
    cursor.setPosition(790, 390);
    this.addRoomObject(cursor);
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.complete('Bien. Era una tecla dibujada. El dibujo estaba haciendo su mejor esfuerzo.');
  }
}

import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ClickableShiftRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addRoomObject(this.scene.add.rectangle(640, 350, 410, 170, 0xffffff).setStrokeStyle(2, 0xaaaaaa));
    const key = this.addRoomObject(
      this.scene.add.rectangle(640, 350, 360, 120, 0xffffff)
        .setStrokeStyle(2, 0x111111)
        .setInteractive({ useHandCursor: true }),
    );
    this.addRoomObject(this.scene.add.text(640, 350, 'SHIFT', {
      color: '#111111',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '24px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));

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

    key.on('pointerdown', () => this.activateKey());
    this.showHint('Qué familiar. La tecnología avanza: ahora la tecla tiene una placa.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Tab') return;

    event.preventDefault();
    this.showHint('Tab no. Esta sala ya tiene suficientes teclas con problemas de identidad.');
  }

  private activateKey(): void {
    this.complete('¡Ah, cierto! Era un botón. Bien visto… cuando finalmente lo viste.');
  }
}

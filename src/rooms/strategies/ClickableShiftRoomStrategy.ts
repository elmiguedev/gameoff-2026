import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ClickableShiftRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const shiftLogo = this.scene.add.image(640, 350, 'shift-logo');
    shiftLogo
      .setDisplaySize(520, 520 / 3)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.activateKey());
    this.addRoomObject(shiftLogo);

    const mouseCursor = this.scene.add.image(799, 399, 'mouse-cursor');
    mouseCursor.setDisplaySize(78, 71);
    this.addRoomObject(mouseCursor);

    this.showHint('Qué familiar. Esta vez el dibujo espera que lo pulses.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.showHint('¿Shift? ¿En serio? Esta vez hasta el dibujo te estaba señalando qué hacer.');
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Tab') return;

    event.preventDefault();
    this.showHint('Tab no. Esta sala ya tiene suficientes teclas con problemas de identidad.');
  }

  private activateKey(): void {
    this.complete('¡Ah, cierto! Era un botón. Bien visto… cuando finalmente lo viste.');
  }
}

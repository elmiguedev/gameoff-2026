import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ShiftTabRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private backspaceAttempts = 0;
  private tabAttempts = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.backspaceAttempts = 0;
    this.tabAttempts = 0;

    if (this.progress.completedRooms.has(8)) {
      this.addRoomObject(this.scene.add.image(640, 350, 'exit-icon').setDisplaySize(360, 240));
      this.complete('Lo lograste: encontraste el camino de vuelta. Cuando quieras, seguimos.');
      return;
    }

    this.showHint('El camino hasta acá parece bastante convencido de una sola dirección.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.showHint('No iba a ser tan sencillo esta vez. Shift solo no hace milagros.');
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      event.preventDefault();
      this.backspaceAttempts += 1;
      if (this.backspaceAttempts === 1) {
        this.showHint('Retroceso. Un método bastante literal. Pero no es la única forma de volver.');
      } else if (this.backspaceAttempts === 3) {
        this.showHint('Insistir con Retroceso no va a cambiar la dirección del recorrido.');
      }
      return;
    }

    if (event.code === 'Tab') {
      this.tabAttempts += 1;
      if (this.tabAttempts === 1) {
        this.showHint('Tab suele avanzar entre opciones. No siempre hace falta avanzar.');
      } else if (this.tabAttempts === 2) {
        this.showHint('Tab solo no alcanza para volver. Por suerte, el teclado acepta compañía.');
      } else if (this.tabAttempts === 3) {
        this.showHint('Shift puede cambiar el sentido de Tab. No lo digo por nada.');
      }
    }
  }

  protected override onShiftTab(): void {
    this.progress.roomNineReturnPending = true;
    this.complete('Volviste. Sabía que en algún momento ibas a querer revisar tus decisiones.');
  }
}

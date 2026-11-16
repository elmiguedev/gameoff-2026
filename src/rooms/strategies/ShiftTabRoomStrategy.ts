import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ShiftTabRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private elapsed = 0;
  private hintLevel = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.elapsed = 0;
    this.hintLevel = 0;

    if (this.progress.completedRooms.has(9)) {
      this.complete('Volviste a esta. Bien: esta vez sí quedó registrado. Cuando quieras, seguimos.');
      return;
    }

    this.showHint('El camino hasta acá parece bastante convencido de una sola dirección.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onShiftTab(): void {
    this.progress.roomNineReturnPending = true;
    this.complete('Volviste. Sabía que en algún momento ibas a querer revisar tus decisiones.');
  }

  override update(delta: number): void {
    this.elapsed += delta;

    if (this.elapsed >= 12000 && this.hintLevel < 2) {
      this.hintLevel = 2;
      this.showHint('Hay combinaciones que no te llevan hacia adelante.');
    } else if (this.elapsed >= 6000 && this.hintLevel < 1) {
      this.hintLevel = 1;
      this.showHint('Tab suele avanzar entre opciones. No siempre hace falta avanzar.');
    }
  }
}

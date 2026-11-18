import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import ShiftEntity from '../../entities/ShiftEntity';
import { getRoomNarration } from '../../content/roomNarration';

export default class FourteenthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private hasTriedShift = false;
  private shiftKey?: ShiftEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.hasTriedShift = false;
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 350, 520, 520 / 3));

    this.showHint(getRoomNarration('normal', 14) ?? 'Llegaste al final. Felicitaciones.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    if (!this.hasTriedShift) {
      this.hasTriedShift = true;
      this.showHint('No pasó nada. Recordá que el teclado tiene más de una dirección.\nNo voy a enumerarlas.');
      return;
    }

    this.showHint('Sigue sin pasar nada. Espero que no se te ocurra volver; sería una forma bastante predecible de salir.');
  }

  protected override onShiftVisualDown(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, true);
  }

  protected override onShiftVisualUp(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, false);
  }
}

import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';
import ShiftEntity from '../../entities/ShiftEntity';
import { getRoomNarration } from '../../content/roomNarration';

export default class Room14Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private hasTriedShift = false;
  private shiftKey?: ShiftEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.hasTriedShift = false;
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 350, 520, 520 / 3));

    this.showHint(getRoomNarration('normal', 14) ?? 'copy.llegaste-al-final-felicitaciones');
  }

  protected onShiftDown(_side: ShiftSide): void {
    if (!this.hasTriedShift) {
      this.hasTriedShift = true;
      this.showHint('copy.no-paso-nada-recorda-que-el-teclado-tiene-mas-de-una-d');
      return;
    }

    this.showHint('copy.sigue-sin-pasar-nada-espero-que-no-se-te-ocurra-volver');
  }

  protected override onShiftVisualDown(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, true);
  }

  protected override onShiftVisualUp(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, false);
  }
}

import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';
import ShiftEntity from '../../entities/ShiftEntity';
import TypographyEntity from '../../entities/TypographyEntity';

export default class Room12Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private shiftKey?: ShiftEntity;
  private readonly shiftsHeldAtEntry = new Set<ShiftSide>();
  private failedPressAttempts = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.shiftsHeldAtEntry.clear();
    this.failedPressAttempts = 0;
    this.addRoomObject(new TypographyEntity(this.scene, 640, 235, 'copy.soltar-solo-soltar', 'room-instruction'));
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 390, 520, 520 / 3));
    this.showHint('copy.esta-sala-no-vio-el-principio-de-la-accion');
  }

  protected override onShiftHeldAtEntry(side: ShiftSide): void {
    this.shiftsHeldAtEntry.add(side);
    this.shiftKey?.setSidePressed(side, true);
  }

  protected onShiftDown(side: ShiftSide): void {
    if (!this.shiftsHeldAtEntry.has(side)) this.failedPressAttempts += 1;
  }

  protected override onShiftVisualDown(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, true);
  }

  protected override onShiftVisualUp(side: ShiftSide): void {
    this.shiftKey?.setSidePressed(side, false);
  }

  protected override onShiftUp(side: ShiftSide): void {
    if (!this.shiftsHeldAtEntry.delete(side)) {
      if (this.failedPressAttempts >= 3) {
        this.showHint('copy.te-dije-que-soltaras-no-que-presionaras-y-soltaras-hay');
      } else {
        this.showHint('copy.la-tecla-se-libero-pero-esta-sala-no-vio-cuando-empezo');
      }
      return;
    }

    this.complete('copy.ahi-esta-esta-vez-entraste-con-algo-todavia-apretado');
  }
}

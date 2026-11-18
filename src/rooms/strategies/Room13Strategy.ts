import type Phaser from 'phaser';
import MorseEntity from '../../entities/MorseEntity';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room13Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private morseEntity?: MorseEntity;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.createMorseEntity();
    this.addRoomObject(this.scene.add.image(640, 350, 'ship').setDisplaySize(480, 320));
  }

  protected onShiftDown(_side: ShiftSide, event: KeyboardEvent): void {
    this.morseEntity?.handleShiftDown(event);
  }

  protected override onShiftUp(_side: ShiftSide, event: KeyboardEvent): void {
    this.morseEntity?.handleShiftUp(event);
  }

  override exit(): void {
    this.morseEntity?.removeAllListeners();
    this.morseEntity?.reset();
    this.morseEntity = undefined;
    super.exit();
  }

  private createMorseEntity(): void {
    this.morseEntity = new MorseEntity();
    this.morseEntity.on('hint', (key) => this.showHint(key));
    this.morseEntity.on('rescue', () => {
      this.complete('copy.recibido-el-barco-esta-a-salvo-la-tripulacion-sigue-si');
    });
  }
}

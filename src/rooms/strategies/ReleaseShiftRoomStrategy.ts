import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class ReleaseShiftRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private indicator?: Phaser.GameObjects.Text;
  private readonly shiftsHeldAtEntry = new Set<ShiftSide>();

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.shiftsHeldAtEntry.clear();
    this.addRoomObject(this.scene.add.rectangle(640, 370, 230, 330, 0xffffff).setStrokeStyle(3, 0x111111));
    this.indicator = this.addRoomObject(this.scene.add.text(640, 365, 'SHIFT: LIBERADO', {
      color: '#777777',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '18px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));
    this.showHint('Esta sala no vio el principio de la acción.');
  }

  protected override onShiftHeldAtEntry(side: ShiftSide): void {
    this.shiftsHeldAtEntry.add(side);
    this.indicator?.setText('SHIFT: APRETADO');
    this.indicator?.setColor('#111111');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onShiftUp(_side: ShiftSide): void {
    this.indicator?.setText('SHIFT: LIBERADO');
    this.indicator?.setColor('#777777');

    if (!this.shiftsHeldAtEntry.delete(_side)) {
      this.showHint('La tecla se liberó. Pero esta sala no vio cuándo empezó todo.');
      return;
    }

    this.complete('Ahí está. Esta vez entraste con algo todavía apretado.');
  }
}

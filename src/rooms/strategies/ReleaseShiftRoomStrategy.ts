import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import ShiftEntity from '../../entities/ShiftEntity';

export default class ReleaseShiftRoomStrategy extends RoomStrategy {
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
    this.addRoomObject(this.scene.add.text(640, 235, 'SOLTAR. SOLO SOLTAR.', {
      color: '#111111',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '24px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));
    this.shiftKey = this.addRoomObject(new ShiftEntity(this.scene, 640, 390, 520, 520 / 3));
    this.showHint('Esta sala no vio el principio de la acción.');
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
        this.showHint('Te dije que soltaras. No que presionaras y soltaras. Hay una diferencia, aunque sea sutil.');
      } else {
        this.showHint('La tecla se liberó. Pero esta sala no vio cuándo empezó todo.');
      }
      return;
    }

    this.complete('Ahí está. Esta vez entraste con algo todavía apretado.');
  }
}

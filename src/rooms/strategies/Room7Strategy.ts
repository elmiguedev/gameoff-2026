import type Phaser from 'phaser';
import SquareSelectionEntity, { type SquareSelection } from '../../entities/SquareSelectionEntity';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room7Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addRoomObject(new SquareSelectionEntity(this.scene, (selection) => {
      this.handleSelection(selection);
    }));
  }

  protected onShiftDown(_side: ShiftSide): void {}

  private handleSelection({ shiftHeld, clickCount, selectedCount }: SquareSelection): void {
    this.showNarratorComment(shiftHeld, clickCount);
    if (selectedCount === 6) {
      this.complete('copy.mira-vos-al-final-habia-lugar-para-todos');
    }
  }

  private showNarratorComment(shiftHeld: boolean, clickCount: number): void {
    if (shiftHeld) {
      this.showHint('copy.ah-esta-vez-guardaste-lo-anterior');
      return;
    }

    const comment = clickCount === 1
      ? 'copy.uno-decision-firme'
      : 'copy.veo-que-cambiaste-de-opinion';
    this.showHint(comment);
  }
}

import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type GameScene from '../../scenes/GameScene';
import type { RoomProgress } from './RoomStrategy';

export default class FirstRoomStrategy extends RoomStrategy {
  readonly prompt = 'SHIFT';

  constructor(scene: GameScene, progress: RoomProgress) {
    super(scene, progress);
  }

  protected onShiftDown(side: ShiftSide): void {
    this.progress.firstShiftSide = side;
    this.complete('Bien. Apretar Shift funcionaba. De nada por la complicación.');
  }
}

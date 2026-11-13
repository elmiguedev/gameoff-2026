import RoomStrategy, { type ShiftSide } from './RoomStrategy';
import type GameScene from '../../scenes/GameScene';
import type { RoomProgress } from './RoomStrategy';

export default class SecondRoomStrategy extends RoomStrategy {
  readonly prompt = 'SHIFT';

  constructor(scene: GameScene, progress: RoomProgress) {
    super(scene, progress);
  }

  protected onShiftDown(side: ShiftSide): void {
    if (side === this.progress.firstShiftSide) {
      this.showHint('No hay un solo Shift…');
      return;
    }

    this.complete('Eso. Dos Shifts. Una puerta. Y ahora sí, un mínimo de aprendizaje.');
  }
}

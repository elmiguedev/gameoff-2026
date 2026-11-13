import type GameScene from '../scenes/GameScene';
import FirstRoomStrategy from './strategies/FirstRoomStrategy';
import RoomStrategy, { type RoomProgress } from './strategies/RoomStrategy';
import SecondRoomStrategy from './strategies/SecondRoomStrategy';

export default class RoomFactory {
  static create(
    roomNumber: number,
    scene: GameScene,
    progress: RoomProgress,
  ): RoomStrategy | undefined {
    switch (roomNumber) {
      case 1:
        return new FirstRoomStrategy(scene, progress);
      case 2:
        return new SecondRoomStrategy(scene, progress);
      default:
        return undefined;
    }
  }
}

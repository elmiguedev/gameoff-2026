import type Phaser from 'phaser';
import Room1Strategy from './strategies/Room1Strategy';
import RoomBaseStrategy, { type RoomActions, type RoomProgress } from './strategies/RoomBaseStrategy';
import Room2Strategy from './strategies/Room2Strategy';
import Room3Strategy from './strategies/Room3Strategy';
import Room4Strategy from './strategies/Room4Strategy';
import Room5Strategy from './strategies/Room5Strategy';
import Room6Strategy from './strategies/Room6Strategy';
import Room7Strategy from './strategies/Room7Strategy';
import Room8Strategy from './strategies/Room8Strategy';
import Room10Strategy from './strategies/Room10Strategy';
import Room11Strategy from './strategies/Room11Strategy';
import Room12Strategy from './strategies/Room12Strategy';
import Room13Strategy from './strategies/Room13Strategy';
import Room9Strategy from './strategies/Room9Strategy';
import ControlRoomStrategy from './strategies/ControlRoomStrategy';
import Room14Strategy from './strategies/Room14Strategy';

export default class RoomFactory {
  static readonly roomCount = 14;

  static create(
    roomNumber: number,
    scene: Phaser.Scene,
    progress: RoomProgress,
    actions: RoomActions,
  ): RoomBaseStrategy | undefined {
    switch (roomNumber) {
      case 0:
        return new ControlRoomStrategy(scene, progress, actions);
      case 1:
        return new Room1Strategy(scene, progress, actions);
      case 2:
        return new Room2Strategy(scene, progress, actions);
      case 3:
        return new Room3Strategy(scene, progress, actions);
      case 4:
        return new Room4Strategy(scene, progress, actions);
      case 5:
        return new Room5Strategy(scene, progress, actions);
      case 6:
        return new Room6Strategy(scene, progress, actions);
      case 7:
        return new Room7Strategy(scene, progress, actions);
      case 8:
        return new Room8Strategy(scene, progress, actions);
      case 9:
        return new Room9Strategy(scene, progress, actions);
      case 10:
        return new Room10Strategy(scene, progress, actions);
      case 11:
        return new Room11Strategy(scene, progress, actions);
      case 12:
        return new Room12Strategy(scene, progress, actions);
      case 13:
        return new Room13Strategy(scene, progress, actions);
      case 14:
        return new Room14Strategy(scene, progress, actions);
      default:
        return undefined;
    }
  }
}

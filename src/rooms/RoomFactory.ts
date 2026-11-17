import type Phaser from 'phaser';
import FirstRoomStrategy from './strategies/FirstRoomStrategy';
import RoomStrategy, { type RoomActions, type RoomProgress } from './strategies/RoomStrategy';
import SecondRoomStrategy from './strategies/SecondRoomStrategy';
import ThirdRoomStrategy from './strategies/ThirdRoomStrategy';
import FourthRoomStrategy from './strategies/FourthRoomStrategy';
import FifthRoomStrategy from './strategies/FifthRoomStrategy';
import SixthRoomStrategy from './strategies/SixthRoomStrategy';
import SeventhRoomStrategy from './strategies/SeventhRoomStrategy';
import ShiftTabRoomStrategy from './strategies/ShiftTabRoomStrategy';
import TopDownMapRoomStrategy from './strategies/TopDownMapRoomStrategy';
import ClickableShiftRoomStrategy from './strategies/ClickableShiftRoomStrategy';
import ReleaseShiftRoomStrategy from './strategies/ReleaseShiftRoomStrategy';
import MorseRadioRoomStrategy from './strategies/MorseRadioRoomStrategy';
import AlternatingShiftRoomStrategy from './strategies/AlternatingShiftRoomStrategy';
import NarratorControlRoomStrategy from './strategies/NarratorControlRoomStrategy';

export default class RoomFactory {
  static readonly roomCount = 13;

  static create(
    roomNumber: number,
    scene: Phaser.Scene,
    progress: RoomProgress,
    actions: RoomActions,
  ): RoomStrategy | undefined {
    switch (roomNumber) {
      case 0:
        return new NarratorControlRoomStrategy(scene, progress, actions);
      case 1:
        return new FirstRoomStrategy(scene, progress, actions);
      case 2:
        return new SecondRoomStrategy(scene, progress, actions);
      case 3:
        return new ThirdRoomStrategy(scene, progress, actions);
      case 4:
        return new FourthRoomStrategy(scene, progress, actions);
      case 5:
        return new FifthRoomStrategy(scene, progress, actions);
      case 6:
        return new SixthRoomStrategy(scene, progress, actions);
      case 7:
        return new SeventhRoomStrategy(scene, progress, actions);
      case 8:
        return new ShiftTabRoomStrategy(scene, progress, actions);
      case 9:
        return new AlternatingShiftRoomStrategy(scene, progress, actions);
      case 10:
        return new TopDownMapRoomStrategy(scene, progress, actions);
      case 11:
        return new ClickableShiftRoomStrategy(scene, progress, actions);
      case 12:
        return new ReleaseShiftRoomStrategy(scene, progress, actions);
      case 13:
        return new MorseRadioRoomStrategy(scene, progress, actions);
      default:
        return undefined;
    }
  }
}

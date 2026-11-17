import Phaser from 'phaser';
import type { ShiftSide } from '../rooms/strategies/RoomStrategy';

export default class ShiftEntity extends Phaser.GameObjects.Image {
  private readonly pressedSides = new Set<ShiftSide>();

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, 'shift-up');
    this.setDisplaySize(width, height);
    scene.add.existing(this);
  }

  setSidePressed(side: ShiftSide, pressed: boolean): void {
    if (pressed) this.pressedSides.add(side);
    else this.pressedSides.delete(side);

    const texture = this.pressedSides.size > 0 ? 'shift-down' : 'shift-up';
    if (this.texture.key !== texture) this.setTexture(texture);
  }
}

import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

const GRID_COLUMNS = 3;
const GRID_ROWS = 2;
const SQUARE_SIZE = 72;
const SQUARE_GAP = 24;
const SQUARE_COUNT = GRID_COLUMNS * GRID_ROWS;

export default class SeventhRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private readonly squares: Phaser.GameObjects.Rectangle[] = [];
  private readonly selectedSquares = new Set<number>();
  private clickCount = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.selectedSquares.clear();
    this.squares.length = 0;
    this.clickCount = 0;

    const gridWidth = GRID_COLUMNS * SQUARE_SIZE + (GRID_COLUMNS - 1) * SQUARE_GAP;
    const gridHeight = GRID_ROWS * SQUARE_SIZE + (GRID_ROWS - 1) * SQUARE_GAP;
    const startX = 640 - gridWidth / 2 + SQUARE_SIZE / 2;
    const startY = 360 - gridHeight / 2 + SQUARE_SIZE / 2;

    for (let index = 0; index < SQUARE_COUNT; index += 1) {
      const column = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      const x = startX + column * (SQUARE_SIZE + SQUARE_GAP);
      const y = startY + row * (SQUARE_SIZE + SQUARE_GAP);
      const square = this.addRoomObject(
        this.scene.add
          .rectangle(x, y, SQUARE_SIZE, SQUARE_SIZE, 0xffffff)
          .setStrokeStyle(2, 0x111111)
          .setInteractive({ useHandCursor: true }),
      );

      square.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const shiftHeld = pointer.event instanceof MouseEvent && pointer.event.shiftKey;
        this.selectSquare(index, shiftHeld);
      });

      this.squares.push(square);
    }
  }

  protected onShiftDown(_side: ShiftSide): void {}

  private selectSquare(index: number, shiftHeld: boolean): void {
    if (shiftHeld) {
      this.selectedSquares.add(index);
    } else {
      this.selectedSquares.clear();
      this.selectedSquares.add(index);
    }

    this.clickCount += 1;
    this.updateSquareColors();
    this.showNarratorComment(shiftHeld);

    if (this.selectedSquares.size === SQUARE_COUNT) {
      this.complete('Mirá vos. Al final había lugar para todos.');
    }
  }

  private updateSquareColors(): void {
    this.squares.forEach((square, index) => {
      square.setFillStyle(this.selectedSquares.has(index) ? 0x111111 : 0xffffff);
    });
  }

  private showNarratorComment(shiftHeld: boolean): void {
    if (shiftHeld) {
      this.showHint('Ah. Esta vez guardaste lo anterior.');
      return;
    }

    const comment = this.clickCount === 1
      ? 'Uno. Decisión firme.'
      : 'Veo que cambiaste de opinión.';
    this.showHint(comment);
  }
}

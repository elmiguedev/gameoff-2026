import Phaser from 'phaser';

export interface SquareSelection {
  shiftHeld: boolean;
  clickCount: number;
  selectedCount: number;
}

const GRID_COLUMNS = 3;
const GRID_ROWS = 2;
const SQUARE_SIZE = 80;
const SQUARE_GAP = 24;
const SQUARE_COUNT = GRID_COLUMNS * GRID_ROWS;
const GRID_CENTER_Y = 330;
const CORNER_RADIUS = 8;

/** Owns the room 7 square grid, its visuals, and its pointer selection behavior. */
export default class SquareSelectionEntity extends Phaser.GameObjects.Container {
  private readonly squares: Phaser.GameObjects.Rectangle[] = [];
  private readonly selectedSquares = new Set<number>();
  private clickCount = 0;

  constructor(
    scene: Phaser.Scene,
    onSelection: (selection: SquareSelection) => void,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.createSquares(onSelection);
  }

  private createSquares(onSelection: (selection: SquareSelection) => void): void {
    const gridWidth = GRID_COLUMNS * SQUARE_SIZE + (GRID_COLUMNS - 1) * SQUARE_GAP;
    const gridHeight = GRID_ROWS * SQUARE_SIZE + (GRID_ROWS - 1) * SQUARE_GAP;
    const startX = 640 - gridWidth / 2 + SQUARE_SIZE / 2;
    const startY = GRID_CENTER_Y - gridHeight / 2 + SQUARE_SIZE / 2;

    for (let index = 0; index < SQUARE_COUNT; index += 1) {
      const column = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      const x = startX + column * (SQUARE_SIZE + SQUARE_GAP);
      const y = startY + row * (SQUARE_SIZE + SQUARE_GAP);
      const square = this.scene.add
        .rectangle(x, y, SQUARE_SIZE, SQUARE_SIZE, 0xffffff)
        .setRounded(CORNER_RADIUS)
        .setStrokeStyle(3, 0x111111)
        .setInteractive({ useHandCursor: true });

      square.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const shiftHeld = pointer.event instanceof MouseEvent && pointer.event.shiftKey;
        this.selectSquare(index, shiftHeld);
        onSelection({
          shiftHeld,
          clickCount: this.clickCount,
          selectedCount: this.selectedSquares.size,
        });
      });

      this.squares.push(square);
      this.add(square);
    }
  }

  private selectSquare(index: number, shiftHeld: boolean): void {
    if (shiftHeld) {
      this.selectedSquares.add(index);
    } else {
      this.selectedSquares.clear();
      this.selectedSquares.add(index);
    }

    this.clickCount += 1;
    this.squares.forEach((square, squareIndex) => {
      square.setFillStyle(this.selectedSquares.has(squareIndex) ? 0x111111 : 0xffffff);
    });
  }
}

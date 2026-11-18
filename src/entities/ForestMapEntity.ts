import Phaser from 'phaser';

const CELL_SIZE = 48;
const VIEW_COLUMNS = 9;
const VIEW_ROWS = 7;
const MAP_LEFT = 640 - (VIEW_COLUMNS * CELL_SIZE) / 2;
const MAP_TOP = 360 - (VIEW_ROWS * CELL_SIZE) / 2;

// Map legend: # = tree, . = walkable ground, P = player start, H = house.
// Keep every row the same width when editing the maze.
const MAP_LAYOUT = [
  '####...############',
  '######.#......#####',
  '######...##.#######',
  '###########.#######',
  '..#..#...#..#...#..',
  '######P......######',
  '####...#####.######',
  '##...#######....###',
  '####...##..####.###',
  '#####.#########..##',
  '#####.#########.###',
  '##########......###',
  '##########.########',
  '##########....#####',
  '#############.#####',
  '#############H#####',
];
const WORLD_ROWS = MAP_LAYOUT.length;
const WORLD_COLUMNS = MAP_LAYOUT[0]?.length ?? 0;

function findMapMarker(marker: 'P' | 'H'): { x: number; y: number } {
  for (let y = 0; y < WORLD_ROWS; y += 1) {
    const x = MAP_LAYOUT[y]?.indexOf(marker) ?? -1;
    if (x >= 0) return { x, y };
  }

  throw new Error(`Falta el marcador ${marker} en el mapa de la sala 10.`);
}

const PLAYER_START = findMapMarker('P');
const HOUSE = findMapMarker('H');
const TREE_CELLS = new Set<string>();
for (let y = 0; y < WORLD_ROWS; y += 1) {
  for (let x = 0; x < WORLD_COLUMNS; x += 1) {
    if (MAP_LAYOUT[y]?.[x] === '#') TREE_CELLS.add(`${x},${y}`);
  }
}

export type ForestMapMoveResult = 'blocked' | 'moved' | 'house';

/** Encapsulates the forest map, player, viewport, collision checks, and map shifting. */
export default class ForestMapEntity extends Phaser.GameObjects.Container {
  private readonly mapGraphics: Phaser.GameObjects.Graphics;
  private readonly mapObjectLayer: Phaser.GameObjects.Container;
  private readonly mapImages: Phaser.GameObjects.Image[] = [];
  private readonly player: Phaser.GameObjects.Image;
  private mapImageCursor = 0;
  private playerX = PLAYER_START.x;
  private playerY = PLAYER_START.y;
  private mapOffsetX = 0;
  private mapOffsetY = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.mapGraphics = scene.add.graphics();
    this.mapObjectLayer = scene.add.container(0, 0);
    this.player = scene.add.image(0, 0, 'guy').setDisplaySize(40, 40);
    this.add([this.mapGraphics, this.mapObjectLayer, this.player]);
    this.drawMap();
    this.updatePlayerPosition();
  }

  movePlayer(dx: number, dy: number): ForestMapMoveResult {
    const nextX = this.playerX + dx;
    const nextY = this.playerY + dy;

    if (
      nextX < this.mapOffsetX
      || nextX >= this.mapOffsetX + VIEW_COLUMNS
      || nextY < this.mapOffsetY
      || nextY >= this.mapOffsetY + VIEW_ROWS
      || nextX < 0
      || nextX >= WORLD_COLUMNS
      || nextY < 0
      || nextY >= WORLD_ROWS
      || TREE_CELLS.has(`${nextX},${nextY}`)
    ) {
      return 'blocked';
    }

    this.playerX = nextX;
    this.playerY = nextY;
    this.updatePlayerPosition();
    return this.playerX === HOUSE.x && this.playerY === HOUSE.y ? 'house' : 'moved';
  }

  shiftMap(dx: number, dy: number): boolean {
    const minOffsetX = Math.max(0, this.playerX - VIEW_COLUMNS + 1);
    const maxOffsetX = Math.min(WORLD_COLUMNS - VIEW_COLUMNS, this.playerX);
    const minOffsetY = Math.max(0, this.playerY - VIEW_ROWS + 1);
    const maxOffsetY = Math.min(WORLD_ROWS - VIEW_ROWS, this.playerY);
    const nextOffsetX = Phaser.Math.Clamp(this.mapOffsetX - dx, minOffsetX, maxOffsetX);
    const nextOffsetY = Phaser.Math.Clamp(this.mapOffsetY - dy, minOffsetY, maxOffsetY);
    if (nextOffsetX === this.mapOffsetX && nextOffsetY === this.mapOffsetY) return false;

    this.mapOffsetX = nextOffsetX;
    this.mapOffsetY = nextOffsetY;
    this.drawMap();
    this.updatePlayerPosition();
    return true;
  }

  private drawMap(): void {
    this.mapGraphics.clear();
    this.mapGraphics.lineStyle(1, 0xd8d8d8, 1);
    this.mapImageCursor = 0;
    for (const image of this.mapImages) image.setVisible(false);

    for (let row = 0; row <= VIEW_ROWS; row += 1) {
      const y = MAP_TOP + row * CELL_SIZE;
      this.mapGraphics.beginPath();
      this.mapGraphics.moveTo(MAP_LEFT, y);
      this.mapGraphics.lineTo(MAP_LEFT + VIEW_COLUMNS * CELL_SIZE, y);
      this.mapGraphics.strokePath();
    }

    for (let column = 0; column <= VIEW_COLUMNS; column += 1) {
      const x = MAP_LEFT + column * CELL_SIZE;
      this.mapGraphics.beginPath();
      this.mapGraphics.moveTo(x, MAP_TOP);
      this.mapGraphics.lineTo(x, MAP_TOP + VIEW_ROWS * CELL_SIZE);
      this.mapGraphics.strokePath();
    }

    for (let row = 0; row < VIEW_ROWS; row += 1) {
      for (let column = 0; column < VIEW_COLUMNS; column += 1) {
        const worldX = this.mapOffsetX + column;
        const worldY = this.mapOffsetY + row;
        const x = MAP_LEFT + column * CELL_SIZE + CELL_SIZE / 2;
        const y = MAP_TOP + row * CELL_SIZE + CELL_SIZE / 2;
        if (TREE_CELLS.has(`${worldX},${worldY}`)) this.drawMapImage('tree', x, y, 40);
        if (worldX === HOUSE.x && worldY === HOUSE.y) this.drawMapImage('house', x, y, 44);
      }
    }
  }

  private drawMapImage(texture: string, x: number, y: number, size: number): void {
    const index = this.mapImageCursor;
    this.mapImageCursor += 1;

    let image = this.mapImages[index];
    if (!image) {
      image = this.scene.add.image(x, y, texture);
      this.mapObjectLayer.add(image);
      this.mapImages[index] = image;
    }

    image
      .setTexture(texture)
      .setPosition(x, y)
      .setDisplaySize(size, size)
      .setVisible(true);
  }

  private updatePlayerPosition(): void {
    const x = MAP_LEFT + (this.playerX - this.mapOffsetX) * CELL_SIZE + CELL_SIZE / 2;
    const y = MAP_TOP + (this.playerY - this.mapOffsetY) * CELL_SIZE + CELL_SIZE / 2;
    this.player.setPosition(x, y);
  }
}

import Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { playSound } from '../../audio/AudioControls';

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

const ARROW_DIRECTIONS: Record<string, { x: number; y: number }> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default class TopDownMapRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private mapGraphics?: Phaser.GameObjects.Graphics;
  private mapObjectLayer?: Phaser.GameObjects.Container;
  private readonly mapImages: Phaser.GameObjects.Image[] = [];
  private mapImageCursor = 0;
  private player?: Phaser.GameObjects.Image;
  private playerX = PLAYER_START.x;
  private playerY = PLAYER_START.y;
  private mapOffsetX = 0;
  private mapOffsetY = 0;
  private elapsed = 0;
  private hasShiftedMap = false;
  private hasShownHouseHint = false;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.playerX = PLAYER_START.x;
    this.playerY = PLAYER_START.y;
    this.mapOffsetX = 0;
    this.mapOffsetY = 0;
    this.elapsed = 0;
    this.hasShiftedMap = false;
    this.hasShownHouseHint = false;

    this.mapGraphics = this.addRoomObject(this.scene.add.graphics());
    this.mapObjectLayer = this.addRoomObject(this.scene.add.container(0, 0));
    this.drawMap();
    this.player = this.addRoomObject(this.scene.add.image(0, 0, 'guy').setDisplaySize(40, 40));
    this.updatePlayerPosition();
    this.showHint('Un personaje, un bosque. Falta apenas una dirección.');
  }

  protected onShiftDown(_side: ShiftSide): void { }

  protected override onKeyDown(event: KeyboardEvent): void {
    const direction = ARROW_DIRECTIONS[event.code];
    if (!direction) return;

    event.preventDefault();
    if (event.shiftKey) {
      this.shiftMap(direction.x, direction.y);
      return;
    }

    this.movePlayer(direction.x, direction.y);
  }

  override update(delta: number): void {
    if (this.hasShiftedMap || this.hasShownHouseHint) return;

    this.elapsed += delta;
    if (this.elapsed >= 7000) {
      this.showHint('Necesitás encontrar la casa. Seguir caminando entre los mismos árboles no parece acercarte.');
      this.hasShownHouseHint = true;
    }
  }

  private movePlayer(dx: number, dy: number): void {
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
      return;
    }

    this.playerX = nextX;
    this.playerY = nextY;
    this.updatePlayerPosition();
    playSound(this.scene, 'guy');

    if (this.playerX === HOUSE.x && this.playerY === HOUSE.y) {
      this.complete('Llegaste. La casa estaba en el mapa. Solo faltaba encontrarla.');
    }
  }

  private shiftMap(dx: number, dy: number): void {
    const minOffsetX = Math.max(0, this.playerX - VIEW_COLUMNS + 1);
    const maxOffsetX = Math.min(WORLD_COLUMNS - VIEW_COLUMNS, this.playerX);
    const minOffsetY = Math.max(0, this.playerY - VIEW_ROWS + 1);
    const maxOffsetY = Math.min(WORLD_ROWS - VIEW_ROWS, this.playerY);
    const nextOffsetX = Phaser.Math.Clamp(this.mapOffsetX - dx, minOffsetX, maxOffsetX);
    const nextOffsetY = Phaser.Math.Clamp(this.mapOffsetY - dy, minOffsetY, maxOffsetY);
    if (nextOffsetX === this.mapOffsetX && nextOffsetY === this.mapOffsetY) return;

    this.mapOffsetX = nextOffsetX;
    this.mapOffsetY = nextOffsetY;
    this.drawMap();
    this.updatePlayerPosition();

    if (!this.hasShiftedMap) {
      this.hasShiftedMap = true;
      this.showHint('Ah. Cambiaste el paisaje, no el destino.');
    }
  }

  private drawMap(): void {
    const graphics = this.mapGraphics;
    if (!graphics) return;

    graphics.clear();
    graphics.lineStyle(1, 0xd8d8d8, 1);
    this.mapImageCursor = 0;
    for (const image of this.mapImages) image.setVisible(false);

    for (let row = 0; row <= VIEW_ROWS; row += 1) {
      const y = MAP_TOP + row * CELL_SIZE;
      graphics.beginPath();
      graphics.moveTo(MAP_LEFT, y);
      graphics.lineTo(MAP_LEFT + VIEW_COLUMNS * CELL_SIZE, y);
      graphics.strokePath();
    }

    for (let column = 0; column <= VIEW_COLUMNS; column += 1) {
      const x = MAP_LEFT + column * CELL_SIZE;
      graphics.beginPath();
      graphics.moveTo(x, MAP_TOP);
      graphics.lineTo(x, MAP_TOP + VIEW_ROWS * CELL_SIZE);
      graphics.strokePath();
    }

    for (let row = 0; row < VIEW_ROWS; row += 1) {
      for (let column = 0; column < VIEW_COLUMNS; column += 1) {
        const worldX = this.mapOffsetX + column;
        const worldY = this.mapOffsetY + row;
        const x = MAP_LEFT + column * CELL_SIZE;
        const y = MAP_TOP + row * CELL_SIZE;
        if (TREE_CELLS.has(`${worldX},${worldY}`)) {
          this.drawMapImage('tree', x + CELL_SIZE / 2, y + CELL_SIZE / 2, 40);
        }

        if (worldX === HOUSE.x && worldY === HOUSE.y) {
          this.drawMapImage('house', x + CELL_SIZE / 2, y + CELL_SIZE / 2, 44);
        }
      }
    }
  }

  private drawMapImage(texture: string, x: number, y: number, size: number): void {
    const index = this.mapImageCursor;
    this.mapImageCursor += 1;

    let image = this.mapImages[index];
    if (!image) {
      image = this.scene.add.image(x, y, texture);
      this.mapObjectLayer?.add(image);
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
    this.player?.setPosition(x, y);
  }
}

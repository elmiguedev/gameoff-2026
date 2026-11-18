import type Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';
import ForestMapEntity from '../../entities/ForestMapEntity';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

const ARROW_DIRECTIONS: Record<string, { x: number; y: number }> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export default class Room10Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private map?: ForestMapEntity;
  private elapsed = 0;
  private hasShiftedMap = false;
  private hasShownHouseHint = false;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.elapsed = 0;
    this.hasShiftedMap = false;
    this.hasShownHouseHint = false;
    this.map = this.addRoomObject(new ForestMapEntity(this.scene));
    this.showHint('copy.un-personaje-un-bosque-falta-apenas-una-direccion');
  }

  protected onShiftDown(_side: ShiftSide): void {}

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
      this.showHint('copy.necesitas-encontrar-la-casa-seguir-caminando-entre-los');
      this.hasShownHouseHint = true;
    }
  }

  override exit(): void {
    this.map = undefined;
    super.exit();
  }

  private movePlayer(dx: number, dy: number): void {
    const result = this.map?.movePlayer(dx, dy);
    if (result === 'blocked' || !result) return;

    AudioManager.play(this.scene, 'guy');
    if (result === 'house') {
      this.complete('copy.llegaste-la-casa-estaba-en-el-mapa-solo-faltaba-encont');
    }
  }

  private shiftMap(dx: number, dy: number): void {
    if (!this.map?.shiftMap(dx, dy) || this.hasShiftedMap) return;

    this.hasShiftedMap = true;
    this.showHint('copy.ah-cambiaste-el-paisaje-no-el-destino');
  }
}

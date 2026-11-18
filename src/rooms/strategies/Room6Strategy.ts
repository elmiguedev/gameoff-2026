import type Phaser from 'phaser';
import type { TranslationKey } from '../../i18n/i18n';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room6Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private static readonly WAIT_DURATION_MS = 7000;
  private static readonly INTERACTIONS_BEFORE_FIRST_HINT = 3;

  private idleTime = 0;
  private interactionCount = 0;
  private clockImage?: Phaser.GameObjects.Image;

  private readonly interactionLines = [
    'copy.estas-probando-teclas-el-reloj-agradece-que-confirmes',
    'copy.esa-fue-distinta-la-espera-no',
    'copy.el-reloj-sigue-corriendo-vos-estas-haciendo-un-gran-tr',
    'copy.cada-tecla-que-tocas-reinicia-la-espera-te-lo-digo-por',
    'copy.ahora-si-no-toques-nada-nada-de-nada',
  ] as const satisfies readonly TranslationKey[];

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.idleTime = 0;
    this.interactionCount = 0;

    this.clockImage = this.addRoomObject(
      this.scene.add.image(640, 350, 'clock').setDisplaySize(520, 520 * 2 / 3),
    );

  }

  protected onShiftDown(_side: ShiftSide): void {
    this.registerActivity();
  }

  protected override onKeyDown(_event: KeyboardEvent): void {
    this.registerActivity();
  }

  override update(delta: number): void {
    this.idleTime += delta;

    if (this.idleTime < Room6Strategy.WAIT_DURATION_MS) return;

    this.clockImage?.setTexture('clock-finished');
    this.complete('copy.y-ahi-esta-esperar-era-todo-el-plan-si-yo-tambien-espe');
  }

  private registerActivity(): void {
    this.idleTime = 0;
    this.interactionCount += 1;

    if (this.interactionCount < Room6Strategy.INTERACTIONS_BEFORE_FIRST_HINT) return;

    const lineIndex = Math.min(
      this.interactionCount - Room6Strategy.INTERACTIONS_BEFORE_FIRST_HINT,
      this.interactionLines.length - 1,
    );
    this.showHint(this.interactionLines[lineIndex] ?? 'copy.ahora-si-no-toques-nada');
  }

}

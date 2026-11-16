import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class SixthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private static readonly WAIT_DURATION_MS = 7000;

  private idleTime = 0;
  private interactionCount = 0;
  private clockImage?: Phaser.GameObjects.Image;

  private readonly interactionLines = [
    '¿Estás probando teclas? El reloj agradece que confirmes que funciona.',
    'Esa fue distinta. La espera, no.',
    'El reloj sigue corriendo. Vos estás haciendo un gran trabajo interrumpiéndolo.',
    'Cada tecla que tocás reinicia la espera. Te lo digo por si querías una explicación menos sutil.',
    'Ahora sí: no toques nada. Nada de nada.',
  ];

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.idleTime = 0;
    this.interactionCount = 0;

    this.clockImage = this.addRoomObject(
      this.scene.add.image(640, 350, 'clock').setDisplaySize(520, 520 * 2 / 3),
    );

    this.showHint('Podés esperar. Es una actividad sorprendentemente difícil para alguien con tantas teclas.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.registerActivity();
  }

  protected override onKeyDown(_event: KeyboardEvent): void {
    this.registerActivity();
  }

  override update(delta: number): void {
    this.idleTime += delta;

    if (this.idleTime < SixthRoomStrategy.WAIT_DURATION_MS) return;

    this.clockImage?.setTexture('clock-finished');
    this.complete('Y ahí está. Esperar era todo el plan. Sí, yo también esperaba algo más emocionante.');
  }

  private registerActivity(): void {
    this.idleTime = 0;
    const lineIndex = Math.min(this.interactionCount, this.interactionLines.length - 1);
    this.showHint(this.interactionLines[lineIndex] ?? 'Ahora sí: no toques nada.');
    this.interactionCount += 1;
  }

}

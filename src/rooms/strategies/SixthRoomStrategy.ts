import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class SixthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private idleTime = 0;
  private interactionCount = 0;
  private doorGraphics?: Phaser.GameObjects.Graphics;

  private readonly interactionLines = [
    '¿Estás probando teclas? La puerta no parece impresionada.',
    'Esa fue distinta. El resultado no tanto.',
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

    this.addLabel(565, 190, '12', 16, '#777777');
    this.addLabel(642, 190, 'O', 12, '#777777');
    this.drawClock();
    this.drawChair();
    this.drawTableAndCup();

    this.doorGraphics = this.addRoomObject(this.scene.add.graphics());
    this.drawClosedDoor();

    this.showHint('La puerta parece cerrada. La silla parece cómoda. No es una invitación; es una observación.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.registerActivity();
  }

  protected override onKeyDown(_event: KeyboardEvent): void {
    this.registerActivity();
  }

  override update(delta: number): void {
    this.idleTime += delta;

    if (this.idleTime < 7000) return;

    this.drawOpenDoor();
    this.complete('¡Se abrió! Esperar era todo el plan. Sí, yo también esperaba algo más emocionante.');
  }

  private registerActivity(): void {
    this.idleTime = 0;
    const lineIndex = Math.min(this.interactionCount, this.interactionLines.length - 1);
    this.showHint(this.interactionLines[lineIndex] ?? 'Ahora sí: no toques nada.');
    this.interactionCount += 1;
  }

  private drawClock(): void {
    const clock = this.addRoomObject(this.scene.add.graphics());
    clock.lineStyle(2, 0x111111, 1);
    clock.strokeCircle(600, 205, 38);
    clock.beginPath();
    clock.moveTo(600, 205);
    clock.lineTo(600, 180);
    clock.moveTo(600, 205);
    clock.lineTo(617, 213);
    clock.strokePath();
  }

  private drawChair(): void {
    const chair = this.addRoomObject(this.scene.add.graphics());
    chair.lineStyle(3, 0x111111, 1);
    chair.strokeRect(425, 390, 120, 18);
    chair.strokeRect(425, 300, 18, 90);
    chair.beginPath();
    chair.moveTo(435, 408);
    chair.lineTo(425, 485);
    chair.moveTo(535, 408);
    chair.lineTo(545, 485);
    chair.strokePath();
  }

  private drawTableAndCup(): void {
    const table = this.addRoomObject(this.scene.add.graphics());
    table.lineStyle(3, 0x111111, 1);
    table.strokeRect(600, 400, 135, 14);
    table.beginPath();
    table.moveTo(615, 414);
    table.lineTo(605, 480);
    table.moveTo(720, 414);
    table.lineTo(730, 480);
    table.strokePath();
    table.strokeRect(645, 370, 35, 30);
    table.strokeCircle(680, 382, 8);
  }

  private drawClosedDoor(): void {
    const door = this.doorGraphics;
    if (!door) return;

    door.lineStyle(3, 0x111111, 1);
    door.strokeRect(850, 270, 190, 330);
    door.strokeCircle(1010, 435, 7);
  }

  private drawOpenDoor(): void {
    const door = this.doorGraphics;
    if (!door) return;

    door.clear();
    door.lineStyle(3, 0x111111, 1);
    door.strokeRect(850, 270, 190, 330);
    door.beginPath();
    door.moveTo(850, 270);
    door.lineTo(765, 305);
    door.lineTo(765, 600);
    door.lineTo(850, 600);
    door.strokePath();
  }

  private addLabel(x: number, y: number, text: string, fontSize: number, color: string): void {
    this.addRoomObject(
      this.scene.add.text(x, y, text, {
        color,
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: `${fontSize}px`,
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );
  }
}

import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room11Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    const shiftLogo = this.scene.add.image(640, 350, 'shift-logo');
    shiftLogo
      .setDisplaySize(520, 520 / 3)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.activateKey());
    this.addRoomObject(shiftLogo);

    const mouseCursor = this.scene.add.image(799, 399, 'mouse-cursor');
    mouseCursor.setDisplaySize(78, 71);
    this.addRoomObject(mouseCursor);

    this.showHint('copy.que-familiar-esta-vez-el-dibujo-espera-que-lo-pulses');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.showHint('copy.shift-en-serio-esta-vez-hasta-el-dibujo-te-estaba-sena');
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Tab') return;

    event.preventDefault();
    this.showHint('copy.tab-no-esta-sala-ya-tiene-suficientes-teclas-con-probl');
  }

  private activateKey(): void {
    this.complete('copy.ah-cierto-era-un-boton-bien-visto-cuando-finalmente-lo');
  }
}

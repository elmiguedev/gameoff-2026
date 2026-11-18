import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';

export default class Room8Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private backspaceAttempts = 0;
  private tabAttempts = 0;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.backspaceAttempts = 0;
    this.tabAttempts = 0;

    if (this.progress.completedRooms.has(8)) {
      this.addRoomObject(this.scene.add.image(640, 350, 'exit-icon').setDisplaySize(360, 240));
      this.complete('copy.lo-lograste-encontraste-el-camino-de-vuelta-cuando-qui');
      return;
    }

    this.showHint('copy.el-camino-hasta-aca-parece-bastante-convencido-de-una');
  }

  protected onShiftDown(_side: ShiftSide): void {
    this.showHint('copy.no-iba-a-ser-tan-sencillo-esta-vez-shift-solo-no-hace');
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      event.preventDefault();
      this.backspaceAttempts += 1;
      if (this.backspaceAttempts === 1) {
        this.showHint('copy.retroceso-un-metodo-bastante-literal-pero-no-es-la-uni');
      } else if (this.backspaceAttempts === 3) {
        this.showHint('copy.insistir-con-retroceso-no-va-a-cambiar-la-direccion-de');
      }
      return;
    }

    if (event.code === 'Tab') {
      this.tabAttempts += 1;
      if (this.tabAttempts === 1) {
        this.showHint('copy.tab-suele-avanzar-entre-opciones-no-siempre-hace-falta');
      } else if (this.tabAttempts === 2) {
        this.showHint('copy.tab-solo-no-alcanza-para-volver-por-suerte-el-teclado');
      } else if (this.tabAttempts === 3) {
        this.showHint('copy.shift-puede-cambiar-el-sentido-de-tab-no-lo-digo-por-n');
      }
    }
  }

  protected override onShiftTab(): void {
    this.progress.roomNineReturnPending = true;
    this.complete('copy.volviste-sabia-que-en-algun-momento-ibas-a-querer-revi');
  }
}

import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';
import { AudioManager } from '../../audio/AudioManager';
import TypographyEntity from '../../entities/TypographyEntity';

const CODE_SYMBOLS: Record<string, string> = {
  Digit1: '!',
  Digit3: '#',
  Digit4: '$',
};

export default class Room5Strategy extends RoomBaseStrategy {
  readonly prompt = '';

  private input = '';
  private inputDisplay?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addRoomObject(this.scene.add.image(640, 235, 'lock-icon').setDisplaySize(180, 180));
    this.addRoomObject(new TypographyEntity(this.scene, 640, 350, '134', 'lock-code'));

    this.inputDisplay = this.addRoomObject(
      new TypographyEntity(this.scene, 640, 475, '', 'input-large'),
    );

    this.addRoomObject(this.scene.add.rectangle(640, 508, 340, 2, 0xd0d0d0));

    this.showHint('copy.la-cerradura-pide-tres-caracteres-que-tranquilidad-al');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      if (this.input.length > 0) AudioManager.play(this.scene, 'input');
      this.input = this.input.slice(0, -1);
      this.updateInputDisplay();
      return;
    }

    if (event.code === 'Enter') {
      this.submitCode();
      return;
    }

    if (!event.code.startsWith('Digit')) return;

    const character = event.shiftKey ? CODE_SYMBOLS[event.code] : event.code.slice(-1);
    if (!character) return;

    AudioManager.play(this.scene, 'input');
    this.input += character;
    this.updateInputDisplay();
  }

  private submitCode(): void {
    if (this.input === '!#$') {
      this.complete('copy.no-eran-numeros-eran-las-mismas-teclas-con-otra-salida');
      return;
    }

    if (this.input === '134') {
      this.showHint('copy.la-cerradura-no-quiere-los-nombres-de-las-teclas-quier');
      return;
    }

    this.showHint('copy.codigo-incorrecto-las-teclas-parecen-bastante-seguras');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.input);
  }

}

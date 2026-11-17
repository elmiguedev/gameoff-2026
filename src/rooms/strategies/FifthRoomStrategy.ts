import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { playSound } from '../../audio/AudioControls';

const CODE_SYMBOLS: Record<string, string> = {
  Digit1: '!',
  Digit3: '#',
  Digit4: '$',
};

export default class FifthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private input = '';
  private inputDisplay?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addRoomObject(this.scene.add.image(640, 235, 'lock-icon').setDisplaySize(180, 180));
    this.addLabel(640, 350, '134', 42, '#111111');

    this.inputDisplay = this.addRoomObject(
      this.scene.add.text(640, 475, '', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '36px',
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );

    this.addRoomObject(this.scene.add.rectangle(640, 508, 340, 2, 0xd0d0d0));

    this.showHint('La cerradura pide tres caracteres. Qué tranquilidad: al menos parecen números.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      if (this.input.length > 0) playSound(this.scene, 'input');
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

    playSound(this.scene, 'input');
    this.input += character;
    this.updateInputDisplay();
  }

  private submitCode(): void {
    if (this.input === '!#$') {
      this.complete('No eran números. Eran las mismas teclas con otra salida.');
      return;
    }

    if (this.input === '134') {
      this.showHint('La cerradura no quiere los nombres de las teclas. Quiere lo que sale cuando las modificás.');
      return;
    }

    this.showHint('Código incorrecto. Las teclas parecen bastante seguras de sí mismas.');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.input);
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

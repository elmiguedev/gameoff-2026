import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

const CODE_SYMBOLS: Record<string, string> = {
  Digit1: '!',
  Digit3: '#',
  Digit4: '$',
};

const CODE_KEYS = [
  { digit: '1', symbol: '!' },
  { digit: '3', symbol: '#' },
  { digit: '4', symbol: '$' },
];

export default class FifthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private input = '';
  private inputDisplay?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addLabel(640, 175, 'CÓDIGO', 16, '#777777');
    this.addLabel(640, 240, '1  3  4', 48, '#111111');

    this.addRoomObject(
      this.scene.add.rectangle(640, 350, 430, 72, 0xffffff).setStrokeStyle(2, 0x111111),
    );
    this.inputDisplay = this.addRoomObject(
      this.scene.add.text(450, 350, '', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '28px',
      }).setOrigin(0, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );

    CODE_KEYS.forEach(({ digit, symbol }, index) => {
      const x = 500 + index * 140;
      this.addRoomObject(
        this.scene.add.rectangle(x, 485, 108, 72, 0xffffff).setStrokeStyle(2, 0x111111),
      );
      this.addLabel(x - 8, 485, digit, 30, '#111111');
      this.addLabel(x + 31, 465, symbol, 14, '#777777');
    });

    this.addLabel(640, 570, 'ENTER PARA CONFIRMAR', 14, '#777777');
    this.showHint('La cerradura pide tres caracteres. Qué tranquilidad: al menos parecen números.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
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

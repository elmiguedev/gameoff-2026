import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

export default class FourthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private input = '';
  private capsLockEnabled = false;
  private inputDisplay?: Phaser.GameObjects.Text;
  private capsLockLabel?: Phaser.GameObjects.Text;
  private capsLockIndicator?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addLabel(640, 165, 'CONTRASEÑA EXACTA', 16, '#777777');
    this.addLabel(640, 225, 'Shift', 48, '#111111');

    this.addRoomObject(
      this.scene.add.rectangle(640, 345, 500, 76, 0xffffff).setStrokeStyle(2, 0x111111),
    );

    this.inputDisplay = this.addRoomObject(
      this.scene.add.text(410, 345, '', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '28px',
      }).setOrigin(0, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );

    this.addRoomObject(
      this.scene.add.rectangle(640, 485, 260, 68, 0xffffff).setStrokeStyle(2, 0x111111),
    );
    this.capsLockLabel = this.addRoomObject(
      this.scene.add.text(640, 485, 'CAPS LOCK: OFF', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '16px',
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );
    this.capsLockIndicator = this.addRoomObject(
      this.scene.add.rectangle(755, 464, 8, 8, 0xffffff).setStrokeStyle(1, 0x111111),
    );

    this.addLabel(640, 555, 'ENTER PARA CONFIRMAR', 14, '#777777');
    this.showHint('Qué suerte: acá está Caps Lock. La tecla perfecta para escribir TODO COMO SI ESTUVIERAS ENOJADO.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'CapsLock') {
      this.capsLockEnabled = !this.capsLockEnabled;
      this.updateCapsLockIndicator();
      return;
    }

    if (event.code === 'Backspace') {
      this.input = this.input.slice(0, -1);
      this.updateInputDisplay();
      return;
    }

    if (event.code === 'Enter') {
      this.submitPassword();
      return;
    }

    if (!event.code.startsWith('Key') || event.code.length !== 4) return;

    const letter = event.code.slice(3).toLowerCase();
    const isUppercase = this.capsLockEnabled !== event.shiftKey;
    this.input += isUppercase ? letter.toUpperCase() : letter;
    this.updateInputDisplay();
  }

  private submitPassword(): void {
    if (this.input === 'Shift') {
      this.complete('Una mayúscula era suficiente. Caps Lock tiene esa dificultad para medir.');
      return;
    }

    if (this.input === 'SHIFT') {
      this.showHint('El juego se llama Shift. No Caps Lock.');
      return;
    }

    this.showHint('No. La contraseña distingue mayúsculas y minúsculas.');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.input || '');
  }

  private updateCapsLockIndicator(): void {
    this.capsLockLabel?.setText(`CAPS LOCK: ${this.capsLockEnabled ? 'ON' : 'OFF'}`);
    this.capsLockIndicator?.setFillStyle(this.capsLockEnabled ? 0x111111 : 0xffffff);
  }

  private addLabel(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string,
  ): void {
    this.addRoomObject(
      this.scene.add.text(x, y, text, {
        color,
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: `${fontSize}px`,
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );
  }
}

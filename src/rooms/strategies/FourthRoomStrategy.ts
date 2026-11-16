import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

interface TypedCharacter {
  value: string;
  capsLockActive: boolean;
  shiftHeld: boolean;
}

export default class FourthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private readonly typedCharacters: TypedCharacter[] = [];
  private inputDisplay?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.addLabel(640, 165, 'CONTRASEÑA EXACTA', 16, '#666666');

    this.inputDisplay = this.addRoomObject(
      this.scene.add.text(640, 295, '', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '28px',
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );

    this.addRoomObject(
      this.scene.add.rectangle(640, 328, 340, 2, 0xd0d0d0),
    );

    this.addRoomObject(this.scene.add.image(640, 455, 'caps-key').setDisplaySize(520, 520 / 3));

    this.showHint('Qué suerte: acá está Caps Lock. La tecla perfecta para escribir TODO COMO SI ESTUVIERAS ENOJADO.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      this.typedCharacters.pop();
      this.updateInputDisplay();
      return;
    }

    if (event.code === 'Enter') {
      this.submitPassword();
      return;
    }

    if (!/^[a-z]$/i.test(event.key)) return;

    this.typedCharacters.push({
      value: event.key,
      capsLockActive: event.getModifierState('CapsLock'),
      shiftHeld: event.shiftKey,
    });
    this.updateInputDisplay();
  }

  private submitPassword(): void {
    const input = this.typedCharacters.map(({ value }) => value).join('');
    const usedCapsLock = this.typedCharacters.some(({ capsLockActive }) => capsLockActive);
    const firstLetterUsedShift = this.typedCharacters[0]?.shiftHeld === true;

    if (usedCapsLock) {
      this.showHint('Veo que todavía no estamos entendiendo de qué va todo esto…');
      return;
    }

    if (input === 'Shift' && firstLetterUsedShift) {
      this.complete('Bien. No todas las mayúsculas son iguales.');
      return;
    }

    this.showHint('No. La contraseña distingue mayúsculas y minúsculas.');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.typedCharacters.map(({ value }) => value).join(''));
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
        fontStyle: '300',
      }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)),
    );
  }
}

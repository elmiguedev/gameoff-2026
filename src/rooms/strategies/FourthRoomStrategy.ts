import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { playSound } from '../../audio/AudioControls';

interface TypedCharacter {
  value: string;
  capsLockActive: boolean;
  shiftHeld: boolean;
}

export default class FourthRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private readonly typedCharacters: TypedCharacter[] = [];
  private inputDisplay?: Phaser.GameObjects.Text;
  private unrelatedAttempts = 0;
  private hasShownConceptHint = false;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.typedCharacters.length = 0;
    this.unrelatedAttempts = 0;
    this.hasShownConceptHint = false;
    this.addRoomObject(this.scene.add.text(640, 165, 'Contraseña?', {
      color: '#666666',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '16px',
      fontStyle: '300',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));

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
      if (this.typedCharacters.length > 0) playSound(this.scene, 'input');
      this.typedCharacters.pop();
      this.updateInputDisplay();
      return;
    }

    if (event.code === 'Enter') {
      this.submitPassword();
      return;
    }

    if (!/^[a-z]$/i.test(event.key)) return;

    playSound(this.scene, 'input');
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
    const everyLetterUsedShift = this.typedCharacters.length > 0
      && this.typedCharacters.every(({ shiftHeld }) => shiftHeld);

    if (input === 'SHIFT' && everyLetterUsedShift && !usedCapsLock) {
      this.complete('Bien. No todas las mayúsculas son iguales.');
      return;
    }

    if (input.toLowerCase() === 'shift') {
      if (usedCapsLock) {
        this.showHint('La palabra es la correcta. Pero Caps Lock no hace el mismo trabajo que mantener apretada otra tecla.');
        return;
      }

      this.showHint('La palabra parece correcta. Pero esas mayúsculas todavía no están del todo bien resueltas.');
      return;
    }

    if (usedCapsLock) {
      this.showHint('Veo que todavía no estamos entendiendo de qué va todo esto…');
      return;
    }

    if (input.length === 0) {
      this.showHint('Vacío. Técnicamente, una respuesta; no la que buscábamos.');
      return;
    }

    this.unrelatedAttempts += 1;
    if (this.unrelatedAttempts > 4 && !this.hasShownConceptHint) {
      this.hasShownConceptHint = true;
      this.showHint('Quizá la clave tenga algo que ver con el concepto que sostiene todo este juego. No hace falta inventar una palabra nueva.');
      return;
    }

    this.showHint('No. Esa palabra parece haber llegado a esta sala por accidente.');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.typedCharacters.map(({ value }) => value).join(''));
  }
}

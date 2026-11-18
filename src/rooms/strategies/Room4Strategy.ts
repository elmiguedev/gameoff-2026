import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';
import { AudioManager } from '../../audio/AudioManager';
import TypographyEntity from '../../entities/TypographyEntity';

interface TypedCharacter {
  value: string;
  capsLockActive: boolean;
  shiftHeld: boolean;
}

export default class Room4Strategy extends RoomBaseStrategy {
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
    this.addRoomObject(new TypographyEntity(this.scene, 640, 165, 'copy.contrasena', 'auxiliary'));

    this.inputDisplay = this.addRoomObject(
      new TypographyEntity(this.scene, 640, 295, '', 'input-medium'),
    );

    this.addRoomObject(
      this.scene.add.rectangle(640, 328, 340, 2, 0xd0d0d0),
    );

    this.addRoomObject(this.scene.add.image(640, 455, 'caps-key').setDisplaySize(520, 520 / 3));

    this.showHint('copy.que-suerte-aca-esta-caps-lock-la-tecla-perfecta-para-e');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.repeat) return;

    if (event.code === 'Backspace') {
      if (this.typedCharacters.length > 0) AudioManager.play(this.scene, 'input');
      this.typedCharacters.pop();
      this.updateInputDisplay();
      return;
    }

    if (event.code === 'Enter') {
      this.submitPassword();
      return;
    }

    if (!/^[a-z]$/i.test(event.key)) return;

    AudioManager.play(this.scene, 'input');
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
      this.complete('copy.bien-no-todas-las-mayusculas-son-iguales');
      return;
    }

    if (input.toLowerCase() === 'shift') {
      if (usedCapsLock) {
        this.showHint('copy.la-palabra-es-la-correcta-pero-caps-lock-no-hace-el-mi');
        return;
      }

      this.showHint('copy.la-palabra-parece-correcta-pero-esas-mayusculas-todavi');
      return;
    }

    if (usedCapsLock) {
      this.showHint('copy.veo-que-todavia-no-estamos-entendiendo-de-que-va-todo');
      return;
    }

    if (input.length === 0) {
      this.showHint('copy.vacio-tecnicamente-una-respuesta-no-la-que-buscabamos');
      return;
    }

    this.unrelatedAttempts += 1;
    if (this.unrelatedAttempts > 4 && !this.hasShownConceptHint) {
      this.hasShownConceptHint = true;
      this.showHint('copy.quiza-la-clave-tenga-algo-que-ver-con-el-concepto-que');
      return;
    }

    this.showHint('copy.no-esa-palabra-parece-haber-llegado-a-esta-sala-por-ac');
  }

  private updateInputDisplay(): void {
    this.inputDisplay?.setText(this.typedCharacters.map(({ value }) => value).join(''));
  }
}

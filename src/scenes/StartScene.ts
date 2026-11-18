import Phaser from 'phaser';
import { MORSE_EASTER_EGG_EVENT } from '../input/ShiftMorseEasterEgg';
import { addAudioToggle, bindMouseClickSound } from '../audio/AudioControls';
import BootloaderScene from './BootloaderScene';

export default class StartScene extends Phaser.Scene {
  private static readonly START_DELAY_MS = 180;
  private static readonly IDLE_HINT_DELAY_MS = 5000;

  private readonly heldShifts = new Set<string>();
  private startTimer?: number;
  private idleHintTimer?: number;
  private transitionStarted = false;
  private idleHintText?: Phaser.GameObjects.Text;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.transitionStarted) return;
    this.resetIdleHintTimer();

    if (event.repeat) return;

    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      if (this.startTimer !== undefined) {
        window.clearTimeout(this.startTimer);
        this.startTimer = undefined;
      }
      this.heldShifts.add(event.code);
      return;
    }

    if (event.code === 'Tab' && (event.shiftKey || this.heldShifts.size > 0)) {
      event.preventDefault();
      this.startGame(true);
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;

    this.heldShifts.delete(event.code);
    if (this.transitionStarted || this.startTimer !== undefined) return;

    this.startTimer = window.setTimeout(() => {
      this.startTimer = undefined;
      this.startGame(false);
    }, StartScene.START_DELAY_MS);
  };

  private readonly handleMorseVictory = (event: Event): void => {
    if ((event as CustomEvent<'SOS' | 'WIN'>).detail === 'SOS') this.startGame(false, true);
  };

  constructor() {
    super('StartScene');
  }

  create(): void {
    this.transitionStarted = false;
    this.heldShifts.clear();
    this.input.keyboard?.off('keydown', this.handleKeyDown);
    this.input.keyboard?.off('keyup', this.handleKeyUp);
    this.cameras.main.setBackgroundColor('#ffffff');
    BootloaderScene.resumeBackgroundMusic();
    addAudioToggle(this);
    bindMouseClickSound(this);

    this.add
      .text(640, 360, 'SHIFT', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '72px',
        fontStyle: '500',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.idleHintText = this.add
      .text(640, 620, '', {
        color: '#555555',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '19px',
        lineSpacing: 6,
        align: 'center',
        wordWrap: { width: (1280 * 2) / 3, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    const narratorRestartTease = this.registry.get('narrator-restart-tease-pending') === true;
    const operatorNewSession = this.registry.get('operator-new-session-pending') === true;
    if (narratorRestartTease) {
      this.registry.set('narrator-restart-tease-pending', false);
      this.idleHintText.setText('Ja. Volviste. No encontraste la opción secreta. Era bastante sencilla. Ahora vas a tener que resolver las catorce salas de nuevo. Desde cero.');
    } else if (operatorNewSession) {
      this.registry.set('operator-new-session-pending', false);
      this.idleHintText.setText('NUEVA SESIÓN INICIADA.');
    }

    this.input.keyboard?.on('keydown', this.handleKeyDown);
    this.input.keyboard?.on('keyup', this.handleKeyUp);
    window.addEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupInput, this);
    if (!narratorRestartTease) this.resetIdleHintTimer();
  }

  private startGame(backdoorAttempt: boolean, secretVictory = false): void {
    if (this.transitionStarted) return;

    this.transitionStarted = true;
    if (this.startTimer !== undefined) {
      window.clearTimeout(this.startTimer);
      this.startTimer = undefined;
    }
    this.cleanupInput();

    if (secretVictory) {
      this.scene.start('MorseVictoryScene', { signal: 'SOS' });
      return;
    }

    const enteredControlRoomEarly = this.registry.get('shift-backdoor-visit-pending') === true;
    if (!backdoorAttempt) this.registry.set('shift-backdoor-visit-pending', false);

    this.scene.start('GameScene', {
      backdoorAttempt,
      enteredControlRoomEarly,
      entryShiftAlreadyReleased: !backdoorAttempt,
    });
  }

  private cleanupInput(): void {
    if (this.idleHintTimer !== undefined) {
      window.clearTimeout(this.idleHintTimer);
      this.idleHintTimer = undefined;
    }
    this.input.keyboard?.off('keydown', this.handleKeyDown);
    this.input.keyboard?.off('keyup', this.handleKeyUp);
    window.removeEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
  }

  private resetIdleHintTimer(): void {
    if (this.idleHintTimer !== undefined) window.clearTimeout(this.idleHintTimer);
    this.idleHintText?.setText('');

    this.idleHintTimer = window.setTimeout(() => {
      this.idleHintTimer = undefined;
      if (this.transitionStarted || this.heldShifts.size > 0) return;
      this.idleHintText?.setText('¿Esperabas que empezara solo? Presioná Shift y hacemos como que fue tu idea.');
    }, StartScene.IDLE_HINT_DELAY_MS);
  }

}

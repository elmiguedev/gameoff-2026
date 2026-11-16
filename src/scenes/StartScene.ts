import Phaser from 'phaser';
import { MORSE_EASTER_EGG_EVENT } from '../input/ShiftMorseEasterEgg';

export default class StartScene extends Phaser.Scene {
  private static readonly START_DELAY_MS = 180;

  private readonly heldShifts = new Set<string>();
  private startTimer?: number;
  private transitionStarted = false;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
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

  private readonly handleMorseVictory = (): void => {
    this.startGame(false, true);
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

    this.add
      .text(640, 300, 'SHIFT', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '72px',
        fontStyle: '500',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.add
      .text(640, 410, 'PRESIONÁ SHIFT PARA EMPEZAR', {
        color: '#555555',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.input.keyboard?.on('keydown', this.handleKeyDown);
    this.input.keyboard?.on('keyup', this.handleKeyUp);
    window.addEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupInput, this);
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
      this.scene.start('MorseVictoryScene');
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
    this.input.keyboard?.off('keydown', this.handleKeyDown);
    this.input.keyboard?.off('keyup', this.handleKeyUp);
    window.removeEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
  }
}

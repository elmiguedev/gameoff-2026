import Phaser from 'phaser';
import { MORSE_SIGNAL_EVENT } from '../input/MorseInputComponent';
import { AudioManager } from '../audio/AudioManager';
import AudioToggleEntity from '../entities/AudioToggleEntity';
import LanguageToggleEntity from '../entities/LanguageToggleEntity';
import OperatorPanelEntity from '../entities/OperatorPanelEntity';
import TypographyEntity from '../entities/TypographyEntity';
import BootloaderScene from './BootloaderScene';
import { getLanguage, type TranslationKey } from '../i18n/i18n';

export default class StartScene extends Phaser.Scene {
  private static readonly START_DELAY_MS = 180;
  private static readonly IDLE_HINT_DELAY_MS = 5000;

  private readonly heldShifts = new Set<string>();
  private startTimer?: number;
  private idleHintTimer?: number;
  private transitionStarted = false;
  private operatorPanel?: OperatorPanelEntity;
  private languageToggle?: LanguageToggleEntity;
  private startNotice?: TranslationKey;
  private idleMessageKey?: TranslationKey;

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.transitionStarted) return;
    this.resetIdleHintTimer();

    if (event.repeat) return;

    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
      this.languageToggle?.setLanguage(getLanguage() === 'es' ? 'en' : 'es');
      return;
    }

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
    this.resetSceneState();
    this.createBackground();
    this.createAudioControls();
    this.createTitle();
    this.createLanguageToggle();
    this.createOperatorPanel();
    this.createPendingNotice();
    this.bindInput();
  }

  private resetSceneState(): void {
    this.transitionStarted = false;
    this.heldShifts.clear();
    this.startNotice = undefined;
    this.idleMessageKey = undefined;
    this.input.keyboard?.off('keydown', this.handleKeyDown);
    this.input.keyboard?.off('keyup', this.handleKeyUp);
    BootloaderScene.resumeBackgroundMusic();
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private createAudioControls(): void {
    AudioManager.attach(this);
    new AudioToggleEntity(this);
  }

  private createTitle(): void {
    new TypographyEntity(this, 640, 315, 'SHIFT', 'title');
  }

  private createLanguageToggle(): void {
    this.languageToggle = new LanguageToggleEntity(this);
    this.languageToggle.on('languagechange', this.refreshOperatorMessage);
  }

  private createOperatorPanel(): void {
    this.operatorPanel = new OperatorPanelEntity(this, 640, 620, 'start-operator');
  }

  private createPendingNotice(): void {
    const narratorRestartTease = this.registry.get('narrator-restart-tease-pending') === true;
    const operatorNewSession = this.registry.get('operator-new-session-pending') === true;
    if (narratorRestartTease) {
      this.registry.set('narrator-restart-tease-pending', false);
      this.startNotice = 'copy.ja-volviste-no-encontraste-la-opcion-secreta-era-basta';
    } else if (operatorNewSession) {
      this.registry.set('operator-new-session-pending', false);
      this.startNotice = 'copy.nueva-sesion-iniciada';
    }
    if (this.startNotice) {
      this.idleMessageKey = this.startNotice;
      this.operatorPanel?.showMessage(this.startNotice);
    }
  }

  private bindInput(): void {
    this.input.keyboard?.on('keydown', this.handleKeyDown);
    this.input.keyboard?.on('keyup', this.handleKeyUp);
    window.addEventListener(MORSE_SIGNAL_EVENT, this.handleMorseVictory);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupInput, this);
    if (!this.startNotice) this.resetIdleHintTimer();
  }

  private readonly refreshOperatorMessage = (): void => {
    if (this.idleMessageKey) this.operatorPanel?.showMessage(this.idleMessageKey);
  };

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
    window.removeEventListener(MORSE_SIGNAL_EVENT, this.handleMorseVictory);
    this.languageToggle?.off('languagechange', this.refreshOperatorMessage);
  }

  private resetIdleHintTimer(): void {
    if (this.idleHintTimer !== undefined) window.clearTimeout(this.idleHintTimer);
    this.operatorPanel?.showText('');
    this.idleMessageKey = undefined;

    this.idleHintTimer = window.setTimeout(() => {
      this.idleHintTimer = undefined;
      if (this.transitionStarted || this.heldShifts.size > 0) return;
      this.idleMessageKey = 'copy.esperabas-que-empezara-solo-presiona-shift-y-hacemos-c';
      this.operatorPanel?.showMessage(this.idleMessageKey);
    }, StartScene.IDLE_HINT_DELAY_MS);
  }

}

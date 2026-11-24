import Phaser from 'phaser';
import RoomFactory from '../rooms/RoomFactory';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from '../rooms/strategies/RoomBaseStrategy';
import { MORSE_SIGNAL_EVENT } from '../input/MorseInputComponent';
import { morseInput } from '../input/MorseInputComponent';
import { AudioManager } from '../audio/AudioManager';
import AudioToggleEntity from '../entities/AudioToggleEntity';
import ControlMonitorEntity from '../entities/ControlMonitorEntity';
import HintButtonEntity from '../entities/HintButtonEntity';
import OperatorPanelEntity from '../entities/OperatorPanelEntity';
import TypographyEntity from '../entities/TypographyEntity';
import { getRoomNarration } from '../content/roomNarration';
import { REWARDED_HINTS } from '../content/rewardedHints';
import { rewardedHintService } from '../ads/RewardedHintService';
import BootloaderScene from './BootloaderScene';
import { t, type TranslationKey } from '../i18n/i18n';

interface GameSceneData {
  backdoorAttempt?: boolean;
  enteredControlRoomEarly?: boolean;
  entryShiftAlreadyReleased?: boolean;
}

interface PendingShiftPress {
  event: KeyboardEvent;
  timerId: number;
}

type EndingStage = 'narrator' | 'disconnected' | 'transition';

export default class GameScene extends Phaser.Scene {
  private static readonly SHIFT_TAB_GRACE_MS = 180;
  private static readonly ROOM_ADVANCE_DELAY_MS = 900;

  private readonly progress: RoomProgress = { completedRooms: new Set<number>() };
  private readonly physicallyHeldShifts = new Set<ShiftSide>();
  private readonly suppressedShiftReleases = new Set<ShiftSide>();
  private readonly dispatchedShiftPresses = new Set<ShiftSide>();
  private readonly pendingShiftPresses = new Map<ShiftSide, PendingShiftPress>();

  private currentRoomNumber = 0;
  private currentRoom?: RoomBaseStrategy;
  private roomCompleted = false;
  private showingPrototypeEnd = false;
  private returningToStart = false;
  private narrationPhase: 'normal' | 'replay' = 'normal';
  private roomNarrationIndex = 0;
  private inControlRoom = false;
  private endingTransitionInProgress = false;
  private endingStage?: EndingStage;
  private completionTime = '00:00';
  private completionSeconds = 0;
  private completionMilliseconds = 0;
  private readonly endingDisplayObjects: Phaser.GameObjects.GameObject[] = [];
  private waitingForEntryShiftRelease = true;
  private roomAdvanceAvailableAt = 0;

  private roomLabel!: TypographyEntity;
  private hintButton?: HintButtonEntity;
  private runTimerLabel!: TypographyEntity;
  private lastRunTimerText = '';
  private roomPrompt!: TypographyEntity;
  private operatorPanel!: OperatorPanelEntity;
  private roomSelectorButtons: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super('GameScene');
  }

  create(data: GameSceneData = {}): void {
    this.resetRunState(data);
    this.prepareMorse();
    this.createSceneObjects();
    this.bindSceneEvents();
    this.enterRequestedRoom(data);
  }

  private resetRunState(data: GameSceneData): void {
    this.currentRoom = undefined;
    this.currentRoomNumber = 0;
    this.roomCompleted = false;
    this.showingPrototypeEnd = false;
    this.returningToStart = false;
    this.narrationPhase = this.registry.get('narrator-replay-active') === true ? 'replay' : 'normal';
    this.roomNarrationIndex = 0;
    this.inControlRoom = false;
    this.endingTransitionInProgress = false;
    this.endingStage = undefined;
    this.endingDisplayObjects.length = 0;
    this.physicallyHeldShifts.clear();
    this.suppressedShiftReleases.clear();
    this.dispatchedShiftPresses.clear();
    for (const pending of this.pendingShiftPresses.values()) window.clearTimeout(pending.timerId);
    this.pendingShiftPresses.clear();
    this.progress.completedRooms.clear();
    this.progress.firstShiftSide = undefined;
    this.progress.roomNineReturnPending = false;
    this.progress.backdoorAttempt = false;
    this.lastRunTimerText = '';
    this.progress.enteredControlRoomEarly = data.enteredControlRoomEarly ?? false;
    this.waitingForEntryShiftRelease = !data.entryShiftAlreadyReleased;
    this.roomAdvanceAvailableAt = 0;
  }

  private prepareMorse(): void {
    morseInput.setEnabled(false);
  }

  private createSceneObjects(): void {
    this.createBackground();
    this.createRoomLabel();
    this.createRoomPrompt();
    this.createStatusText();
    this.createHintButton();
    if (new URLSearchParams(window.location.search).get('dev') === 'rooms') {
      this.createRoomSelector();
    }
    this.createKeyboardInput();
    this.createAudioControls();
  }

  private bindSceneEvents(): void {
    window.removeEventListener(MORSE_SIGNAL_EVENT, this.handleMorseVictory);
    window.addEventListener(MORSE_SIGNAL_EVENT, this.handleMorseVictory);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.addEventListener('blur', this.handleWindowBlur);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupMorseListener, this);
  }

  private readonly handleWindowBlur = (): void => {
    for (const pending of this.pendingShiftPresses.values()) {
      window.clearTimeout(pending.timerId);
    }
    this.pendingShiftPresses.clear();
    this.physicallyHeldShifts.clear();
    this.suppressedShiftReleases.clear();
    this.dispatchedShiftPresses.clear();
    this.currentRoom?.resetHeldShifts();
    this.currentRoom?.handleShiftVisualUp('left');
    this.currentRoom?.handleShiftVisualUp('right');
    this.waitingForEntryShiftRelease = false;
  };

  private enterRequestedRoom(data: GameSceneData): void {
    this.startRunTimerIfNeeded();

    if (data.backdoorAttempt) {
      this.progress.enteredControlRoomEarly = true;
      this.progress.backdoorAttempt = true;
      const unauthorizedVisits = Number(this.registry.get('shift-control-unauthorized-visits') ?? 0) + 1;
      this.registry.set('shift-control-unauthorized-visits', unauthorizedVisits);
      this.progress.unauthorizedControlRoomVisits = unauthorizedVisits;
      this.registry.set('shift-backdoor-visit-pending', true);
      this.createRoom(0);
      return;
    }

    this.progress.enteredControlRoomEarly = data.enteredControlRoomEarly ?? false;
    this.progress.unauthorizedControlRoomVisits = Number(this.registry.get('shift-control-unauthorized-visits') ?? 0);
    this.createInitialRoom();
  }

  private startRunTimerIfNeeded(): void {
    const startedAt = Number(this.registry.get('shift-run-started-at'));
    if (Number.isFinite(startedAt) && startedAt > 0) return;

    this.registry.set('shift-run-started-at', Date.now());
  }

  override update(_time: number, delta: number): void {
    this.updateCurrentRoom(delta);
    this.updateRunTimer();
  }

  private updateCurrentRoom(delta: number): void {
    if (!this.roomCompleted && !this.showingPrototypeEnd) {
      this.currentRoom?.update(delta);
    }
  }

  public setRoomPrompt(text: string): void {
    this.roomPrompt.setText(text);
  }

  public clearRoomStatus(): void {
    this.operatorPanel.showText('');
  }

  public showHint(text: TranslationKey): void {
    this.operatorPanel.showMessage(text);
  }

  public completeRoom(closingText: TranslationKey): void {
    if (this.roomCompleted) return;

    AudioManager.play(this, 'confirm');
    this.roomCompleted = true;
    this.hintButton?.hideForCompletedRoom();
    this.progress.completedRooms.add(this.currentRoomNumber);
    const requiresBriefDelay = this.currentRoomNumber === 9 || this.currentRoomNumber === 13;
    this.roomAdvanceAvailableAt = Date.now() + (requiresBriefDelay ? GameScene.ROOM_ADVANCE_DELAY_MS : 0);
    const completedRoomNumber = this.currentRoomNumber;
    const localizedClosingText = t(closingText);
    const continuePrompt = t('copy.presiona-shift-para-continuar');
    this.operatorPanel.showText(requiresBriefDelay
      ? localizedClosingText
      : `${localizedClosingText}\n\n${continuePrompt}`);

    if (!requiresBriefDelay) return;

    this.time.delayedCall(GameScene.ROOM_ADVANCE_DELAY_MS, () => {
      if (!this.roomCompleted || this.currentRoomNumber !== completedRoomNumber) return;
      this.operatorPanel.showText(`${localizedClosingText}\n\n${continuePrompt}`);
    });
  }

  public finishGame(closingText: TranslationKey, narratorMessage?: TranslationKey): void {
    if (this.endingTransitionInProgress) return;

    this.completionTime = this.getCompletionTime();
    this.registry.remove([
      'shift-run-started-at',
      'shift-control-unauthorized-visits',
      'shift-backdoor-visit-pending',
    ]);
    this.inControlRoom = false;
    this.returningToStart = false;
    this.showingPrototypeEnd = true;
    this.endingTransitionInProgress = true;
    morseInput.setEnabled(false);
    BootloaderScene.stopBackgroundMusic();

    if (narratorMessage) {
      this.endingStage = 'narrator';
      this.currentRoom?.prepareForEnding();
      this.hideSceneObjectsExcept([
        this.currentRoom?.displayContainer,
        this.operatorPanel,
      ]);
      this.operatorPanel.showText(
        `${t(narratorMessage)}\n\n${t('copy.press-enter-to-finish-ending')}`,
      );
      return;
    }

    this.currentRoom?.exit();
    this.currentRoom = undefined;
    this.showDisconnectedEnding(closingText);
  }

  private showDisconnectedEnding(
    closingText: TranslationKey,
    preserveRoomMonitor = false,
  ): void {
    this.endingStage = 'disconnected';
    this.playDisconnectTone();

    let monitor: ControlMonitorEntity | undefined;
    if (preserveRoomMonitor) {
      this.currentRoom?.prepareForEnding();
      this.hideSceneObjectsExcept([this.currentRoom?.displayContainer]);
    } else {
      this.currentRoom?.exit();
      this.currentRoom = undefined;
      this.hideSceneObjectsExcept([]);
      monitor = new ControlMonitorEntity(this);
    }
    monitor?.setDepth(2000);
    const disconnectedLabel = new TypographyEntity(
      this,
      640,
      245,
      closingText,
      'ending-disconnect',
    ).setDepth(2001);
    const completionTimeLabel = new TypographyEntity(
      this,
      640,
      300,
      `${t('copy.completed-in')} ${this.completionTime}`,
      'ending-time',
    ).setDepth(2001);
    const completionComment = new TypographyEntity(
      this,
      640,
      345,
      this.getCompletionComment(),
      'ending-time-note',
    ).setDepth(2001);
    const continuePrompt = new TypographyEntity(
      this,
      640,
      395,
      'copy.press-enter-to-restart',
      'ending-time-note',
    ).setDepth(2001);
    if (monitor) this.endingDisplayObjects.push(monitor);
    this.endingDisplayObjects.push(
      disconnectedLabel,
      completionTimeLabel,
      completionComment,
      continuePrompt,
    );

  }

  private getCompletionTime(): string {
    const startedAt = Number(this.registry.get('shift-run-started-at'));
    this.completionMilliseconds = Number.isFinite(startedAt) && startedAt > 0
      ? Math.max(0, Date.now() - startedAt)
      : 0;
    this.completionSeconds = Math.floor(this.completionMilliseconds / 1000);
    const hours = Math.floor(this.completionSeconds / 3600);
    const minutes = Math.floor((this.completionSeconds % 3600) / 60);
    const seconds = this.completionSeconds % 60;
    const formattedTime = hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(Math.floor(this.completionSeconds / 60)).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    this.registry.set('shift-last-completion-time', formattedTime);
    return formattedTime;
  }

  private getCompletionComment(): TranslationKey {
    if (this.completionMilliseconds <= 30_000) return 'copy.completion-under-30-seconds';
    if (this.completionMilliseconds < 60_000) return 'copy.completion-under-one-minute';
    if (this.completionMilliseconds <= 5 * 60_000) return 'copy.completion-under-five-minutes';
    if (this.completionMilliseconds <= 10 * 60_000) return 'copy.completion-under-ten-minutes';
    if (this.completionMilliseconds <= 20 * 60_000) return 'copy.completion-under-twenty-minutes';
    return 'copy.completion-over-twenty-minutes';
  }

  private hideSceneObjectsExcept(preservedObjects: Array<Phaser.GameObjects.GameObject | undefined>): void {
    const preserved = new Set(preservedObjects.filter(
      (object): object is Phaser.GameObjects.GameObject => object !== undefined,
    ));
    this.children.list.forEach((child) => {
      if (preserved.has(child)) return;
      (child as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible).setVisible(false);
    });
  }

  private handleEndingInput(event: KeyboardEvent): void {
    if (event.repeat) return;

    const isEnter = event.code === 'Enter' || event.code === 'NumpadEnter';
    if (this.endingStage === 'narrator' && isEnter) {
      event.preventDefault();
      this.showDisconnectedEnding('copy.operador-desconectado', true);
      return;
    }

    if (
      this.endingStage === 'disconnected'
      && isEnter
    ) {
      event.preventDefault();
      this.returnToTitleAfterEnding();
    }
  }

  private returnToTitleAfterEnding(): void {
    if (this.endingStage !== 'disconnected') return;

    this.endingStage = 'transition';
    this.endingDisplayObjects.forEach((object) => object.destroy());
    this.endingDisplayObjects.length = 0;
    this.currentRoom?.exit();
    this.currentRoom = undefined;
    this.cameras.main.setBackgroundColor('#ffffff');
    AudioManager.play(this, 'enter');
    this.time.delayedCall(2000, () => {
      this.registry.set('operator-new-session-pending', true);
      this.scene.start('StartScene');
    });
  }

  public returnToStart(): void {
    this.scene.start('StartScene');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private createRoomLabel(): void {
    this.roomLabel = new TypographyEntity(this, 640, 56, '', 'room-number');
    this.runTimerLabel = new TypographyEntity(this, 32, 56, '00:00', 'run-timer')
      .setOrigin(0, 0.5);
  }

  private updateRunTimer(): void {
    if (!this.runTimerLabel?.visible || this.endingStage) return;

    const startedAt = Number(this.registry.get('shift-run-started-at'));
    if (!Number.isFinite(startedAt) || startedAt <= 0) return;

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    const text = hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (text === this.lastRunTimerText) return;
    this.lastRunTimerText = text;
    this.runTimerLabel.setText(text);
  }

  private createRoomPrompt(): void {
    this.roomPrompt = new TypographyEntity(this, 640, 350, '', 'room-prompt');
  }

  private createStatusText(): void {
    this.operatorPanel = new OperatorPanelEntity(this);
  }

  private createHintButton(): void {
    if (!rewardedHintService.isAvailable) return;
    this.hintButton = new HintButtonEntity(this, this.requestRewardedHint);
  }

  private readonly requestRewardedHint = (): void => {
    const roomNumber = this.currentRoomNumber;
    const pauseForAd = rewardedHintService.pausesGame;

    if (pauseForAd) {
      this.sound.pauseAll();
      this.scene.pause();
    }

    const accepted = rewardedHintService.showRewardedHint(
      () => {
        if (roomNumber !== this.currentRoomNumber || this.endingTransitionInProgress) return;
        const hint = REWARDED_HINTS[roomNumber];
        if (!hint) return;
        this.showHint(hint);
        this.hintButton?.markUsed();
      },
      (rewarded) => {
        if (!pauseForAd) return;
        if (!rewarded && roomNumber === this.currentRoomNumber && !this.endingTransitionInProgress) {
          this.showHint('copy.hint-ad-not-completed');
        }
        this.sound.resumeAll();
        this.scene.resume('GameScene');
      },
    );

    if (!accepted) {
      if (pauseForAd) {
        this.sound.resumeAll();
        this.scene.resume('GameScene');
      }
      this.showHint('copy.hint-ad-unavailable');
    }
  };

  private createAudioControls(): void {
    AudioManager.attach(this);
    new AudioToggleEntity(this);
  }

  private createRoomSelector(): void {
    this.roomSelectorButtons = [];
    new TypographyEntity(this, 1080, 26, 'copy.dev-salas', 'dev-label').setOrigin(0, 0.5);

    for (let roomNumber = 0; roomNumber <= RoomFactory.roomCount; roomNumber += 1) {
      const column = roomNumber % 3;
      const row = Math.floor(roomNumber / 3);
      const x = 1096 + column * 52;
      const y = 57 + row * 38;
      const button = this.add
        .rectangle(x, y, 42, 28, 0xffffff)
        .setStrokeStyle(1, 0x999999)
        .setInteractive({ useHandCursor: true });
      this.roomSelectorButtons.push(button);

      button.on('pointerdown', () => this.selectRoom(roomNumber));
      button.on('pointerover', () => button.setFillStyle(0xf2f2f2));
      button.on('pointerout', () => button.setFillStyle(0xffffff));

      new TypographyEntity(
        this,
        x,
        y,
        roomNumber === 0 ? 'CTRL' : String(roomNumber).padStart(2, '0'),
        roomNumber === 0 ? 'control-selector' : 'room-selector',
      );
    }
  }

  private createKeyboardInput(): void {
    this.input.keyboard?.on('keydown', this.handleKeyDown, this);
    this.input.keyboard?.on('keyup', this.handleKeyUp, this);
  }

  private createInitialRoom(): void {
    this.createRoom(1);
  }

  private selectRoom(roomNumber: number): void {
    this.showingPrototypeEnd = false;
    this.returningToStart = false;
    this.inControlRoom = false;
    this.createRoom(roomNumber);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.endingStage) {
      this.handleEndingInput(event);
      return;
    }
    if (this.endingTransitionInProgress) return;

    if (event.code === 'Tab') {
      const isShiftTab = event.shiftKey || this.physicallyHeldShifts.size > 0;
      if (isShiftTab) {
        event.preventDefault();
        this.handleShiftTab();
        return;
      }

      if (this.currentRoomNumber === 8) {
        event.preventDefault();
        if (!this.waitingForEntryShiftRelease && !this.roomCompleted && !this.showingPrototypeEnd) {
          this.currentRoom?.handleKeyDown(event);
        }
        return;
      }

      return;
    }

    const side = RoomBaseStrategy.getShiftSide(event.code);
    if (!side) {
      if (this.waitingForEntryShiftRelease || this.roomCompleted || this.showingPrototypeEnd) return;
      this.currentRoom?.handleKeyDown(event);
      return;
    }

    if (event.repeat || this.physicallyHeldShifts.has(side)) return;

    this.physicallyHeldShifts.add(side);

    if (this.waitingForEntryShiftRelease) return;
    if (!this.showingPrototypeEnd) this.currentRoom?.handleShiftVisualDown(side);

    const timerId = window.setTimeout(
      () => this.dispatchPendingShiftPress(side),
      GameScene.SHIFT_TAB_GRACE_MS,
    );
    this.pendingShiftPresses.set(side, { event, timerId });
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (this.endingStage) return;

    const side = RoomBaseStrategy.getShiftSide(event.code);
    if (!side) {
      if (!this.waitingForEntryShiftRelease && !this.roomCompleted && !this.showingPrototypeEnd) {
        this.currentRoom?.handleKeyUp(event);
      }
      return;
    }

    this.physicallyHeldShifts.delete(side);
    this.currentRoom?.handleShiftVisualUp(side);

    if (this.suppressedShiftReleases.delete(side)) {
      this.waitingForEntryShiftRelease = false;
      return;
    }

    if (this.waitingForEntryShiftRelease) {
      this.waitingForEntryShiftRelease = false;
      return;
    }

    const pending = this.pendingShiftPresses.get(side);
    if (pending) {
      window.clearTimeout(pending.timerId);
      this.pendingShiftPresses.delete(side);
      this.dispatchShiftPress(side, pending.event);
    }

    if (!this.dispatchedShiftPresses.delete(side)) return;
    if (this.showingPrototypeEnd) return;
    if (this.roomCompleted) return;

    this.currentRoom?.handleKeyUp(event);
  };

  private dispatchPendingShiftPress(side: ShiftSide): void {
    const pending = this.pendingShiftPresses.get(side);
    if (!pending) return;

    this.pendingShiftPresses.delete(side);
    this.dispatchShiftPress(side, pending.event);
  }

  private dispatchShiftPress(side: ShiftSide, event: KeyboardEvent): void {
    this.dispatchedShiftPresses.add(side);

    if (this.showingPrototypeEnd) {
      if (!this.endingTransitionInProgress) this.scene.start('StartScene');
      return;
    }

    if (this.roomCompleted) {
      if (Date.now() < this.roomAdvanceAvailableAt) return;
      if (this.returningToStart && !this.inControlRoom) {
        this.showHint('copy.eso-sigamos-hacia-adelante-no-hay-ningun-motivo-para-v');
        return;
      }
      this.advanceRoom();
      return;
    }

    this.currentRoom?.handleKeyDown(event);
  }

  private handleShiftTab(): void {
    for (const side of this.physicallyHeldShifts) {
      this.suppressedShiftReleases.add(side);
      this.dispatchedShiftPresses.delete(side);
    }

    for (const pending of this.pendingShiftPresses.values()) {
      window.clearTimeout(pending.timerId);
    }
    this.pendingShiftPresses.clear();

    if (this.inControlRoom) {
      this.currentRoom?.handleShiftTab();
      return;
    }

    if (this.currentRoomNumber === 14 && !this.returningToStart) {
      this.currentRoom?.handleShiftTab();
      this.returningToStart = true;
      this.createRoom(13);
      return;
    }

    if (this.returningToStart) {
      if (this.currentRoomNumber <= 1) {
        this.createRoom(0);
      } else {
        this.createRoom(this.currentRoomNumber - 1);
      }
      return;
    }

    if (this.currentRoomNumber === 1) {
      this.enterBackdoorControlRoom();
      return;
    }

    this.currentRoom?.handleShiftTab();

    if (this.currentRoomNumber <= 1) {
      this.showHint('copy.no-hay-una-sala-anterior-todavia');
      return;
    }

    this.createRoom(this.currentRoomNumber - 1);
  }

  private enterBackdoorControlRoom(): void {
    this.progress.enteredControlRoomEarly = true;
    this.progress.backdoorAttempt = true;
    const visits = Number(this.registry.get('shift-control-unauthorized-visits') ?? 0) + 1;
    this.registry.set('shift-control-unauthorized-visits', visits);
    this.registry.set('shift-backdoor-visit-pending', true);
    this.progress.unauthorizedControlRoomVisits = visits;
    this.createRoom(0);
  }

  private createRoom(roomNumber: number, carryShiftIntoReleaseRoom = false): void {
    this.currentRoom?.exit();
    this.roomNarrationIndex = 0;
    morseInput.setEnabled(roomNumber === 0);
    const room = RoomFactory.create(roomNumber, this, this.progress, this.createRoomActions(roomNumber));

    if (!room) {
      this.currentRoom = undefined;
      this.showPrototypeEnd();
      return;
    }

    this.currentRoomNumber = roomNumber;
    this.currentRoom = room;
    this.roomCompleted = false;
    this.hintButton?.resetForRoom();
    if (roomNumber === 0 && this.progress.backdoorAttempt) {
      this.hintButton?.hideForCompletedRoom();
    } else {
      this.hintButton?.setVisible(true);
    }
    this.inControlRoom = roomNumber === 0;
    this.roomLabel.setText(roomNumber === 0 ? t('copy.control') : String(roomNumber).padStart(2, '0'));
    this.roomLabel.setVisible(roomNumber !== 0);
    this.operatorPanel.setY(roomNumber === 0 ? 640 : 620);
    const heldShiftsAtEntry = roomNumber === 12 && !carryShiftIntoReleaseRoom
      ? []
      : [...this.physicallyHeldShifts];
    room.enter(heldShiftsAtEntry);

    if (this.inControlRoom) {
      if (this.narrationPhase === 'replay' && !this.progress.backdoorAttempt) {
        const controlPhase = this.returningToStart ? 'second-return' : 'replay';
        const openingNarration = getRoomNarration(controlPhase, 0);
        if (openingNarration) this.showHint(openingNarration);
        this.roomNarrationIndex = 1;
      }
      return;
    }

    if (this.returningToStart) {
      this.roomSelectorButtons.forEach((button) => button.disableInteractive());
      room.disableInteractions();
      this.roomCompleted = true;
      const returnPhase = this.narrationPhase === 'replay' ? 'second-return' : 'return';
      this.showHint(getRoomNarration(returnPhase, roomNumber) ?? 'copy.no-hace-falta-seguir-retrocediendo');
      return;
    }

    if (this.narrationPhase === 'replay' && this.roomNarrationIndex === 0) {
      const replayNarration = this.getNextRoomNarration(roomNumber);
      if (replayNarration) this.showHint(replayNarration);
    }

    if (this.progress.completedRooms.has(roomNumber)) {
      this.completeRoom('copy.esta-ya-la-conoces-no-hace-falta-volver-a-resolverla');
    }
  }

  private advanceRoom(): void {
    if (this.currentRoomNumber === 8 && this.progress.roomNineReturnPending) {
      this.progress.roomNineReturnPending = false;
      this.createRoom(9);
      return;
    }

    let nextRoom = this.currentRoomNumber + 1;
    while (nextRoom < 8 && this.progress.completedRooms.has(nextRoom)) nextRoom += 1;
    if (nextRoom === 8 && this.progress.roomNineReturnPending) {
      this.createRoom(8);
      return;
    }
    while (this.progress.completedRooms.has(nextRoom)) nextRoom += 1;
    this.createRoom(nextRoom, this.currentRoomNumber === 11 && nextRoom === 12);
  }

  private showPrototypeEnd(): void {
    this.showingPrototypeEnd = true;
    this.hintButton?.hideForCompletedRoom();
    this.currentRoom = undefined;
    this.roomLabel.setText('SHIFT');
    this.roomPrompt.setMessage('copy.fin-del-prototipo');
    this.operatorPanel.showMessage('copy.presiona-shift-para-volver-al-inicio');
  }

  private createRoomActions(roomNumber: number): RoomActions {
    return {
      setRoomPrompt: (text) => this.setRoomPrompt(text),
      clearRoomStatus: () => this.clearRoomStatus(),
      showHint: (text) => this.showHint(this.getRoomCopy(roomNumber, text)),
      completeRoom: (text) => this.completeRoom(this.getRoomCopy(roomNumber, text)),
      finishGame: (text) => this.finishGame(text),
      returnToStart: () => this.returnToStart(),
    };
  }

  private getRoomCopy(roomNumber: number, fallback: TranslationKey): TranslationKey {
    if (this.narrationPhase !== 'replay') return fallback;
    const phase = this.returningToStart ? 'second-return' : 'replay';
    // Keep control-room phase narration out of ordinary menu navigation. Its second
    // line is reserved for the exact Shift+ArrowDown action that reveals the option.
    if (roomNumber === 0) {
      if (fallback !== 'copy.y-si-todo-es-con-shift-aca-hasta-para-encontrar-esta-o') return fallback;
      return this.getNextRoomNarration(0, phase) ?? fallback;
    }
    return this.getNextRoomNarration(roomNumber, phase) ?? fallback;
  }

  private getNextRoomNarration(
    roomNumber: number,
    phase: 'replay' | 'second-return' = 'replay',
  ): TranslationKey | undefined {
    const narration = getRoomNarration(phase, roomNumber, this.roomNarrationIndex);
    if (narration) this.roomNarrationIndex += 1;
    return narration;
  }

  private readonly handleMorseVictory = (event: Event): void => {
    if (this.endingTransitionInProgress) return;

    const signal = (event as CustomEvent<'SOS' | 'WIN'>).detail;
    if (signal === 'WIN') {
      if (
        this.currentRoomNumber !== 0
        || !this.progress.backdoorAttempt
        || (this.progress.unauthorizedControlRoomVisits ?? 0) < 3
      ) return;
      this.finishGame(
        'copy.operador-desconectado',
        'copy.pudiste-apagarlo-no-era-la-idea',
      );
      return;
    }

    if (this.currentRoomNumber === 0 && this.progress.backdoorAttempt) {
      this.showHint('copy.no-era-sos-el-codigo-es-win');
      return;
    }

    // In the radio room, SOS is the normal puzzle solution and must lead to its main ending.
    if (this.currentRoomNumber === 13) return;
    this.scene.start('MorseVictoryScene', { signal: 'SOS' });
  };

  private cleanupMorseListener(): void {
    window.removeEventListener(MORSE_SIGNAL_EVENT, this.handleMorseVictory);
    window.removeEventListener('blur', this.handleWindowBlur);
  }

  private playDisconnectTone(): void {
    if (!(this.sound instanceof Phaser.Sound.WebAudioSoundManager) || this.sound.mute) return;

    const { context, masterMuteNode } = this.sound;
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    gain.connect(masterMuteNode);

    for (const frequency of [48, 50.2]) {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 1.85);
    }
  }

}

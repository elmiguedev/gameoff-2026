import Phaser from 'phaser';
import RoomFactory from '../rooms/RoomFactory';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from '../rooms/strategies/RoomStrategy';
import { MORSE_EASTER_EGG_EVENT } from '../input/ShiftMorseEasterEgg';
import { shiftMorseEasterEgg } from '../input/ShiftMorseEasterEgg';
import { addAudioToggle, bindMouseClickSound, playSound } from '../audio/AudioControls';
import { getRoomNarration } from '../content/roomNarration';
import { createControlMonitor } from '../rooms/ControlMonitor';
import BootloaderScene from './BootloaderScene';

interface GameSceneData {
  backdoorAttempt?: boolean;
  enteredControlRoomEarly?: boolean;
  entryShiftAlreadyReleased?: boolean;
}

interface PendingShiftPress {
  event: KeyboardEvent;
  timerId: number;
}

export default class GameScene extends Phaser.Scene {
  private static readonly SHIFT_TAB_GRACE_MS = 180;
  private static readonly ROOM_ADVANCE_DELAY_MS = 900;

  private readonly progress: RoomProgress = { completedRooms: new Set<number>() };
  private readonly physicallyHeldShifts = new Set<ShiftSide>();
  private readonly suppressedShiftReleases = new Set<ShiftSide>();
  private readonly dispatchedShiftPresses = new Set<ShiftSide>();
  private readonly pendingShiftPresses = new Map<ShiftSide, PendingShiftPress>();

  private currentRoomNumber = 0;
  private currentRoom?: RoomStrategy;
  private roomCompleted = false;
  private showingPrototypeEnd = false;
  private returningToStart = false;
  private narrationPhase: 'normal' | 'replay' = 'normal';
  private roomNarrationIndex = 0;
  private inControlRoom = false;
  private endingTransitionInProgress = false;
  private waitingForEntryShiftRelease = true;
  private roomAdvanceAvailableAt = 0;

  private roomLabel!: Phaser.GameObjects.Text;
  private roomPrompt!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private roomSelectorButtons: Phaser.GameObjects.Rectangle[] = [];

  constructor() {
    super('GameScene');
  }

  create(data: GameSceneData = {}): void {
    this.currentRoom = undefined;
    this.currentRoomNumber = 0;
    this.roomCompleted = false;
    this.showingPrototypeEnd = false;
    this.returningToStart = false;
    this.narrationPhase = this.registry.get('narrator-replay-active') === true ? 'replay' : 'normal';
    this.roomNarrationIndex = 0;
    this.inControlRoom = false;
    this.endingTransitionInProgress = false;
    shiftMorseEasterEgg.setEnabled(false);
    this.physicallyHeldShifts.clear();
    this.suppressedShiftReleases.clear();
    this.dispatchedShiftPresses.clear();
    for (const pending of this.pendingShiftPresses.values()) window.clearTimeout(pending.timerId);
    this.pendingShiftPresses.clear();
    this.progress.completedRooms.clear();
    this.progress.firstShiftSide = undefined;
    this.progress.roomNineReturnPending = false;
    this.progress.backdoorAttempt = false;
    this.progress.enteredControlRoomEarly = data.enteredControlRoomEarly ?? false;
    this.waitingForEntryShiftRelease = !data.entryShiftAlreadyReleased;
    this.roomAdvanceAvailableAt = 0;
    this.createBackground();
    this.createRoomLabel();
    this.createRoomPrompt();
    this.createStatusText();
    if (new URLSearchParams(window.location.search).get('dev') === 'rooms') {
      this.createRoomSelector();
    }
    this.createKeyboardInput();
    addAudioToggle(this);
    bindMouseClickSound(this);
    window.removeEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
    window.addEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanupMorseListener, this);

    if (data.backdoorAttempt) {
      this.progress.enteredControlRoomEarly = true;
      this.progress.backdoorAttempt = true;
      const unauthorizedVisits = Number(this.registry.get('shift-control-unauthorized-visits') ?? 0) + 1;
      this.registry.set('shift-control-unauthorized-visits', unauthorizedVisits);
      this.progress.unauthorizedControlRoomVisits = unauthorizedVisits;
      this.registry.set('shift-backdoor-visit-pending', true);
      this.createRoom(0);
    } else {
      this.progress.enteredControlRoomEarly = data.enteredControlRoomEarly ?? false;
      this.progress.unauthorizedControlRoomVisits = Number(this.registry.get('shift-control-unauthorized-visits') ?? 0);
      this.createInitialRoom();
    }
  }

  override update(_time: number, delta: number): void {
    if (!this.roomCompleted && !this.showingPrototypeEnd) {
      this.currentRoom?.update(delta);
    }
  }

  public setRoomPrompt(text: string): void {
    this.roomPrompt.setText(text);
  }

  public clearRoomStatus(): void {
    this.statusText.setText('');
  }

  public showHint(text: string): void {
    this.statusText.setText(text);
  }

  public completeRoom(closingText: string): void {
    if (this.roomCompleted) return;

    playSound(this, 'confirm');
    this.roomCompleted = true;
    this.progress.completedRooms.add(this.currentRoomNumber);
    const requiresBriefDelay = this.currentRoomNumber === 9 || this.currentRoomNumber === 13;
    this.roomAdvanceAvailableAt = Date.now() + (requiresBriefDelay ? GameScene.ROOM_ADVANCE_DELAY_MS : 0);
    const completedRoomNumber = this.currentRoomNumber;
    this.statusText.setText(requiresBriefDelay
      ? closingText
      : `${closingText}\n\nPRESIONÁ SHIFT PARA CONTINUAR`);

    if (!requiresBriefDelay) return;

    this.time.delayedCall(GameScene.ROOM_ADVANCE_DELAY_MS, () => {
      if (!this.roomCompleted || this.currentRoomNumber !== completedRoomNumber) return;
      this.statusText.setText(`${closingText}\n\nPRESIONÁ SHIFT PARA CONTINUAR`);
    });
  }

  public finishGame(closingText: string): void {
    this.currentRoom?.exit();
    this.currentRoom = undefined;
    this.inControlRoom = false;
    this.returningToStart = false;
    this.showingPrototypeEnd = true;
    this.endingTransitionInProgress = true;
    BootloaderScene.stopBackgroundMusic();
    this.playDisconnectTone();

    this.children.list.forEach((child) => {
      (child as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible).setVisible(false);
    });
    const monitor = createControlMonitor(this).setDepth(2000);
    const disconnectedLabel = this.addText(640, 340, closingText, {
      color: '#f2f2f2',
      fontSize: '26px',
      align: 'center',
    }).setOrigin(0.5).setDepth(2001);

    this.time.delayedCall(3000, () => {
      disconnectedLabel.destroy();
      playSound(this, 'enter');
      this.time.delayedCall(2000, () => {
        this.cameras.main.setBackgroundColor('#ffffff');
        monitor.destroy();
        playSound(this, 'enter');
        this.time.delayedCall(2000, () => {
          this.registry.set('operator-new-session-pending', true);
          this.scene.start('StartScene');
        });
      });
    });
  }

  public returnToStart(): void {
    this.scene.start('StartScene');
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private createRoomLabel(): void {
    this.roomLabel = this.addText(640, 56, '', {
      color: '#555555',
      fontFamily: 'IBM Plex Sans, Arial, sans-serif',
      fontSize: '24px',
      fontStyle: '300',
    }).setOrigin(0.5, 0.5);
  }

  private createRoomPrompt(): void {
    this.roomPrompt = this.addText(640, 350, '', {
      color: '#111111',
      fontSize: '56px',
      fontStyle: '500',
    }).setOrigin(0.5);
  }

  private createStatusText(): void {
    this.statusText = this.addText(640, 620, '', {
      color: '#222222',
      fontSize: '19px',
      fontStyle: '500',
      lineSpacing: 6,
      align: 'center',
      wordWrap: {
        width: (1280 * 2) / 3,
        useAdvancedWrap: true,
      },
    }).setOrigin(0.5);
  }

  private createRoomSelector(): void {
    this.roomSelectorButtons = [];
    this.addText(1080, 26, 'DEV · SALAS', {
      color: '#888888',
      fontSize: '12px',
    }).setOrigin(0, 0.5);

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

      this.addText(x, y, roomNumber === 0 ? 'CTRL' : String(roomNumber).padStart(2, '0'), {
        color: '#333333',
        fontSize: roomNumber === 0 ? '9px' : '12px',
      }).setOrigin(0.5);
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

    const side = RoomStrategy.getShiftSide(event.code);
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
    const side = RoomStrategy.getShiftSide(event.code);
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
        this.showHint('Eso. Sigamos hacia adelante. No hay ningún motivo para volver sobre tus pasos.');
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

    this.currentRoom?.handleShiftTab();

    if (this.currentRoomNumber <= 1) {
      this.showHint('No hay una sala anterior. Todavía.');
      return;
    }

    this.createRoom(this.currentRoomNumber - 1);
  }

  private createRoom(roomNumber: number, carryShiftIntoReleaseRoom = false): void {
    this.currentRoom?.exit();
    this.roomNarrationIndex = 0;
    shiftMorseEasterEgg.setEnabled(roomNumber === 0);
    const room = RoomFactory.create(roomNumber, this, this.progress, this.createRoomActions(roomNumber));

    if (!room) {
      this.currentRoom = undefined;
      this.showPrototypeEnd();
      return;
    }

    this.currentRoomNumber = roomNumber;
    this.currentRoom = room;
    this.roomCompleted = false;
    this.inControlRoom = roomNumber === 0;
    this.roomLabel.setText(roomNumber === 0 ? 'CONTROL' : String(roomNumber).padStart(2, '0'));
    this.roomLabel.setVisible(roomNumber !== 0);
    this.statusText.setY(roomNumber === 0 ? 640 : 620);
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
      this.statusText.setText(getRoomNarration(returnPhase, roomNumber) ?? 'No hace falta seguir retrocediendo.');
      return;
    }

    if (this.narrationPhase === 'replay' && this.roomNarrationIndex === 0) {
      const replayNarration = this.getNextRoomNarration(roomNumber);
      if (replayNarration) this.showHint(replayNarration);
    }

    if (this.progress.completedRooms.has(roomNumber)) {
      this.completeRoom('Esta ya la conocés. No hace falta volver a resolverla.');
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
    this.currentRoom = undefined;
    this.roomLabel.setText('SHIFT');
    this.roomPrompt.setText('FIN DEL PROTOTIPO');
    this.statusText.setText('PRESIONÁ SHIFT PARA VOLVER AL INICIO');
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

  private getRoomCopy(roomNumber: number, fallback: string): string {
    if (this.narrationPhase !== 'replay') return fallback;
    const phase = this.returningToStart ? 'second-return' : 'replay';
    // Keep control-room phase narration out of ordinary menu navigation. Its second
    // line is reserved for the exact Shift+ArrowDown action that reveals the option.
    if (roomNumber === 0) {
      if (!fallback.startsWith('...Y sí, todo es con Shift acá.')) return fallback;
      return this.getNextRoomNarration(0, phase) ?? fallback;
    }
    return this.getNextRoomNarration(roomNumber, phase) ?? fallback;
  }

  private getNextRoomNarration(
    roomNumber: number,
    phase: 'replay' | 'second-return' = 'replay',
  ): string | undefined {
    const narration = getRoomNarration(phase, roomNumber, this.roomNarrationIndex);
    if (narration) this.roomNarrationIndex += 1;
    return narration;
  }

  private readonly handleMorseVictory = (event: Event): void => {
    const signal = (event as CustomEvent<'SOS' | 'WIN'>).detail;
    if (signal === 'WIN') {
      if (this.currentRoomNumber !== 0 || (this.progress.unauthorizedControlRoomVisits ?? 0) < 3) return;
      this.scene.start('MorseVictoryScene', { signal });
      return;
    }

    // In the radio room, SOS is the normal puzzle solution and must lead to its main ending.
    if (this.currentRoomNumber === 13) return;
    this.scene.start('MorseVictoryScene', { signal: 'SOS' });
  };

  private cleanupMorseListener(): void {
    window.removeEventListener(MORSE_EASTER_EGG_EVENT, this.handleMorseVictory);
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

  private addText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, text, {
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        ...style,
      })
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));
  }
}

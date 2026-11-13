import Phaser from 'phaser';
import RoomFactory from '../rooms/RoomFactory';
import RoomStrategy, { type RoomProgress } from '../rooms/strategies/RoomStrategy';

export default class GameScene extends Phaser.Scene {
  private readonly progress: RoomProgress = {};
  private currentRoomNumber = 0;
  private currentRoom?: RoomStrategy;
  private roomCompleted = false;
  private showingPrototypeEnd = false;
  private waitingForEntryShiftRelease = true;

  private roomLabel!: Phaser.GameObjects.Text;
  private roomPrompt!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.createBackground();
    this.createRoomLabel();
    this.createRoomPrompt();
    this.createStatusText();
    this.createKeyboardInput();
    this.createInitialRoom();
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

    this.roomCompleted = true;
    this.statusText.setText(`${closingText}\n\nPRESIONÁ SHIFT PARA CONTINUAR`);
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private createRoomLabel(): void {
    this.roomLabel = this.addText(72, 56, '', {
      color: '#777777',
      fontSize: '16px',
    }).setOrigin(0, 0.5);
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
      color: '#555555',
      fontSize: '18px',
    }).setOrigin(0.5);
  }

  private createKeyboardInput(): void {
    this.input.keyboard?.on('keydown', this.handleKeyDown, this);
    this.input.keyboard?.on('keyup', this.handleKeyUp, this);
  }

  private createInitialRoom(): void {
    this.createRoom(1);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat || !RoomStrategy.isShiftCode(event.code)) return;
    if (this.waitingForEntryShiftRelease) return;

    if (this.showingPrototypeEnd) {
      this.scene.start('StartScene');
      return;
    }

    if (this.roomCompleted) {
      this.advanceRoom();
      return;
    }

    this.currentRoom?.handleKeyDown(event);
  };

  private readonly handleKeyUp = (event: KeyboardEvent): void => {
    if (!RoomStrategy.isShiftCode(event.code)) return;

    if (this.waitingForEntryShiftRelease) {
      this.waitingForEntryShiftRelease = false;
      return;
    }

    if (this.roomCompleted || this.showingPrototypeEnd) return;
    this.currentRoom?.handleKeyUp(event);
  };

  private createRoom(roomNumber: number): void {
    const room = RoomFactory.create(roomNumber, this, this.progress);

    if (!room) {
      this.showPrototypeEnd();
      return;
    }

    this.currentRoomNumber = roomNumber;
    this.currentRoom = room;
    this.roomCompleted = false;
    this.roomLabel.setText(`SALA ${String(roomNumber).padStart(2, '0')}`);
    room.enter();
  }

  private advanceRoom(): void {
    this.createRoom(this.currentRoomNumber + 1);
  }

  private showPrototypeEnd(): void {
    this.showingPrototypeEnd = true;
    this.currentRoom = undefined;
    this.roomLabel.setText('SHIFT');
    this.roomPrompt.setText('FIN DEL PROTOTIPO');
    this.statusText.setText('PRESIONÁ SHIFT PARA VOLVER AL INICIO');
  }

  private addText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
  ): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, text, {
        ...style,
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
      })
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));
  }
}

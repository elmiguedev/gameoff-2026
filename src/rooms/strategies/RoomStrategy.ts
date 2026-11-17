import type Phaser from 'phaser';

export type ShiftSide = 'left' | 'right';

export interface RoomProgress {
  firstShiftSide?: ShiftSide;
  completedRooms: Set<number>;
  roomNineReturnPending?: boolean;
  enteredControlRoomEarly?: boolean;
  backdoorAttempt?: boolean;
}

export interface RoomActions {
  setRoomPrompt(text: string): void;
  clearRoomStatus(): void;
  showHint(text: string): void;
  completeRoom(closingText: string): void;
  finishGame(closingText: string): void;
  returnToStart(): void;
}

/** Shared room behavior; concrete strategies only implement their puzzle rules. */
export default abstract class RoomStrategy {
  private readonly heldShifts = new Set<ShiftSide>();
  private readonly roomContainer: Phaser.GameObjects.Container;

  protected constructor(
    protected readonly scene: Phaser.Scene,
    protected readonly progress: RoomProgress,
    protected readonly actions: RoomActions,
  ) {
    this.roomContainer = scene.add.container(0, 0);
  }

  abstract readonly prompt: string;

  enter(heldShifts: ShiftSide[] = []): void {
    this.heldShifts.clear();
    this.actions.setRoomPrompt(this.prompt);
    this.actions.clearRoomStatus();
    this.onEnter();

    for (const side of heldShifts) {
      this.heldShifts.add(side);
      this.onShiftHeldAtEntry(side);
    }
  }

  exit(): void {
    this.roomContainer.destroy(true);
  }

  handleKeyDown(event: KeyboardEvent): void {
    const side = RoomStrategy.getShiftSide(event.code);
    if (!side) {
      this.onKeyDown(event);
      return;
    }

    if (event.repeat || this.heldShifts.has(side)) return;

    this.heldShifts.add(side);
    this.onShiftDown(side, event);
  }

  handleShiftVisualDown(side: ShiftSide): void {
    this.onShiftVisualDown(side);
  }

  handleShiftVisualUp(side: ShiftSide): void {
    this.onShiftVisualUp(side);
  }

  handleKeyUp(event: KeyboardEvent): void {
    const side = RoomStrategy.getShiftSide(event.code);
    if (!side) {
      this.onKeyUp(event);
      return;
    }

    this.heldShifts.delete(side);
    this.onShiftUp(side, event);
  }

  handleShiftTab(): void {
    this.onShiftTab();
  }

  update(_delta: number): void {}

  protected isShiftHeld(side?: ShiftSide): boolean {
    return side ? this.heldShifts.has(side) : this.heldShifts.size > 0;
  }

  protected showHint(text: string): void {
    this.actions.showHint(text);
  }

  protected complete(closingText: string): void {
    this.actions.completeRoom(closingText);
  }

  protected finishGame(closingText: string): void {
    this.actions.finishGame(closingText);
  }

  protected returnToStart(): void {
    this.actions.returnToStart();
  }

  protected addRoomObject<T extends Phaser.GameObjects.GameObject>(object: T): T {
    this.roomContainer.add(object);
    return object;
  }

  protected onEnter(): void {}

  protected onShiftHeldAtEntry(_side: ShiftSide): void {}

  protected onShiftVisualDown(_side: ShiftSide): void {}

  protected onShiftVisualUp(_side: ShiftSide): void {}

  protected onShiftTab(): void {}

  protected onKeyDown(_event: KeyboardEvent): void {}

  protected onKeyUp(_event: KeyboardEvent): void {}

  protected abstract onShiftDown(side: ShiftSide, event: KeyboardEvent): void;

  protected onShiftUp(_side: ShiftSide, _event: KeyboardEvent): void {}

  static getShiftSide(code: string): ShiftSide | undefined {
    if (code === 'ShiftLeft') return 'left';
    if (code === 'ShiftRight') return 'right';
    return undefined;
  }
}

import type GameScene from '../../scenes/GameScene';

export type ShiftSide = 'left' | 'right';

export interface RoomProgress {
  firstShiftSide?: ShiftSide;
}

/** Shared room behavior; concrete strategies only implement their puzzle rules. */
export default abstract class RoomStrategy {
  private readonly heldShifts = new Set<ShiftSide>();

  protected constructor(
    protected readonly scene: GameScene,
    protected readonly progress: RoomProgress,
  ) {}

  abstract readonly prompt: string;

  enter(): void {
    this.heldShifts.clear();
    this.scene.setRoomPrompt(this.prompt);
    this.scene.clearRoomStatus();
    this.onEnter();
  }

  handleKeyDown(event: KeyboardEvent): void {
    const side = RoomStrategy.getShiftSide(event.code);
    if (!side || event.repeat || this.heldShifts.has(side)) return;

    this.heldShifts.add(side);
    this.onShiftDown(side);
  }

  handleKeyUp(event: KeyboardEvent): void {
    const side = RoomStrategy.getShiftSide(event.code);
    if (!side) return;

    this.heldShifts.delete(side);
    this.onShiftUp(side);
  }

  update(_delta: number): void {}

  static isShiftCode(code: string): boolean {
    return code === 'ShiftLeft' || code === 'ShiftRight';
  }

  protected isShiftHeld(side?: ShiftSide): boolean {
    return side ? this.heldShifts.has(side) : this.heldShifts.size > 0;
  }

  protected showHint(text: string): void {
    this.scene.showHint(text);
  }

  protected complete(closingText: string): void {
    this.scene.completeRoom(closingText);
  }

  protected onEnter(): void {}

  protected abstract onShiftDown(side: ShiftSide): void;

  protected onShiftUp(_side: ShiftSide): void {}

  private static getShiftSide(code: string): ShiftSide | undefined {
    if (code === 'ShiftLeft') return 'left';
    if (code === 'ShiftRight') return 'right';
    return undefined;
  }
}

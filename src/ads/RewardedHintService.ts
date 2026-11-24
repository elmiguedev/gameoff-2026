type PlaygamaBridge = typeof import('@playgama/bridge').default;

interface PendingReward {
  onReward: () => void;
  onFinished: (rewarded: boolean) => void;
}

type RuntimeMode = 'development' | 'playgama' | 'disabled';

class RewardedHintService {
  private mode: RuntimeMode = 'disabled';
  private bridge?: PlaygamaBridge;
  private pendingReward?: PendingReward;
  private rewardCompleted = false;
  private gameReadyReported = false;

  async initialize(): Promise<void> {
    if (import.meta.env.DEV) {
      this.mode = 'development';
      return;
    }

    if (import.meta.env.MODE !== 'playgama') return;

    try {
      const { default: bridge } = await import('@playgama/bridge');
      bridge.engine = 'phaser';
      await bridge.initialize();
      this.bridge = bridge;
      bridge.advertisement.on(
        bridge.EVENT_NAME.REWARDED_STATE_CHANGED,
        this.handleRewardedState,
      );
      this.mode = 'playgama';
    } catch (error) {
      console.error('No se pudo inicializar Playgama Bridge.', error);
    }
  }

  get isAvailable(): boolean {
    if (this.mode === 'development') return true;
    return this.mode === 'playgama' && this.bridge?.advertisement.isRewardedSupported === true;
  }

  get pausesGame(): boolean {
    return this.mode === 'playgama';
  }

  reportGameReady(): void {
    if (this.mode !== 'playgama' || !this.bridge || this.gameReadyReported) return;

    this.gameReadyReported = true;
    void this.bridge.platform
      .sendMessage(this.bridge.PLATFORM_MESSAGE.GAME_READY)
      .catch((error) => console.error('No se pudo reportar que el juego está listo.', error));
  }

  showRewardedHint(
    onReward: () => void,
    onFinished: (rewarded: boolean) => void,
  ): boolean {
    if (!this.isAvailable || this.pendingReward) return false;

    if (this.mode === 'development') {
      onReward();
      onFinished(true);
      return true;
    }

    if (!this.bridge) return false;

    this.pendingReward = { onReward, onFinished };
    this.rewardCompleted = false;

    try {
      this.bridge.advertisement.showRewarded('hint');
      return true;
    } catch (error) {
      console.error('No se pudo abrir el rewarded ad.', error);
      this.finishReward(false);
      return true;
    }
  }

  private readonly handleRewardedState = (state: string): void => {
    const normalizedState = state.toLowerCase();

    if (normalizedState === 'rewarded') {
      this.rewardCompleted = true;
      return;
    }

    if (normalizedState === 'closed') {
      this.finishReward(this.rewardCompleted);
      return;
    }

    if (normalizedState === 'failed') {
      this.finishReward(false);
    }
  };

  private finishReward(rewarded: boolean): void {
    const pending = this.pendingReward;
    this.pendingReward = undefined;
    this.rewardCompleted = false;
    if (!pending) return;

    if (rewarded) pending.onReward();
    pending.onFinished(rewarded);
  }
}

export const rewardedHintService = new RewardedHintService();

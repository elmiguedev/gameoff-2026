import Phaser from 'phaser';

export class AudioManager {
  private static readonly CLICK_SOUND = 'click';
  private static backgroundMusic?: Phaser.Sound.BaseSound;
  private static readonly attachedScenes = new WeakSet<Phaser.Scene>();
  private static muted = false;
  private static readonly muteListeners = new Set<(muted: boolean) => void>();

  static attach(scene: Phaser.Scene): void {
    if (this.attachedScenes.has(scene)) return;

    this.attachedScenes.add(scene);
    const handlePointerDown = (): void => this.play(scene, this.CLICK_SOUND);
    scene.input.on('pointerdown', handlePointerDown);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.off('pointerdown', handlePointerDown);
      this.attachedScenes.delete(scene);
    });
  }

  static play(scene: Phaser.Scene, key: string): void {
    if (scene.cache.audio.exists(key)) scene.sound.play(key);
  }

  static playOnGame(game: Phaser.Game, key: string): void {
    if (game.cache.audio.exists(key)) game.sound.play(key);
  }

  static toggleMute(scene: Phaser.Scene): void {
    this.setMuted(scene, !this.muted);
  }

  static setMuted(scene: Phaser.Scene, muted: boolean): void {
    this.muted = muted;
    scene.sound.mute = muted;
    this.muteListeners.forEach((listener) => listener(muted));
  }

  static isMuted(_scene?: Phaser.Scene): boolean {
    return this.muted;
  }

  static onMuteChange(listener: (muted: boolean) => void): () => void {
    this.muteListeners.add(listener);
    return () => this.muteListeners.delete(listener);
  }

  static startBackgroundMusic(scene: Phaser.Scene): void {
    scene.sound.mute = this.muted;
    if (!this.backgroundMusic) {
      this.backgroundMusic = scene.sound.add('background-music', {
        loop: true,
        volume: 0.25,
      });
    }
    if (!this.backgroundMusic.isPlaying) this.backgroundMusic.play();
  }

  static stopBackgroundMusic(): void {
    this.backgroundMusic?.stop();
  }

  static resumeBackgroundMusic(): void {
    if (this.backgroundMusic && !this.backgroundMusic.isPlaying) {
      this.backgroundMusic.play();
    }
  }
}

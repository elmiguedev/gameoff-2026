import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export default class AudioToggleEntity extends Phaser.GameObjects.Image {
  private readonly unsubscribeMuteChange: () => void;

  constructor(scene: Phaser.Scene, x = 1180, y = 60) {
    super(scene, x, y, AudioManager.isMuted() ? 'audio-muted' : 'audio-enabled');
    this.setDisplaySize(42, 42);
    this.setInteractive({ useHandCursor: true });
    this.setDepth(1000);
    this.on('pointerdown', this.handlePointerDown);
    this.unsubscribeMuteChange = AudioManager.onMuteChange(this.updateIcon);
    this.once('destroy', this.unsubscribeMuteChange);
    scene.add.existing(this);
  }

  private readonly handlePointerDown = (
    _pointer: Phaser.Input.Pointer,
    _x: number,
    _y: number,
    event: Phaser.Types.Input.EventData,
  ): void => {
    event.stopPropagation();
    AudioManager.toggleMute(this.scene);
  };

  private readonly updateIcon = (muted: boolean): void => {
    this.setTexture(muted ? 'audio-muted' : 'audio-enabled');
  };
}

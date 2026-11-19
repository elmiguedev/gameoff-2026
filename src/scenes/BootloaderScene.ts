import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import TypographyEntity from '../entities/TypographyEntity';

export default class BootloaderScene extends Phaser.Scene {
  static stopBackgroundMusic(): void {
    AudioManager.stopBackgroundMusic();
  }

  static resumeBackgroundMusic(): void {
    AudioManager.resumeBackgroundMusic();
  }

  constructor() {
    super('BootloaderScene');
  }

  preload(): void {
    this.load.audio('shift-key', 'assets/sounds/key.ogg');
    this.load.audio('enter', 'assets/sounds/enter.ogg');
    this.load.audio('click', 'assets/sounds/click.ogg');
    this.load.audio('input', 'assets/sounds/input.ogg');
    this.load.audio('confirm', 'assets/sounds/confirm.ogg');
    this.load.audio('guy', 'assets/sounds/guy.ogg');
    this.load.audio('background-music', 'assets/sounds/music.wav');
    this.load.image('audio-enabled', 'assets/images/audio-enabled.svg');
    this.load.image('audio-muted', 'assets/images/audio-muted.svg');
    this.load.image('shift-logo', 'assets/images/shift.png');
    this.load.image('shift-up', 'assets/images/shift_up.png');
    this.load.image('shift-down', 'assets/images/shift_down.png');
    this.load.image('mouse-cursor', 'assets/images/mouse.png');
    this.load.image('caps-key', 'assets/images/caps.png');
    this.load.image('lock-icon', 'assets/images/lock.png');
    this.load.image('clock', 'assets/images/clock.png');
    this.load.image('clock-finished', 'assets/images/clock_finished.png');
    this.load.image('exit-icon', 'assets/images/exit.png');
    this.load.image('ship', 'assets/images/ship.png');
    this.load.image('tree', 'assets/images/tree.png');
    this.load.image('guy', 'assets/images/guy.png');
    this.load.image('house', 'assets/images/house.png');
  }

  create(): void {
    this.createBackground();
    this.configureTextureFiltering();
    this.startBackgroundMusic();
    this.createLoadingText();
    this.waitForFonts();
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private configureTextureFiltering(): void {
    for (const key of ['tree', 'guy', 'house', 'ship']) {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
  }

  private startBackgroundMusic(): void {
    AudioManager.startBackgroundMusic(this);
  }

  private createLoadingText(): void {
    new TypographyEntity(this, 640, 360, 'copy.cargando', 'loading');
  }

  private waitForFonts(): void {
    void document.fonts.ready.then(() => this.scene.start('StartScene'));
  }
}

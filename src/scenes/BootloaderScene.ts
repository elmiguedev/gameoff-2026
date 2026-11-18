import Phaser from 'phaser';

export default class BootloaderScene extends Phaser.Scene {
  private static backgroundMusic?: Phaser.Sound.BaseSound;

  static stopBackgroundMusic(): void {
    BootloaderScene.backgroundMusic?.stop();
  }

  static resumeBackgroundMusic(): void {
    if (BootloaderScene.backgroundMusic && !BootloaderScene.backgroundMusic.isPlaying) {
      BootloaderScene.backgroundMusic.play();
    }
  }

  constructor() {
    super('BootloaderScene');
  }

  preload(): void {
    this.load.audio('shift-key', '/assets/sounds/key.ogg');
    this.load.audio('enter', '/assets/sounds/enter.ogg');
    this.load.audio('click', '/assets/sounds/click.ogg');
    this.load.audio('input', '/assets/sounds/input.ogg');
    this.load.audio('confirm', '/assets/sounds/confirm.ogg');
    this.load.audio('guy', '/assets/sounds/guy.ogg');
    this.load.audio('background-music', '/assets/sounds/music.wav');
    this.load.image('sound-on', '/assets/images/sound_on.png');
    this.load.image('sound-off', '/assets/images/sound_off.png');
    this.load.image('shift-logo', '/assets/images/shift.png');
    this.load.image('shift-up', '/assets/images/shift_up.png');
    this.load.image('shift-down', '/assets/images/shift_down.png');
    this.load.image('mouse-cursor', '/assets/images/mouse.png');
    this.load.image('caps-key', '/assets/images/caps.png');
    this.load.image('lock-icon', '/assets/images/lock.png');
    this.load.image('clock', '/assets/images/clock.png');
    this.load.image('clock-finished', '/assets/images/clock_finished.png');
    this.load.image('exit-icon', '/assets/images/exit.png');
    this.load.image('ship', '/assets/images/ship.png');
    this.load.image('tree', '/assets/images/tree.png');
    this.load.image('guy', '/assets/images/guy.png');
    this.load.image('house', '/assets/images/house.png');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    for (const key of ['tree', 'guy', 'house', 'ship']) {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    this.startBackgroundMusic();

    this.add
      .text(640, 360, 'CARGANDO…', {
        color: '#555555',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    void document.fonts.ready.then(() => this.scene.start('StartScene'));
  }

  private startBackgroundMusic(): void {
    if (!BootloaderScene.backgroundMusic) {
      BootloaderScene.backgroundMusic = this.sound.add('background-music', {
        loop: true,
        volume: 0.25,
      });
    }

    if (!BootloaderScene.backgroundMusic.isPlaying) BootloaderScene.backgroundMusic.play();
  }

}

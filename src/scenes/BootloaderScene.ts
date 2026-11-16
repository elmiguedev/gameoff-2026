import Phaser from 'phaser';

export default class BootloaderScene extends Phaser.Scene {
  constructor() {
    super('BootloaderScene');
  }

  preload(): void {
    this.load.image('shift-logo', '/assets/images/shift.png');
    this.load.image('mouse-cursor', '/assets/images/mouse.png');
    this.load.image('caps-key', '/assets/images/caps.png');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');

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
}

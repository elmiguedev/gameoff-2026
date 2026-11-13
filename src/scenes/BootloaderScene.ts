import Phaser from 'phaser';

export default class BootloaderScene extends Phaser.Scene {
  constructor() {
    super('BootloaderScene');
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

import Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;

    this.input.keyboard?.off('keydown', this.handleKeyDown);
    this.scene.start('GameScene');
  };

  constructor() {
    super('StartScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');

    this.add
      .text(640, 300, 'SHIFT', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '72px',
        fontStyle: '500',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.add
      .text(640, 410, 'PRESIONÁ SHIFT PARA EMPEZAR', {
        color: '#555555',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '18px',
      })
      .setOrigin(0.5)
      .setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.input.keyboard?.on('keydown', this.handleKeyDown);
  }
}

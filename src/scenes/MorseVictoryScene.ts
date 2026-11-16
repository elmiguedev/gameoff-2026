import Phaser from 'phaser';

export default class MorseVictoryScene extends Phaser.Scene {
  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;
    this.scene.start('StartScene');
  };

  constructor() {
    super('MorseVictoryScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    this.registry.set('shift-backdoor-visit-pending', false);

    this.add.text(640, 270, 'SEÑAL RECIBIDA', {
      color: '#111111',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '34px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.add.text(640, 365, 'El barco está a salvo. El Narrador no sabe quién contestó.', {
      color: '#555555',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '17px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.add.text(640, 450, 'FIN', {
      color: '#777777',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '14px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.input.keyboard?.on('keydown', this.handleKeyDown);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off('keydown', this.handleKeyDown);
    });
  }
}

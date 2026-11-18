import Phaser from 'phaser';
import { addAudioToggle, bindMouseClickSound } from '../audio/AudioControls';

interface MorseVictorySceneData {
  signal?: 'SOS' | 'WIN';
}

export default class MorseVictoryScene extends Phaser.Scene {
  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') return;
    this.scene.start('StartScene');
  };

  constructor() {
    super('MorseVictoryScene');
  }

  create(data: MorseVictorySceneData = {}): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    addAudioToggle(this);
    bindMouseClickSound(this);
    this.registry.set('shift-backdoor-visit-pending', false);
    const wonByHacking = data.signal === 'WIN';

    this.add.text(640, 270, wonByHacking ? 'SISTEMA SUPERADO' : 'SEÑAL RECIBIDA', {
      color: '#111111',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '34px',
    }).setOrigin(0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2));

    this.add.text(640, 365, wonByHacking
      ? 'El Operador perdió el control. Encontraste la salida.'
      : 'El barco está a salvo. El Operador no sabe quién contestó.', {
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

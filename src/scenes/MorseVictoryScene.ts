import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import AudioToggleEntity from '../entities/AudioToggleEntity';
import TypographyEntity from '../entities/TypographyEntity';

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
    this.createBackground();
    this.createAudioControls();
    this.registry.set('shift-backdoor-visit-pending', false);
    this.createEndingText(data.signal === 'WIN');
    this.bindInput();
  }

  private createBackground(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
  }

  private createAudioControls(): void {
    AudioManager.attach(this);
    new AudioToggleEntity(this);
  }

  private createEndingText(wonByHacking: boolean): void {
    new TypographyEntity(
      this,
      640,
      270,
      wonByHacking ? 'copy.sistema-superado' : 'copy.senal-recibida',
      'ending-heading',
    );
    new TypographyEntity(
      this,
      640,
      365,
      wonByHacking
        ? 'copy.el-operador-perdio-el-control-encontraste-la-salida'
        : 'copy.el-barco-esta-a-salvo-el-operador-no-sabe-quien-contes',
      'ending-copy',
    );

    this.addFinalLabel();
  }

  private addFinalLabel(): void {
    new TypographyEntity(this, 640, 450, 'copy.fin', 'ending-label');
  }

  private bindInput(): void {
    this.input.keyboard?.on('keydown', this.handleKeyDown);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off('keydown', this.handleKeyDown);
    });
  }
}

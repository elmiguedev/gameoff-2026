import Phaser from 'phaser';
import BootloaderScene from './scenes/BootloaderScene';
import GameScene from './scenes/GameScene';
import StartScene from './scenes/StartScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootloaderScene, StartScene, GameScene],
});

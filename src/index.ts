import Phaser from 'phaser';
import BootloaderScene from './scenes/BootloaderScene';
import GameScene from './scenes/GameScene';
import MorseVictoryScene from './scenes/MorseVictoryScene';
import StartScene from './scenes/StartScene';
import { shiftMorseEasterEgg } from './input/ShiftMorseEasterEgg';

window.addEventListener('keydown', shiftMorseEasterEgg.handleKeyDown, true);
window.addEventListener('keyup', shiftMorseEasterEgg.handleKeyUp, true);
window.addEventListener('blur', shiftMorseEasterEgg.resetOnBlur);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 720,
  backgroundColor: '#ffffff',
  antialias: true,
  antialiasGL: true,
  pixelArt: false,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootloaderScene, StartScene, GameScene, MorseVictoryScene],
});

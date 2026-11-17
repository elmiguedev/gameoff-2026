import Phaser from 'phaser';
import BootloaderScene from './scenes/BootloaderScene';
import GameScene from './scenes/GameScene';
import MorseVictoryScene from './scenes/MorseVictoryScene';
import StartScene from './scenes/StartScene';
import { shiftMorseEasterEgg } from './input/ShiftMorseEasterEgg';

window.addEventListener('keydown', shiftMorseEasterEgg.handleKeyDown, true);
window.addEventListener('keyup', shiftMorseEasterEgg.handleKeyUp, true);
window.addEventListener('blur', shiftMorseEasterEgg.resetOnBlur);

const game = new Phaser.Game({
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

window.addEventListener('keydown', (event) => {
  if ((event.code !== 'ShiftLeft' && event.code !== 'ShiftRight') || event.repeat) return;
  if (!game.cache.audio.exists('shift-key')) return;

  game.sound.play('shift-key');
}, true);

window.addEventListener('keydown', (event) => {
  if ((event.code !== 'Enter' && event.code !== 'NumpadEnter') || event.repeat) return;
  if (!game.cache.audio.exists('enter')) return;

  game.sound.play('enter');
}, true);

import Phaser from 'phaser';
import { AudioManager } from './audio/AudioManager';
import BootloaderScene from './scenes/BootloaderScene';
import GameScene from './scenes/GameScene';
import MorseVictoryScene from './scenes/MorseVictoryScene';
import StartScene from './scenes/StartScene';
import { morseInput } from './input/MorseInputComponent';

window.addEventListener('keydown', morseInput.handleKeyDown, true);
window.addEventListener('keyup', morseInput.handleKeyUp, true);
window.addEventListener('blur', morseInput.resetOnBlur);

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
  AudioManager.playOnGame(game, 'shift-key');
}, true);

window.addEventListener('keydown', (event) => {
  if ((event.code !== 'Enter' && event.code !== 'NumpadEnter') || event.repeat) return;
  AudioManager.playOnGame(game, 'enter');
}, true);

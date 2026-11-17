import Phaser from 'phaser';

const SOUND_ON_KEY = 'sound-on';
const SOUND_OFF_KEY = 'sound-off';

export function playSound(scene: Phaser.Scene, key: string): void {
  if (scene.cache.audio.exists(key)) scene.sound.play(key);
}

export function addAudioToggle(scene: Phaser.Scene): void {
  let isMuted = scene.sound.mute;
  const icon = scene.add.image(1180, 60, isMuted ? SOUND_OFF_KEY : SOUND_ON_KEY)
    .setDisplaySize(144, 96)
    .setInteractive({ useHandCursor: true })
    .setDepth(1000);

  const updateIcon = (): void => {
    icon.setTexture(isMuted ? SOUND_OFF_KEY : SOUND_ON_KEY);
  };

  icon.on('pointerdown', (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
    event.stopPropagation();
    isMuted = !isMuted;
    scene.sound.mute = isMuted;
    updateIcon();
  });
  updateIcon();
}

export function bindMouseClickSound(scene: Phaser.Scene): void {
  const handlePointerDown = (): void => playSound(scene, 'click');
  scene.input.on('pointerdown', handlePointerDown);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.input.off('pointerdown', handlePointerDown);
  });
}

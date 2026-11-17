import Phaser from 'phaser';

export default class BootloaderScene extends Phaser.Scene {
  constructor() {
    super('BootloaderScene');
  }

  preload(): void {
    this.load.image('shift-logo', '/assets/images/shift.png');
    this.load.image('shift-up', '/assets/images/shift_up.png');
    this.load.image('shift-down', '/assets/images/shift_down.png');
    this.load.image('mouse-cursor', '/assets/images/mouse.png');
    this.load.image('caps-key', '/assets/images/caps.png');
    this.load.image('lock-icon', '/assets/images/lock.png');
    this.load.image('clock', '/assets/images/clock.png');
    this.load.image('clock-finished', '/assets/images/clock_finished.png');
    this.load.image('exit-icon', '/assets/images/exit.png');
    this.load.image('ship', '/assets/images/ship.png');
    this.load.image('tree', '/assets/images/tree.png');
    this.load.image('guy', '/assets/images/guy.png');
    this.load.image('house', '/assets/images/house.png');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#ffffff');
    for (const key of ['tree', 'guy', 'house', 'ship']) {
      this.textures.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR);
    }

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

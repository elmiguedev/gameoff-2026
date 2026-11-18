import Phaser from 'phaser';

export default class ControlMonitorEntity extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.drawMonitor();
    scene.add.existing(this);
  }

  private drawMonitor(): void {
    this.fillStyle(0x000000, 1);
    this.fillRoundedRect(200, 125, 880, 410, 24);
    this.lineStyle(7, 0x000000, 1);
    this.beginPath();
    this.moveTo(580, 535);
    this.lineTo(580, 563);
    this.moveTo(700, 535);
    this.lineTo(700, 563);
    this.strokePath();
    this.fillRoundedRect(455, 561, 370, 12, 6);
  }
}

import Phaser from 'phaser';

const METER_RADIUS = 220;
const METER_TWEEN_MS = 120;

/** Renders and animates the alternating-Shift charge meter in room 9. */
export default class ChargingCircleEntity extends Phaser.GameObjects.Container {
  private readonly meter: Phaser.GameObjects.Graphics;
  private displayCharge = 0;
  private meterTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.meter = scene.add.graphics();
    this.add(this.meter);
  }

  setCharge(charge: number): void {
    const nextCharge = Phaser.Math.Clamp(charge, 0, 1);
    this.meterTween?.stop();
    this.displayCharge = Math.min(this.displayCharge, nextCharge);
    this.meterTween = this.scene.tweens.add({
      targets: this,
      displayCharge: nextCharge,
      duration: METER_TWEEN_MS,
      ease: 'Sine.Out',
      onUpdate: () => this.draw(),
      onComplete: () => {
        this.meterTween = undefined;
        this.displayCharge = nextCharge;
        this.draw();
      },
    });
    this.draw();
  }

  updateCharge(charge: number): void {
    this.meterTween?.stop();
    this.meterTween = undefined;
    this.displayCharge = Phaser.Math.Clamp(charge, 0, 1);
    this.draw();
  }

  clear(): void {
    this.meterTween?.stop();
    this.meterTween = undefined;
    this.displayCharge = 0;
    this.meter.clear();
  }

  override destroy(fromScene?: boolean): void {
    this.meterTween?.stop();
    this.meterTween = undefined;
    super.destroy(fromScene);
  }

  private draw(): void {
    this.meter.clear();
    if (this.displayCharge <= 0) return;

    this.meter.fillStyle(0x111111, 1);
    this.meter.fillCircle(640, 360, METER_RADIUS * this.displayCharge);
  }
}

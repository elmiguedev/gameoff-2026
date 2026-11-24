import Phaser from 'phaser';
import TypographyEntity from './TypographyEntity';

export default class HintButtonEntity extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Arc;
  private readonly label: TypographyEntity;
  private readonly adBadge: Phaser.GameObjects.Rectangle;
  private readonly adBadgeLabel: TypographyEntity;
  private used = false;

  constructor(scene: Phaser.Scene, onPress: () => void) {
    super(scene, 126, 56);

    this.background = scene.add
      .circle(0, 0, 20, 0xf2f2f2, 1)
      .setStrokeStyle(1.5, 0x666666)
      .setInteractive({ useHandCursor: true });
    this.label = new TypographyEntity(scene, 0, 0, '?', 'hint-button');
    this.adBadge = scene.add
      .rectangle(14, -15, 22, 12, 0x444444, 1)
      .setRounded(4);
    this.adBadgeLabel = new TypographyEntity(scene, 14, -15, 'AD', 'hint-ad-badge');
    this.add([this.background, this.label, this.adBadge, this.adBadgeLabel]);
    this.setDepth(1000);
    this.background.on('pointerover', this.handlePointerOver);
    this.background.on('pointerout', this.handlePointerOut);
    this.background.on('pointerdown', this.handlePointerDown);
    scene.add.existing(this);
    this.onPress = onPress;
  }

  private onPress: () => void;

  resetForRoom(): void {
    this.used = false;
    this.label.setRawText('?');
    this.adBadge.setVisible(true);
    this.adBadgeLabel.setVisible(true);
    this.background.setInteractive({ useHandCursor: true });
    this.background.setFillStyle(0xf2f2f2, 1);
    this.background.setStrokeStyle(1.5, 0x666666);
  }

  hideForCompletedRoom(): void {
    this.setVisible(false);
    this.background.disableInteractive();
  }

  markUsed(): void {
    this.used = true;
    this.label.setRawText('✓');
    this.adBadge.setVisible(false);
    this.adBadgeLabel.setVisible(false);
    this.background.disableInteractive();
    this.background.setFillStyle(0xe8e8e8, 1);
    this.background.setStrokeStyle(1, 0xb8b8b8);
  }

  private readonly handlePointerOver = (): void => {
    if (!this.used) {
      this.background.setFillStyle(0xe5e5e5, 1);
      this.background.setStrokeStyle(1.5, 0x333333);
    }
  };

  private readonly handlePointerOut = (): void => {
    if (!this.used) {
      this.background.setFillStyle(0xf2f2f2, 1);
      this.background.setStrokeStyle(1.5, 0x666666);
    }
  };

  private readonly handlePointerDown = (
    _pointer: Phaser.Input.Pointer,
    _x: number,
    _y: number,
    event: Phaser.Types.Input.EventData,
  ): void => {
    event.stopPropagation();
    if (!this.used) this.onPress();
  };
}

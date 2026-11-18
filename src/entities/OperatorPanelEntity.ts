import type Phaser from 'phaser';
import type { TranslationKey } from '../i18n/i18n';
import TypographyEntity, { type TypographyVariant } from './TypographyEntity';

export default class OperatorPanelEntity extends TypographyEntity {
  constructor(
    scene: Phaser.Scene,
    x = 640,
    y = 620,
    variant: Extract<TypographyVariant, 'operator' | 'start-operator'> = 'operator',
  ) {
    super(scene, x, y, '', variant);
  }

  showMessage(key: TranslationKey): void {
    this.setMessage(key);
  }

  showText(text: string): void {
    this.setRawText(text);
  }
}

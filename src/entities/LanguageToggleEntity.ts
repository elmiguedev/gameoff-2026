import Phaser from 'phaser';
import { getLanguage, setLanguage, type Language } from '../i18n/i18n';
import TypographyEntity from './TypographyEntity';

export default class LanguageToggleEntity extends Phaser.GameObjects.Container {
  private readonly englishOption: TypographyEntity;
  private readonly spanishOption: TypographyEntity;

  constructor(scene: Phaser.Scene, x = 48, y = 48) {
    super(scene, x, y);
    this.englishOption = this.createOption(scene, 0, 'EN', 'en');
    const separator = new TypographyEntity(scene, 28, 0, '|', 'language-separator')
      .setOrigin(0, 0.5);
    this.spanishOption = this.createOption(scene, 43, 'ES', 'es');
    this.add([this.englishOption, separator, this.spanishOption]);
    this.refresh();
    scene.add.existing(this);
  }

  private createOption(
    scene: Phaser.Scene,
    x: number,
    label: string,
    language: Language,
  ): TypographyEntity {
    const option = new TypographyEntity(scene, x, 0, label, 'language-option')
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true });
    option.on('pointerdown', () => this.select(language));
    return option;
  }

  setLanguage(language: Language): void {
    setLanguage(language);
    this.refresh();
    this.emit('languagechange', language);
  }

  private select(language: Language): void {
    this.setLanguage(language);
  }

  private refresh(): void {
    const language = getLanguage();
    this.englishOption.setColor(language === 'en' ? '#111111' : '#888888');
    this.spanishOption.setColor(language === 'es' ? '#111111' : '#888888');
  }
}

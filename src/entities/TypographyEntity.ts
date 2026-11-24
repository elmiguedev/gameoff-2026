import Phaser from 'phaser';
import { isTranslationKey, t, type TranslationKey } from '../i18n/i18n';

export type TypographyVariant =
  | 'title'
  | 'language-option'
  | 'language-separator'
  | 'operator'
  | 'start-operator'
  | 'room-number'
  | 'run-timer'
  | 'room-prompt'
  | 'auxiliary'
  | 'room-instruction'
  | 'control-label'
  | 'control-heading'
  | 'control-index'
  | 'control-option'
  | 'dev-label'
  | 'room-selector'
  | 'control-selector'
  | 'input-medium'
  | 'input-large'
  | 'lock-code'
  | 'loading'
  | 'ending-disconnect'
  | 'ending-time'
  | 'ending-time-note'
  | 'hint-button'
  | 'hint-ad-badge'
  | 'ending-heading'
  | 'ending-copy'
  | 'ending-label'
  | 'custom';

type TypographyStyle = Phaser.Types.GameObjects.Text.TextStyle;

const SHARED_STYLE: TypographyStyle = {
  fontFamily: 'IBM Plex Mono, Menlo, monospace',
};

const VARIANT_STYLES: Record<Exclude<TypographyVariant, 'custom'>, TypographyStyle> = {
  title: { color: '#111111', fontSize: '72px', fontStyle: '500' },
  'language-option': { color: '#888888', fontSize: '14px' },
  'language-separator': { color: '#b0b0b0', fontSize: '14px' },
  operator: {
    color: '#222222',
    fontSize: '19px',
    fontStyle: '500',
    lineSpacing: 6,
    align: 'center',
    wordWrap: { width: (1280 * 2) / 3, useAdvancedWrap: true },
  },
  'start-operator': {
    color: '#555555',
    fontSize: '19px',
    lineSpacing: 6,
    align: 'center',
    wordWrap: { width: (1280 * 2) / 3, useAdvancedWrap: true },
  },
  'room-number': {
    color: '#555555',
    fontFamily: 'IBM Plex Sans, Arial, sans-serif',
    fontSize: '24px',
    fontStyle: '300',
  },
  'run-timer': {
    color: '#777777',
    fontFamily: 'IBM Plex Sans, Arial, sans-serif',
    fontSize: '16px',
    fontStyle: '300',
  },
  'room-prompt': { color: '#111111', fontSize: '56px', fontStyle: '500' },
  auxiliary: { color: '#666666', fontSize: '16px', fontStyle: '300' },
  'room-instruction': { color: '#111111', fontSize: '24px' },
  'control-label': { color: '#f5f5f5', fontSize: '28px' },
  'control-heading': { color: '#b8b8b8', fontSize: '20px' },
  'control-index': { color: '#d0d0d0', fontSize: '16px', lineSpacing: 10 },
  'control-option': { color: '#f5f5f5', fontSize: '22px' },
  'dev-label': { color: '#888888', fontSize: '12px' },
  'room-selector': { color: '#333333', fontSize: '12px' },
  'control-selector': { color: '#333333', fontSize: '9px' },
  'input-medium': { color: '#111111', fontSize: '28px' },
  'input-large': { color: '#111111', fontSize: '36px' },
  'lock-code': { color: '#111111', fontSize: '42px' },
  loading: { color: '#555555', fontSize: '18px' },
  'ending-disconnect': { color: '#f2f2f2', fontSize: '26px', align: 'center' },
  'ending-time': { color: '#f2f2f2', fontSize: '18px', align: 'center' },
  'ending-time-note': { color: '#b8b8b8', fontSize: '13px', align: 'center' },
  'hint-button': { color: '#333333', fontFamily: 'IBM Plex Sans, Arial, sans-serif', fontSize: '21px', fontStyle: '500', align: 'center' },
  'hint-ad-badge': { color: '#ffffff', fontFamily: 'IBM Plex Sans, Arial, sans-serif', fontSize: '7px', fontStyle: '500', align: 'center' },
  'ending-heading': { color: '#111111', fontSize: '34px' },
  'ending-copy': { color: '#555555', fontSize: '17px' },
  'ending-label': { color: '#777777', fontSize: '14px' },
};

export default class TypographyEntity extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: string,
    variant: TypographyVariant,
    customStyle?: TypographyStyle,
  ) {
    const variantStyle = variant === 'custom' ? customStyle : VARIANT_STYLES[variant];
    if (!variantStyle) throw new Error(`Falta el estilo de tipografía: ${variant}`);

    super(scene, x, y, resolveText(content), {
      ...SHARED_STYLE,
      ...variantStyle,
    });
    this.setOrigin(0.5);
    this.setResolution(Math.min(window.devicePixelRatio || 1, 2));
    scene.add.existing(this);
  }

  setMessage(key: TranslationKey): this {
    this.setText(t(key));
    return this;
  }

  setRawText(text: string): this {
    this.setText(text);
    return this;
  }
}

function resolveText(content: string): string {
  return isTranslationKey(content)
    ? t(content)
    : content;
}

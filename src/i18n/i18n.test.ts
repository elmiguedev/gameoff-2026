import { describe, expect, test } from 'bun:test';
import englishCatalog from './en.json';
import spanishCatalog from './es.json';
import { detectBrowserLanguage, t } from './i18n';

describe('language selection', () => {
  test('uses Spanish when the browser language is Spanish', () => {
    expect(detectBrowserLanguage(['es-AR', 'en-US'])).toBe('es');
  });

  test('uses English for English and unsupported browser languages', () => {
    expect(detectBrowserLanguage(['en-GB'])).toBe('en');
    expect(detectBrowserLanguage(['fr-FR'])).toBe('en');
  });

  test('keeps language catalogs in sync and translates by key', () => {
    expect(Object.keys(englishCatalog).sort()).toEqual(Object.keys(spanishCatalog).sort());
    expect(t('copy.operador-activo', 'en')).toBe('OPERATOR: ACTIVE');
    expect(t('copy.operador-activo', 'es')).toBe('OPERADOR: ACTIVO');
  });
});

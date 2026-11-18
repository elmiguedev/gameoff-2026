import { describe, expect, test } from 'bun:test';
import { detectBrowserLanguage, translate } from './i18n';

describe('language selection', () => {
  test('uses Spanish when the browser language is Spanish', () => {
    expect(detectBrowserLanguage(['es-AR', 'en-US'])).toBe('es');
  });

  test('uses English for English and unsupported browser languages', () => {
    expect(detectBrowserLanguage(['en-GB'])).toBe('en');
    expect(detectBrowserLanguage(['fr-FR'])).toBe('en');
  });

  test('translates Operator interface copy while preserving Spanish copy', () => {
    expect(translate('OPERADOR: ACTIVO', 'en')).toBe('OPERATOR: ACTIVE');
    expect(translate('OPERADOR: ACTIVO', 'es')).toBe('OPERADOR: ACTIVO');
  });
});

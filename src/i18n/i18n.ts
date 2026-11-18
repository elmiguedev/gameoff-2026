import englishCatalog from './en.json';
import spanishCatalog from './es.json';

export type Language = 'es' | 'en';
export type TranslationKey = keyof typeof spanishCatalog;

const LANGUAGE_STORAGE_KEY = 'shift-language';
const CATALOGS: Record<Language, Record<string, string>> = {
  es: spanishCatalog,
  en: englishCatalog,
};

let activeLanguage: Language | undefined;

export function detectBrowserLanguage(languages?: readonly string[]): Language {
  const browserLanguages = languages
    ?? (typeof navigator !== 'undefined'
      ? navigator.languages?.length ? navigator.languages : [navigator.language]
      : []);
  return browserLanguages[0]?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function getLanguage(): Language {
  if (activeLanguage) return activeLanguage;

  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'es' || savedLanguage === 'en') {
      activeLanguage = savedLanguage;
      return activeLanguage;
    }
  } catch {
    // Storage can be disabled; browser language remains a useful default.
  }

  activeLanguage = detectBrowserLanguage();
  return activeLanguage;
}

export function setLanguage(language: Language): void {
  activeLanguage = language;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Keep the choice for this session even when storage is unavailable.
  }
}

export function isTranslationKey(key: string): key is TranslationKey {
  return Object.hasOwn(spanishCatalog, key);
}

export function t(key: TranslationKey, language = getLanguage()): string {
  return CATALOGS[language][key] ?? spanishCatalog[key];
}

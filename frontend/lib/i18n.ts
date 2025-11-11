import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import csTranslations from '@/locales/cs.json';

export type Locale = 'en' | 'de' | 'cs';

export const locales: Locale[] = ['en', 'de', 'cs'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  cs: 'Čeština',
};

const translations = {
  en: enTranslations,
  de: deTranslations,
  cs: csTranslations,
};

export type TranslationKey = keyof typeof enTranslations;

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

export function t(
  locale: Locale,
  key: string,
  defaultValue?: string
): string {
  const trans = getTranslations(locale);
  const keys = key.split('.');
  let value: any = trans;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue || key;
    }
  }

  return typeof value === 'string' ? value : defaultValue || key;
}

// Detect browser locale
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const browserLang = window.navigator.language.toLowerCase();

  // Check for exact match
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('cs')) return 'cs';

  return defaultLocale;
}

// Get locale from localStorage or detect
export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const stored = localStorage.getItem('locale') as Locale;
  if (stored && locales.includes(stored)) {
    return stored;
  }

  return detectBrowserLocale();
}

// Store locale preference
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

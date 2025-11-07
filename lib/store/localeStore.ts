import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'

interface LocaleStore {
  locale: Locale
  setLocale: (locale: Locale) => void
  getLanguageName: (locale: Locale) => string
}

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese'
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set, get) => ({
      locale: 'en',
      setLocale: (locale: Locale) => {
        set({ locale })
        // Update HTML lang attribute
        if (typeof window !== 'undefined') {
          document.documentElement.lang = locale
        }
      },
      getLanguageName: (locale: Locale) => localeNames[locale] || 'English'
    }),
    {
      name: 'locale-storage',
    }
  )
)


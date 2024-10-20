import { changeDayjsLocale } from '@/helpers/date'
import en from '@/locales/en.json'
import axios from 'axios'
import { createI18n } from 'vue-i18n'

export type MessageSchema = typeof en
export type Language = 'en' | 'tr'
const locale = import.meta.env.VITE_I18N_LOCALE || 'en'

const options = {
  locale,
  legacy: false,
  warnHtmlMessage: false,
  silentFallbackWarn: true,
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en'
}

const i18n = createI18n<[MessageSchema], Language>(options)
i18n.global.setLocaleMessage(locale, en)

export const setI18nLanguage = async (locale: Language) => {
  changeDayjsLocale(locale)
  await loadLocaleMessages(locale)
  ;(i18n.global.locale as unknown as any).value = locale
  axios.defaults.headers.common['Accept-Language'] = locale
  document.querySelector('html')!.setAttribute('lang', locale)
}

const loadLocaleMessages = async (locale: Language) => {
  if (i18n.global.availableLocales.includes(locale)) {
    return Promise.resolve()
  }
  // lazy loading
  const messages = await import(`@/locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
  return Promise.resolve()
}

export default i18n

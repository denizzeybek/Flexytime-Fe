import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import type { Language } from '@/plugins/i18n'

dayjs.extend(LocalizedFormat)

const map = {
  en: () => import('dayjs/locale/en'),
  tr: () => import('dayjs/locale/tr')
  // de: () => import('dayjs/locale/de'),
  // el: () => import('dayjs/locale/el'),
  // es: () => import('dayjs/locale/es'),
  // fr: () => import('dayjs/locale/fr'),
  // it: () => import('dayjs/locale/it'),
  // pl: () => import('dayjs/locale/pl'),
  // uk: () => import('dayjs/locale/uk')
}

export const changeDayjsLocale = async (locale: Language) => {
  await map[locale]()
  dayjs.locale(locale)
}

/**
 * Format a date to interval string format: DD.MM.YYYY
 * Used for API requests that require date intervals
 */
export const formatDateToInterval = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

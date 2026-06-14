import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import type { Language } from '@/plugins/i18n'

dayjs.extend(LocalizedFormat)

const map = {
  en: () => import('dayjs/locale/en'),
  tr: () => import('dayjs/locale/tr')

}

export const changeDayjsLocale = async (locale: Language) => {
  await map[locale]()
  dayjs.locale(locale)
}

export const formatDateToInterval = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

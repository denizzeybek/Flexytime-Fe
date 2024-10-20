import type { Language } from '@/plugins/i18n'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

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

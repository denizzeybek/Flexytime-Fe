import type { Language } from '@/plugins/i18n'

export interface ILanguageOption {
  label: string
  value: Language
}
export const languageOptions: ILanguageOption[] = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: 'Türkçe',
    value: 'tr'
  }
  // {
  //   label: 'Deutsch',
  //   value: 'de'
  // },
  // {
  //   label: 'Español',
  //   value: 'es'
  // },
  // {
  //   label: 'Français',
  //   value: 'fr'
  // },
  // {
  //   label: 'Italiano',
  //   value: 'it'
  // },
  // {
  //   label: 'Polski',
  //   value: 'pl'
  // },
  // {
  //   label: 'Greek',
  //   value: 'el'
  // },
  // {
  //   label: 'Ukrainian',
  //   value: 'uk'
  // }
]

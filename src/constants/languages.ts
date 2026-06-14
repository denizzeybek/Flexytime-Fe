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

]

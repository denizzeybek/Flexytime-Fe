import { useI18n } from 'vue-i18n'

import { setLocale } from 'yup'

export const initVeeValidateI18n = () => {
  const { t } = useI18n()

  const translateField = (path: string): string => {
    const fieldKey = `common.validation.fields.${path.toLowerCase()}`
    const translated = t(fieldKey)
    return translated === fieldKey ? path : translated
  }

  setLocale({
    mixed: {
      default: ({ path }) => t('common.validation.mixed.default', { path: translateField(path) }),
      required: ({ path }) => t('common.validation.mixed.required', { field: translateField(path) }),
      oneOf: ({ path, values }) => ({
        key: 'common.validation.mixed.oneOf',
        values: { path: translateField(path), values }
      })
    },
    string: {
      email: ({ path }) => t('common.validation.string.email', { field: translateField(path) }),
      min: ({ min, path }) => t('common.validation.string.min', { min, field: translateField(path) }),
      matches: ({ path }) => t('common.validation.string.matches', { field: translateField(path) })
    },
    array: {
      min: ({ path, min }) => t('common.validation.array.min', { field: translateField(path), min })
    }
  })
}

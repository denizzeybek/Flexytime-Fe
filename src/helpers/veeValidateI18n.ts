import { setI18nLanguage, type Language } from '@/plugins/i18n'
// import { useUsersStore } from '@/stores/common/users'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from 'yup'

export const initVeeValidateI18n = () => {
  const { t } = useI18n()
  // const usersStore = useUsersStore()
  const isLangSet = ref(false)

  // watch(
  //   () => usersStore.profile?.preferredLanguage,
  //   (lang) => {
  //     if (lang && !isLangSet.value) {
  //       isLangSet.value = true
  //       setI18nLanguage(lang as Language)
  //     }
  //   }
  // )

  setLocale({
    mixed: {
      default: ({ path }) => t('common.validation.mixed.default', { path }),
      required: ({ path }) => t('common.validation.mixed.required', { field: path }),
      oneOf: ({ path, values }) => ({
        key: 'common.validation.mixed.oneOf',
        values: { path, values }
      })
    },
    string: {
      email: ({ path }) => t('common.validation.string.email', { field: path }),
      min: ({ min }) => t('common.validation.string.min', { min }),
      matches: ({ path }) => t('common.validation.string.matches', { field: path })
    }
  })
}

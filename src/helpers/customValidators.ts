import { type IOption } from '@/common/interfaces/option.interface'

import { PASSWORD_RULES } from '@/constants/regex'
import { number, object, string, type AnyObject } from 'yup'

export const validateBirthDate = (value: string) => {
  const date = new Date(value)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  return age >= 18
}

export const validatePassword = (value: string) => {
  const trimmedValue = value.trim()
  return PASSWORD_RULES.every((rule) => {
    if (rule.regex) {
      return rule.regex.test(trimmedValue)
    } else if (rule.minLength) {
      return trimmedValue.length >= rule.minLength
    }
    return false
  })
}

export function dataToValidationRule<T extends AnyObject>(
  label: string,
  isRequired = true,
  errorMessage?: string
) {
  return object<IOption<T>>().shape({
    label: string().label(label),
    value: number()
      .label(label)
      .when([], {
        is: () => isRequired,
        then: (schema) => schema.required(errorMessage)
      }),
    data: object<T>()
  })
}

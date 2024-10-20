import type { EIconNames } from '../enums/icons.enum'

export interface IOption<T = any> {
  data?: T
  label: string
  value: any
  secondaryLabel?: string
  helperLabel?: string
  lightLabel?: string
  subLabel?: string
  disabled?: boolean
  badge?: {
    title: string
    class?: string
  }
  icon?: {
    name: EIconNames
    class?: string
    size?: number
    color?: string
  }
}

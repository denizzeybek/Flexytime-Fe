// import type { TBadgeVariant } from '@/components/ui/global/Badge.vue'

export interface IStatusMap {
  text: string
  // variant: TBadgeVariant
  tooltip?: {
    header?: string
    content?: string
  }
}

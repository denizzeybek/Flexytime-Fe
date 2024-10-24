import ErrorToast from '@/components/ui/global/ErrorToast.vue'
import SuccessToast from '@/components/ui/global/SuccessToast.vue'
import type { HTMLAttributes } from 'vue'
import { useToast } from 'vue-toastification'

export const useFToast = () => {
  const toast = useToast()

  const showSuccessMessage = (message: string, className?: HTMLAttributes['class']) => {
    toast(
      {
        component: SuccessToast,
        props: {
          message
        }
      },
      {
        toastClassName: `!shadow-none !bg-white ${className}`
      }
    )
  }

  const showErrorMessage = (
    error: string | Error,
    timeout: number = 3000,
    className?: HTMLAttributes['class']
  ) => {
    let message = error
    if (typeof error !== 'string') {
      message = (error as any)?.body?.message ?? error?.message ?? 'Something went wrong!'
    }
    toast(
      {
        component: ErrorToast,
        props: {
          message
        }
      },
      {
        toastClassName: `!shadow-none !bg-white ${className}`,
        timeout
      }
    )
  }

  return {
    showSuccessMessage,
    showErrorMessage
  }
}

import { ref } from 'vue';

import { useFToast } from '@/composables/useFToast';

import type { Ref } from 'vue';

interface UseOperationFeedbackOptions {

  showLoading?: boolean;
}

interface UseOperationFeedbackReturn {
  isLoading: Ref<boolean>;

  executeWithFeedback: <T>(operation: () => Promise<T>, successMessage?: string) => Promise<T>;

  executeAsync: <T>(operation: () => Promise<T>) => Promise<T>;
}

export const useOperationFeedback = (
  options: UseOperationFeedbackOptions = {},
): UseOperationFeedbackReturn => {
  const { showLoading = true } = options;
  const { showSuccessMessage, showErrorMessage } = useFToast();

  const isLoading = ref(false);

  const executeAsync = async <T>(operation: () => Promise<T>): Promise<T> => {
    try {
      if (showLoading) {
        isLoading.value = true;
      }
      return await operation();
    } finally {
      if (showLoading) {
        isLoading.value = false;
      }
    }
  };

  const executeWithFeedback = async <T>(
    operation: () => Promise<T>,
    successMessage?: string,
  ): Promise<T> => {
    try {
      if (showLoading) {
        isLoading.value = true;
      }
      const result = await operation();
      if (successMessage) {
        showSuccessMessage(successMessage);
      }
      return result;
    } catch (error) {
      showErrorMessage(error as Error);
      throw error;
    } finally {
      if (showLoading) {
        isLoading.value = false;
      }
    }
  };

  return {
    isLoading,
    executeWithFeedback,
    executeAsync,
  };
};

import { ref } from 'vue';

import { useFToast } from '@/composables/useFToast';

import type { Ref } from 'vue';

interface UseOperationFeedbackOptions {
  /** Show loading state during operation */
  showLoading?: boolean;
}

interface UseOperationFeedbackReturn {
  isLoading: Ref<boolean>;
  /**
   * Execute an async operation with automatic success/error feedback.
   * Loading state is managed automatically with try-finally pattern.
   *
   * @param operation - The async function to execute
   * @param successMessage - Message to show on success (optional - no message if not provided)
   * @returns The result of the operation
   * @throws Re-throws the error after showing error message
   */
  executeWithFeedback: <T>(operation: () => Promise<T>, successMessage?: string) => Promise<T>;
  /**
   * Execute an async operation with loading state but no automatic feedback.
   * Use this when you want to handle success/error messages manually.
   *
   * @param operation - The async function to execute
   * @returns The result of the operation
   */
  executeAsync: <T>(operation: () => Promise<T>) => Promise<T>;
}

/**
 * Composable for managing async operations with automatic feedback.
 * Combines loading state management with success/error toast messages.
 *
 * @example
 * // With automatic feedback
 * const { isLoading, executeWithFeedback } = useOperationFeedback();
 *
 * const saveData = async () => {
 *   await executeWithFeedback(
 *     () => store.save(payload),
 *     t('messages.saved')
 *   );
 * };
 *
 * @example
 * // With loading only (manual feedback)
 * const { isLoading, executeAsync } = useOperationFeedback();
 *
 * const fetchData = async () => {
 *   try {
 *     await executeAsync(() => store.fetch());
 *   } catch (error) {
 *     // Handle error manually
 *   }
 * };
 */
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

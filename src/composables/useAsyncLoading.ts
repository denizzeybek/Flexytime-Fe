import { ref } from 'vue';

import type { Ref } from 'vue';

interface UseAsyncLoadingReturn {
  isLoading: Ref<boolean>;
  executeAsync: <T>(fn: () => Promise<T>) => Promise<T>;
}

/**
 * Composable for managing async loading state with proper error handling.
 * Uses try-finally pattern to ensure loading state is always reset.
 *
 * @example
 * const { isLoading, executeAsync } = useAsyncLoading();
 *
 * const fetchData = async () => {
 *   await executeAsync(async () => {
 *     await store.filter();
 *   });
 * };
 */
export const useAsyncLoading = (): UseAsyncLoadingReturn => {
  const isLoading = ref(false);

  const executeAsync = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      isLoading.value = true;
      return await fn();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    executeAsync,
  };
};

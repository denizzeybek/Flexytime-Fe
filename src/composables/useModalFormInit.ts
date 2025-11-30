import { computed, type Ref } from 'vue';

/**
 * Minimal composable for modal form utilities
 *
 * Provides:
 * - isEditing: computed property based on whether data exists
 * - handleClose: closes modal and resets form
 *
 * @example
 * ```ts
 * const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);
 * ```
 */
export const useModalForm = <TData>(
  open: Ref<boolean | undefined>,
  data: TData | undefined,
  resetForm: () => void,
) => {
  const isEditing = computed(() => !!data);

  const handleClose = () => {
    resetForm();
    open.value = false;
  };

  return {
    isEditing,
    handleClose,
  };
};

import { computed, type Ref } from 'vue';

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

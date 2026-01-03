<template>
  <div class="flex flex-col" :class="[hideError && !label ? '' : 'gap-2']">
    <label v-if="label" :for="id" class="text-sm font-medium text-f-secondary">
      {{ label }}
    </label>
    <DatePicker
      :id="id"
      v-model="value"
      time-only
      hour-format="24"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="!!error"
      class="f-time-input"
      :pt="{
        pcInput: {
          root: {
            class: 'w-full',
          },
        },
      }"
    />
    <small v-if="!hideError && error" class="p-error text-red-500">
      {{ error }}
    </small>
  </div>
</template>

<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { useField, useFieldError } from 'vee-validate';

interface IProps {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  hideError?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  id: '',
  placeholder: '00:00',
  disabled: false,
  hideError: false,
});

const { value } = useField<Date | null>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const error = useFieldError(() => props.name);
</script>

<style scoped>
.f-time-input :deep(.p-datepicker-input) {
  width: 100%;
}
</style>

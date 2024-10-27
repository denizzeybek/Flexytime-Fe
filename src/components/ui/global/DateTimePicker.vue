<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <DatePicker
      v-model="value as any"
      :id="id"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled as boolean"
      class="w-full"
      :invalid="!!errorMessage"
      :class="[customClass]"
      v-bind="primeProps"
    />
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import type { DatePickerProps } from 'primevue/datepicker';
import {  computed } from 'vue';
import { useField } from 'vee-validate';

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: DatePickerProps;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  modelValue?: string;
  isValid?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Enter text',
});

const { errorMessage: vError, value } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));
</script>

<style scoped></style>

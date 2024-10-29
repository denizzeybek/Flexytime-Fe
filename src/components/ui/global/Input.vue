<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <InputText
      v-model="value as unknown as string"
      :id="id"
      :type="type"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full"
      :invalid="!!errorMessage"
      :class="[customClass]"
      v-on="listeners"
      v-bind="primeProps"
    />
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import type { InputTextProps } from 'primevue/inputtext';
import { ref, computed } from 'vue';
import { useField } from 'vee-validate';

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: InputTextProps;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  modelValue?: string
  isValid?: boolean;
  disabled?:boolean
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'color'
    | 'file'
    | 'image'
    | 'range'
    | 'textarea';
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'text',
  disabled: false,
  placeholder: 'Enter text',
});

const passwordVisible = ref(false);
const isFocused = ref(false);
const input = ref<HTMLInputElement>();

const {
  errorMessage: vError,
  value,
  handleBlur,
  handleChange,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const listeners = {
  ...props.customEvents,
  blur: (e: InputEvent) => {
    handleBlur(e, true);
    props.customEvents?.blur?.(e);
    isFocused.value = false;
  },
  change: (e: InputEvent) => {
    handleChange(e);
    props.customEvents?.change?.(e);
  },
  input: (e: InputEvent) => {
    const value = props.transformValue ? props.transformValue(e) : e;
    handleChange(value, !!errorMessage.value);
    props.customEvents?.input?.(e);
  },
  focus: (e: InputEvent) => {
    props.customEvents?.focus?.(e);
    isFocused.value = true;
  },
};
</script>

<style scoped></style>

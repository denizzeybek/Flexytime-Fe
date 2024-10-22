<template>
  <div class="field">
    <label :for="id" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">{{
      label
    }}</label>
    <Password
      v-model="value as unknown as string"
      :placeholder="placeholder"
      class="w-full"
      :toggleMask="toggleMask"
      :feedback="feedback"
      :class="[{ 'p-invalid': errorMessage }, customClass]"
      v-bind="primeProps"
    />
    <small v-if="errorMessage" :id="`${id}-help`" class="p-error text-red-500">{{
      errorMessage
    }}</small>
  </div>
</template>

<script setup lang="ts">
import type { PasswordProps } from 'primevue/password';
import { ref, computed } from 'vue';
import { useField } from 'vee-validate';
import Password from 'primevue/password';

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder: string;
  customClass: string;
  primeProps: PasswordProps;
  validatingAsync?: boolean;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  disabled: boolean;
  toggleMask: boolean;
  feedback: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  validatingAsync: false,
  toggleMask: true,
  feedback: false,
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

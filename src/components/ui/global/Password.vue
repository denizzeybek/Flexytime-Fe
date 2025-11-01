<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <Password
      v-model="model"
      :placeholder="finalPlaceholder"
      class="w-full"
      :toggleMask="toggleMask"
      :feedback="feedback"
      :invalid="!!errorMessage"
      :class="[customClass]"
      :disabled="disabled"
      v-bind="primeProps"
    />
    <small v-if="errorMessage" :id="`${id}-help`" class="p-error text-red-500">{{
      errorMessage
    }}</small>
  </div>
</template>

<script setup lang="ts">
import type { PasswordProps } from 'primevue/password';
import { computed } from 'vue';
import { useField } from 'vee-validate';
import Password from 'primevue/password';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: PasswordProps;
  validatingAsync?: boolean;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  disabled?: boolean;
  toggleMask?: boolean;
  feedback?: boolean;
}

const { t } = useI18n<{ message: MessageSchema }>();

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  validatingAsync: false,
  toggleMask: true,
  feedback: false,
  placeholder: '',
});

const finalPlaceholder = computed(() => props.placeholder || t('components.password.placeholder'));

// const passwordVisible = ref(false);
// const isFocused = ref(false);
// const input = ref<HTMLInputElement>();

const {
  errorMessage: vError,
  value,
  // handleBlur,
  // handleChange,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const model = computed<string>({
  get: () => value.value as unknown as string,
  set: (v) => (value.value = v),
});
// const listeners = {
//   ...props.customEvents,
//   blur: (e: InputEvent) => {
//     handleBlur(e, true);
//     props.customEvents?.blur?.(e);
//     isFocused.value = false;
//   },
//   change: (e: InputEvent) => {
//     handleChange(e);
//     props.customEvents?.change?.(e);
//   },
//   input: (e: InputEvent) => {
//     const value = props.transformValue ? props.transformValue(e) : e;
//     handleChange(value, !!errorMessage.value);
//     props.customEvents?.input?.(e);
//   },
//   focus: (e: InputEvent) => {
//     props.customEvents?.focus?.(e);
//     isFocused.value = true;
//   },
// };
</script>

<style scoped></style>

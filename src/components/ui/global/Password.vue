<template>
  <div class="flex flex-col gap-2">
    <label :for="id" :class="{ 'text-red-500': !!errorMessage }">{{ label }}</label>
    <div class="relative w-full f-password-wrapper">
      <Password
        v-model="model"
        :placeholder="finalPlaceholder"
        class="w-full"
        :toggleMask="toggleMask"
        :feedback="feedback"
        :invalid="!!errorMessage"
        :class="[customClass]"
        :disabled="disabled"
        :pt="{
          input: {
            autocomplete: 'new-password',
            readonly: isReadonly,
            onfocus: handleFocus,
          },
        }"
        v-bind="primeProps"
      />
    </div>
    <small v-if="errorMessage" :id="`${id}-help`" class="p-error text-red-500">{{
      errorMessage
    }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Password from 'primevue/password';
import { useField } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';

import type { PasswordProps } from 'primevue/password';

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

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  validatingAsync: false,
  toggleMask: true,
  feedback: false,
  placeholder: '',
});

const { t } = useI18n<{ message: MessageSchema }>();

const {
  errorMessage: vError,
  value,

} = useField<string>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const isReadonly = ref(true);

const finalPlaceholder = computed(() => props.placeholder || t('components.password.placeholder'));
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));
const model = computed<string>({
  get: () => value.value ?? '',
  set: (v) => (value.value = v),
});

const handleFocus = () => {
  isReadonly.value = false;
};
</script>

<style scoped>
@reference "@/tailwind.css";

/*
 * PrimeVue v4 ships `.p-password { display: inline-flex; position: relative; }` via runtime-injected
 * styles. When the wrapper is placed inside a flex column (label + input + error) and given
 * `class="w-full"`, the inline-flex container sometimes loses its `position: relative` context
 * relative to the absolutely-positioned `.p-password-toggle-mask-icon`, causing the eye icon to
 * fall below the input. We force `display: block; position: relative; width: 100%` on the
 * PrimeVue root and re-pin the toggle icon to the right edge of the input, vertically centered.
 * Mirrors the existing `.p-inputtext.p-password-input { !w-full }` override in App.vue.
 */
.f-password-wrapper :deep(.p-password) {
  @apply !block !relative !w-full;
}

.f-password-wrapper :deep(.p-password-toggle-mask-icon) {
  @apply !absolute !top-1/2 -translate-y-1/2 cursor-pointer z-10;
  /* inset-inline-end matches PrimeVue's form.field.padding.x (0.75rem) */
  inset-inline-end: 0.75rem;
}
</style>

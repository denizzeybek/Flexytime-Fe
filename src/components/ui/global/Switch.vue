<template>
  <div class="flex flex-col gap-2">
    <label :for="id">{{ label }}</label>
    <!-- <ToggleSwitch
      v-model="computedValue as unknown as any"
      :id="id"
      :data-error="!!errorMessage"
      class="w-full"
      :invalid="!!errorMessage"
      :class="[customClass]"
      v-bind="primeProps"
    /> -->
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
  customClass?: string;
  primeProps?: InputTextProps;
  errorMessage?: string;
  modelValue?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
});

const {
  errorMessage: vError,
  value,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const computedValue = computed({
  get: () => value.value ?? false, // Default to false if undefined
  set: (newValue: boolean) => {
    value.value = newValue;
  },
});

const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));
</script>

<style scoped></style>

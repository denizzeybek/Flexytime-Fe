<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="name" class="">{{ label }}</label>
    <SelectButton
      v-model="value"
      :options="options"
      :invalid="!!errorMessage"
      :class="[customWidth]"
      :aria-labelledby="arialabelledby"
      :multiple="multiple"
      :optionLabel="optionLabel"
      v-bind="primeProps"
      v-on="validationListeners"
      @change="onSelect($event)"
    >
    </SelectButton>
    <small v-if="errorMessage" class="p-error text-red-500" type="error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import SelectButton, { type SelectButtonProps } from 'primevue/selectbutton';
import { useField } from 'vee-validate';

import type { IOption } from '@/common/interfaces/option.interface';

export interface IProps {
  name: string;
  options: IOption[];
  label?: string;
  disabled?: boolean;
  modelValue?: IOption;
  errorMessage?: string;
  primeProps?: SelectButtonProps;
  customClass?: string;
  customWidth?: string;
  arialabelledby?: 'basic' | 'multiple' | 'custom';
  multiple?: boolean;
  optionLabel?: 'label';
}

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'update:modelValue', value: string | number): void;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  customWidth: 'w-full',
  arialabelledby: 'basic',
  multiple: false,
  optionLabel: 'label',
});

const emit = defineEmits<IEmits>();

const { errorMessage, value, handleBlur, handleChange } = useField<IOption>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const validationListeners = {
  blur: (e: InputEvent) => handleBlur(e, true),
  select: (e: InputEvent) => handleChange(e, !!errorMessage.value),
};

const onSelect = (e: any) => {
  const selectedValue = e?.value || e; // Extract the value if `e` is an object with a `value` property
  emit('selected', selectedValue);
};
</script>

<style>
@reference "@/tailwind.css";
.p-togglebutton-checked::before {
  @apply !bg-f-primary;
}
.p-togglebutton-checked span {
  @apply !text-white;
}
</style>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="name" class="">{{ label }}</label>
    <Select
      v-model="value"
      :options="options"
      :optionLabel="name"
      :placeholder="placeholder"
      :invalid="!!errorMessage"
      @change="onSelect($event)"
      v-on="validationListeners"
      :class="[{ 'p-invalid': errorMessage }, customWidth]"
    >
      <template #value="slotProps">
        <div v-if="slotProps?.value" class="flex items-center gap-3">
          <i v-if="slotProps?.value?.icon" :class="slotProps?.value?.icon" style="color: green"></i>
          <div v-if="slotProps?.value?.name">{{ slotProps?.value?.name }}</div>
        </div>
        <span v-else>
          {{ placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-3">
          <i v-if="slotProps.option?.icon" :class="slotProps.option?.icon" style="color: green"></i>
          <div v-if="slotProps.option?.name">{{ slotProps.option?.name }}</div>
        </div>
      </template>
      <template #dropdownicon>
        <slot name="customDropdownIcon"/>
      </template>
      <template #footer>
        <slot name="customFooter"/>
      </template>
    </Select>
    <small class="p-error text-red-500" v-if="errorMessage" type="error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import Select, { type SelectProps } from 'primevue/select';
import { useField } from 'vee-validate';

export interface IOption {
  name: string;
  value: any;
  icon?: string;
}

export interface IProps {
  options: IOption[];
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string | number;
  defaultValue?: string;
  customClass: string;
  primeProps: SelectProps;
  errorMessage?: string;
  customWidth: string
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Select an option',
  customWidth: 'w-full'
});

const { errorMessage, value, handleBlur, handleChange } = useField<string | number>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'update:modelValue', value: string | number): void;
}

const emit = defineEmits<IEmits>();

const validationListeners = {
  blur: (e: InputEvent) => handleBlur(e, true),
  select: (e: InputEvent) => handleChange(e, !!errorMessage.value),
};

const onSelect = (e: any) => {
  emit('selected', e);
};
</script>

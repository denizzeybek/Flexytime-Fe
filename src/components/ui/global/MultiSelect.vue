<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="">{{ label }}</label>
    <MultiSelect
      v-model="value"
      :options="options"
      :optionLabel="name"
      :placeholder="placeholder"
      :invalid="!!errorMessage"
      @change="onSelect($event)"
      v-on="validationListeners"
      :class="[customWidth]"
      v-bind="primeProps"
      filter
      :display="chip ? 'chip' : 'comma'"
    >
      <template #option="slotProps">
        <div class="flex items-center">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
      <template #chip="slotProps">
        <Tag severity="primary">{{ slotProps.value.name }}</Tag>
      </template>
      <template v-if="dropdownIcon" #dropdownicon>
        <i :class="dropdownIcon" />
      </template>
      <template v-if="filterIcon" #filtericon>
        <i :class="filterIcon" />
      </template>
      <template #header>
        <slot name="customHeader" />
      </template>
      <template #footer>
        <slot name="customFooter" />
      </template>
    </MultiSelect>
    <small :id="`${name}-help`"  class="p-error text-red-500" >
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import MultiSelect, { type MultiSelectProps } from 'primevue/multiselect';
import Tag from 'primevue/tag';
import { useField } from 'vee-validate';
import type { IOption } from '@/common/interfaces/option.interface';

export interface IProps {
  name: string;
  options: IOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string | number;
  defaultValue?: string;
  customClass?: string;
  primeProps?: MultiSelectProps;
  errorMessage?: string;
  filterIcon?: string; // icon class ex: pi pi-map-marker
  dropdownIcon?: string; // icon class ex: pi pi-map-marker
  chip?: boolean;
  customWidth?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Select an option',
  customWidth: 'w-full',
  chip: true,
});

const { errorMessage, value, handleBlur, handleChange } = useField<IOption[]>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'update:modelValue', value: IOption[]): void;
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

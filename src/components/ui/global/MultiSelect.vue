<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="">{{ label }}</label>
    <MultiSelect
      v-model="value"
      :options="options"
      optionLabel="name"
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
        <div v-if="headerAddBtn" class="px-3 pt-2 flex-1 flex flex-col">
          <Button
            class="!w-full"
            outlined
            label="Add new"
            icon="pi pi-plus"
            @click.stop="emit('addList')"
            type="button"
          />
        </div>
      </template>
      <template #footer>
        <slot name="customFooter" />
      </template>
    </MultiSelect>
    <small :id="`${name}-help`" class="p-error text-red-500">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import type { IOption } from '@/common/interfaces/option.interface';
import MultiSelect, { type MultiSelectProps } from 'primevue/multiselect';
import Tag from 'primevue/tag';
import { useField } from 'vee-validate';

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
  headerAddBtn?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Select an option',
  customWidth: 'w-full',
  chip: true,
});

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'addList'): void;
  (event: 'update:modelValue', value: IOption[]): void;
}
const emit = defineEmits<IEmits>();

const { errorMessage, value, handleBlur, handleChange } = useField<IOption[]>(
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
  emit('selected', e);
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="">{{ label }}</label>
    <Select
      v-model="value"
      :options="options"
      optionLabel="name"
      :placeholder="placeholder"
      :invalid="!!errorMessage"
      @change="onSelect($event)"
      v-on="validationListeners"
      :class="[customWidth]"
      v-bind="primeProps"
    >
      <template #value="slotProps">
        <div v-if="slotProps?.value" class="flex items-center gap-3">
          <i v-if="slotProps?.value?.icon" :class="slotProps?.value?.icon"></i>
          <div v-if="slotProps?.value?.name">{{ slotProps?.value?.name }}</div>
        </div>
        <span v-else>
          {{ placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-3">
          <i v-if="slotProps.option?.icon" :class="slotProps.option?.icon"></i>
          <div v-if="slotProps.option?.name">{{ slotProps.option?.name }}</div>
        </div>
      </template>
      <template #dropdownicon>
        <slot name="customDropdownIcon" />
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
    </Select>
    <small class="p-error text-red-500">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import type { IOption } from '@/common/interfaces/option.interface';
import Select, { type SelectProps } from 'primevue/select';
import { useField } from 'vee-validate';

export interface IProps {
  name: string;
  options: IOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  modelValue?: IOption;
  defaultValue?: string;
  errorMessage?: string;
  primeProps?: SelectProps;
  customClass?: string;
  customWidth?: string;
  headerAddBtn?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: 'Select an option',
  customWidth: 'w-full',
});

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'addList'): void;
  (event: 'update:modelValue', value: string | number): void;
}
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

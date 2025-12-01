<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="">{{ label }}</label>
    <Select
      v-model="value"
      :options="options"
      optionLabel="name"
      :placeholder="finalPlaceholder"
      :invalid="!!errorMessage"
      :class="[customWidth]"
      v-bind="primeProps"
      @change="onSelect($event)"
      @filter="onFilter($event)"
      v-on="validationListeners"
    >
      <template #value="slotProps">
        <div v-if="slotProps?.value" class="flex items-center gap-3">
          <i v-if="slotProps?.value?.icon" :class="slotProps?.value?.icon"></i>
          <div v-if="slotProps?.value?.name">{{ slotProps?.value?.name }}</div>
        </div>
        <span v-else>
          {{ finalPlaceholder }}
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
            :label="addButtonLabel"
            icon="pi pi-plus"
            type="button"
            :disabled="!filterValue.trim()"
            @click.stop="handleAddClick"
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Select, { type SelectChangeEvent, type SelectFilterEvent, type SelectProps } from 'primevue/select';
import { useField } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';

import type { IOption } from '@/common/interfaces/option.interface';

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

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'addList', filterValue: string): void;
  (event: 'update:modelValue', value: string | number): void;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: '',
  customWidth: 'w-full',
});

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const filterValue = ref('');

const { errorMessage, value, handleBlur, handleChange } = useField<IOption>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const finalPlaceholder = computed(() => props.placeholder || t('components.select.placeholder'));

const addButtonLabel = computed(() => {
  if (filterValue.value.trim()) {
    return t('components.select.addNewWithName', { name: filterValue.value.trim() });
  }
  return t('components.select.typeToAdd');
});

const validationListeners = {
  blur: (e: InputEvent) => handleBlur(e, true),
  select: (e: InputEvent) => handleChange(e, !!errorMessage.value),
};

const onSelect = (e: SelectChangeEvent) => {
  const selectedValue = e?.value;
  emit('selected', selectedValue);
};

const onFilter = (e: SelectFilterEvent) => {
  filterValue.value = e.value;
};

const handleAddClick = () => {
  if (filterValue.value.trim()) {
    emit('addList', filterValue.value.trim());
    filterValue.value = '';
  }
};
</script>

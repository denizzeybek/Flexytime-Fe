<template>
  <div class="flex flex-col gap-2">
    <label :for="name" class="">{{ label }}</label>
    <MultiSelect
      v-model="value"
      :options="options"
      optionLabel="name"
      :placeholder="finalPlaceholder"
      :invalid="!!errorMessage"
      :class="[customWidth]"
      v-bind="primeProps"
      filter
      :display="chip ? 'chip' : 'comma'"
      :pt="{
        pcFilterContainer: {
          root: {
            onkeydown: headerAddBtn ? handleFilterKeydown : undefined,
          },
        },
      }"
      @change="onSelect($event)"
      @filter="onFilter($event)"
      @show="focusFilterInput"
      v-on="validationListeners"
    >
      <template #option="slotProps">
        <div class="flex items-center">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
      <template #chip="{ value, removeCallback }: ChipSlotProps">
        <Tag icon="pi pi-times" severity="primary" class="!py-0.5 !text-xs" @click="removeCallback">{{ value.name }}</Tag>
      </template>

      <!-- <template #chip="{ value, removeCallback }">
        <Tag icon="pi pi-times" @click="removeCallback" severity="primary">{{ value.name }}</Tag>
      </template> -->
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
    </MultiSelect>
    <small :id="`${name}-help`" class="p-error text-red-500">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import MultiSelect, { type MultiSelectChangeEvent, type MultiSelectFilterEvent, type MultiSelectProps } from 'primevue/multiselect';
import Tag from 'primevue/tag';
import { useField } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';

import type { IOption } from '@/common/interfaces/option.interface';

interface ChipSlotProps {
  value: IOption;
  removeCallback?: () => void;
}

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

interface IEmits {
  (event: 'selected', value: any): void;
  (event: 'addList', filterValue: string): void;
  (event: 'update:modelValue', value: IOption[]): void;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  placeholder: '',
  customWidth: 'w-full',
  chip: true,
});

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const filterValue = ref('');

const { errorMessage, value, handleBlur, handleChange } = useField<IOption[]>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const finalPlaceholder = computed(() => props.placeholder || t('components.multiSelect.placeholder'));

const addButtonLabel = computed(() => {
  if (filterValue.value.trim()) {
    return t('components.multiSelect.addNewWithName', { name: filterValue.value.trim() });
  }
  return t('components.multiSelect.typeToAdd');
});

const validationListeners = {
  blur: (e: InputEvent) => handleBlur(e, true),
  select: (e: InputEvent) => handleChange(e, !!errorMessage.value),
};

const onSelect = (e: MultiSelectChangeEvent) => {
  emit('selected', e);
};

const onFilter = (e: MultiSelectFilterEvent) => {
  filterValue.value = e.value;
};

const clearFilterInput = () => {
  filterValue.value = '';
  // PrimeVue filter input'u overlay içinde, document'tan bul
  const filterInput = document.querySelector('.p-multiselect-overlay .p-multiselect-filter') as HTMLInputElement;
  if (filterInput) {
    filterInput.value = '';
    // Input event dispatch et ki PrimeVue internal state'i güncellensin
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const focusFilterInput = () => {
  setTimeout(() => {
    const filterInput = document.querySelector('.p-multiselect-overlay .p-multiselect-filter') as HTMLInputElement;
    if (filterInput) {
      filterInput.focus();
    }
  }, 0);
};

const findExistingOption = (searchText: string) => {
  return props.options.find(
    (opt) => opt.name.toLowerCase() === searchText.toLowerCase()
  );
};

const selectExistingOption = (option: IOption) => {
  const currentValues = value.value || [];
  const alreadySelected = currentValues.some((v) => v.value === option.value);
  if (!alreadySelected) {
    value.value = [...currentValues, option];
  }
  clearFilterInput();
};

const handleAddClick = () => {
  if (filterValue.value.trim()) {
    const existingOption = findExistingOption(filterValue.value.trim());
    if (existingOption) {
      selectExistingOption(existingOption);
    } else {
      emit('addList', filterValue.value.trim());
      clearFilterInput();
    }
  }
};

const handleFilterKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && filterValue.value.trim()) {
    e.preventDefault();
    e.stopPropagation();
    handleAddClick();
  }
};
</script>

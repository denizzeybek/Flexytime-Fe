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
      @change="onSelect($event)"
      v-on="validationListeners"
    >
      <template #option="slotProps">
        <div class="flex items-center">
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
      <template #chip="{ value, removeCallback }: ChipSlotProps">
        <Tag icon="pi pi-times" severity="primary" @click="removeCallback">{{ value.name }}</Tag>
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
            :label="t('components.multiSelect.addNew')"
            icon="pi pi-plus"
            type="button"
            @click.stop="emit('addList')"
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
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import MultiSelect, { type MultiSelectChangeEvent, type MultiSelectProps } from 'primevue/multiselect';
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
  (event: 'addList'): void;
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

const { errorMessage, value, handleBlur, handleChange } = useField<IOption[]>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    syncVModel: true,
  },
);

const finalPlaceholder = computed(() => props.placeholder || t('components.multiSelect.placeholder'));

const validationListeners = {
  blur: (e: InputEvent) => handleBlur(e, true),
  select: (e: InputEvent) => handleChange(e, !!errorMessage.value),
};

const onSelect = (e: MultiSelectChangeEvent) => {
  emit('selected', e);
};
</script>

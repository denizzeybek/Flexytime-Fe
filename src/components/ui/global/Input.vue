<template>
  <div v-click-outside="handleOutsideClick" class="flex flex-col gap-2 relative">
    <label :for="id">{{ label }}</label>
    <InputText
      :id="id"
      v-model="model"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled"
      :unstyled="unstyled"
      class="w-full"
      :invalid="!!errorMessage"
      :list="list"
      :class="[customClass]"
      v-bind="primeProps"
      @focus="list ? (showOptions = true) : (showOptions = false)"
      @input="filterOptions"
      v-on="listeners"
    />
    <slot name="dataList" />
    <ul
      v-if="showOptions"
      class="absolute z-50 top-full left-0 py-2 px-1 gap-2 w-full mt-1 border border-gray-200 rounded-md bg-white shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="option in filteredOptions"
        :key="option"
        class="hover:bg-slate-100 cursor-pointer rounded-s px-3 py-2"
        @click="selectOption(option)"
      >
        {{ option }}
      </li>
      <div v-if="!filteredOptions.length" class="px-3 py-2 gap-4 w-full flex flex-col">
        <FText :innerText="t('components.input.noOptionFound')" />
        <Button
          :label="t('components.input.addButton')"
          icon="pi pi-plus"
          class="flex-1"
          outlined
          @click="addNewOption"
        />
      </div>
    </ul>
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, type InputHTMLAttributes, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useField } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';

import type { InputTextProps } from 'primevue/inputtext';

interface IProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  customClass?: string;
  primeProps?: InputTextProps;
  errorMessage?: string;
  customEvents?: Record<string, (e: Event) => any>;
  transformValue?: (value: InputEvent) => unknown;
  list?: InputHTMLAttributes['list'];
  modelValue?: string;
  isValid?: boolean;
  disabled?: boolean;
  unstyled?: boolean;
  datalistOptions?: string[];
  onAddOption?: (value: string) => void | Promise<void>;
}

interface IEmits {
  (event: 'updateList', value: string): void;
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'text',
  disabled: false,
  placeholder: '',
  unstyled: false,
});

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const {
  errorMessage: vError,
  value,
  handleBlur,
  handleChange,
} = useField<string>(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const isFocused = ref(false);
const showOptions = ref(false);
const searchFilter = ref('');

// Computed filtered options - automatically reactive when props.datalistOptions changes
const filteredOptions = computed(() => {
  const options = props.datalistOptions || [];
  if (!searchFilter.value) return options;
  return options.filter((option) => option.toLowerCase().includes(searchFilter.value.toLowerCase()));
});

const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const model = computed<string>({
  get: () => value.value ?? '',
  set: (v) => (value.value = v),
});

const filterOptions = () => {
  searchFilter.value = value.value || '';
};

const selectOption = (option: string) => {
  value.value = option;
  showOptions.value = false;
  searchFilter.value = '';
};

const addNewOption = async () => {
  const option = value.value ?? '';
  if (props.onAddOption) {
    await props.onAddOption(option);
  }
  emit('updateList', option);
  selectOption(option);
};

const handleOutsideClick = () => {
  if (!isFocused.value) {
    showOptions.value = false;
  }
};

const listeners = {
  ...props.customEvents,
  blur: (e: InputEvent) => {
    handleBlur(e, true);
    props.customEvents?.blur?.(e);
    isFocused.value = false;
  },
  change: (e: InputEvent) => {
    handleChange(e);
    props.customEvents?.change?.(e);
  },
  input: (e: InputEvent) => {
    const value = props.transformValue ? props.transformValue(e) : e;
    handleChange(value, !!errorMessage.value);
    props.customEvents?.input?.(e);
  },
  focus: (e: InputEvent) => {
    props.customEvents?.focus?.(e);
    isFocused.value = true;
  },
};
</script>

<style scoped>
@reference "@/tailwind.css";
.unstyled:focus {
  outline: none;
}
.time-input {
  @apply !w-[38px] text-center;
}
</style>

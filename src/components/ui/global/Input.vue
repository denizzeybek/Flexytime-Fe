<template>
  <div class="flex flex-col gap-2 relative" v-click-outside="handleOutsideClick">
    <label :for="id">{{ label }}</label>
    <InputText
      v-model="value as unknown as string"
      :id="id"
      :data-error="!!errorMessage"
      :data-valid="isValid"
      :placeholder="placeholder"
      :disabled="disabled"
      :unstyled="unstyled"
      class="w-full"
      :invalid="!!errorMessage"
      :list="list"
      @focus="list ? (showOptions = true) : (showOptions = false)"
      @input="filterOptions"
      :class="[customClass]"
      v-on="listeners"
      v-bind="primeProps"
    />
    <slot name="dataList" />
    <ul
      v-if="showOptions"
      class="absolute z-10 py-2 px-1 gap-2 translate-y-10 w-full mt-1 border rounded-md bg-white"
    >
      <li
        v-for="option in filteredOptions"
        :key="option"
        @click="selectOption(option)"
        class="hover:bg-slate-100 cursor-pointer rounded-s px-3 py-2"
      >
        {{ option }}
      </li>
      <div v-if="!filteredOptions.length" class="px-3 py-2 gap-4 w-full flex flex-col">
        <FText innerText="No option found" />
        <Button @click="addNewOption" label="Add" icon="pi pi-plus" class="flex-1" outlined/>
      </div>
    </ul>
    <small :id="`${id}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import type { InputTextProps } from 'primevue/inputtext';
import { ref, computed, type InputHTMLAttributes, onMounted } from 'vue';
import { useField } from 'vee-validate';

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
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'text',
  disabled: false,
  placeholder: '',
  unstyled: false,
});

interface IEmits {
  (event: 'updateList', value: string): void;
}
const emit = defineEmits<IEmits>();

const isFocused = ref(false);
const showOptions = ref(false);
const filteredOptions = ref(props.datalistOptions || []);

const {
  errorMessage: vError,
  value,
  handleBlur,
  handleChange,
} = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const filterOptions = () => {
  const filter = (value.value as string)?.toLowerCase();
  filteredOptions.value = (props.datalistOptions || []).filter((option) =>
    option.toLowerCase().includes(filter),
  );
};

const selectOption = (option: string) => {
  value.value = option;
  showOptions.value = false;
};

const addNewOption = () => {
  const option = value.value as string;
  filteredOptions.value.push(option);
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
.unstyled:focus {
  outline: none;
}
.time-input {
  @apply !w-[38px] text-center;
}
</style>

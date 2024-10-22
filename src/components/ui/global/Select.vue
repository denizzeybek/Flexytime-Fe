<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="name" class="">{{ label }}</label>
    <Select
      v-model="value"
      :options="options"
      :optionLabel="name"
      :placeholder="placeholder"
      @change="onSelect($event)"
      v-on="validationListeners"
      class="w-full"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center gap-3">
          <i :class="slotProps.value.icon" style="color: green"></i>
          <div>{{ slotProps.value.name }}</div>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="flex items-center gap-3">
          <i :class="slotProps.option.icon" style="color: green"></i>
          <div>{{ slotProps.option.name }}</div>
        </div>
      </template>
      <template #dropdownicon>
        <!-- <i class="pi pi-map" /> -->
      </template>
      <template #footer>
        <div class="p-3">
          <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" />
        </div>
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
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
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

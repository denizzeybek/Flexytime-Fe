<template>
  <div>
    <label
      :for="name"
      class="flex items-start gap-2 cursor-pointer select-none"
      :class="[
        {
          'opacity-50 !cursor-not-allowed': disabled,
        },
        { 'flex-col-reverse': labelTop },
        { 'flex-row': labelLeft },
      ]"
    >
      <input
        :id="name"
        :name="name"
        type="checkbox"
        :value="checkedValue"
        :checked="checked"
        :trueValue="checkedValue"
        :falseValue="uncheckedValue"
        :disabled="disabled"
        @change="handleChange"
        class="hidden"
      />
      <span
        class="flex items-center justify-center w-5 h-5 transition-colors duration-100 border rounded min-w-5 min-h-5 active:ring-2 active:ring-f-stroke"
        :class="{
          'border-f-stroke hover:border-f-primary bg-f-white hover:bg-f-primary/5': !checked,
          'border-f-primary bg-f-primary hover:bg-f-primary-hovered hover:border-f-primary-hovered':
            checked,
        }"
      >
        <i v-if="checked" class="pi pi-check" style="color: white"></i>
      </span>

      {{ label }}
      <slot></slot>
    </label>
    <small class="p-error text-red-500" v-if="errorMessage" type="error">
      {{ errorMessage }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { useField } from 'vee-validate';

type CheckValueType = string | number | boolean;

export interface IProps {
  name: string;
  label?: string;
  checkedValue?: CheckValueType;
  uncheckedValue?: CheckValueType;
  disabled?: boolean;
  modelValue?: CheckValueType;
  syncVModel?: boolean;
  labelTop?: boolean;
  labelLeft?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  checkedValue: true,
  uncheckedValue: false,
  syncVModel: false,
});

const { errorMessage, checked, handleChange } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.checkedValue,
  uncheckedValue: props.uncheckedValue,
  syncVModel: props.syncVModel,
});
</script>

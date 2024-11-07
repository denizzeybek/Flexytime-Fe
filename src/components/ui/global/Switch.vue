<template>
  <div class="flex items-center gap-2">
    <label
      :for="name"
      class="flex items-center gap-2 cursor-pointer select-none"
      :class="[
        {
          'opacity-50 cursor-not-allowed': disabled,
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
        class="sr-only"
      />
      <span
        class="relative w-10 h-5 transition-colors duration-200 rounded-full"
        :class="{
          'bg-gray-300': !checked,
          'bg-f-primary': checked,
        }"
      >
        <span
          class="absolute top-0.5 left-0.5 h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
          :class="{
            'translate-x-5': checked,
            'translate-x-0': !checked,
          }"
        ></span>
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

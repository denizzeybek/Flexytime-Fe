<template>
  <div>
    <div class="flex flex-gap-3 flex-col">
      <label
        class="mb-2"
        :for="id"
        :class="[errorMessage ? 'text-red-500' : '']"
        >{{ label }}</label
      >

      <div class="flex gap-3">
        <InputText
          :type="type"
          v-model="itemInput"
          class="flex-1"
          :class="{ 'p-invalid': !!errorMessage }"
          @blur="handleBlur"
          @keyup.enter="addToList"
        />
        <Button icon="pi pi-plus" @click="addToList" />
      </div>
      <small :id="`${name}-help`" class="p-error text-red-500">{{
        errorMessage
      }}</small>
      <small :id="`${name}-help`" class="p-error text-red-500">{{
        localErrorMessage
      }}</small>
    </div>
    <div
      v-for="(item, idx) in itemList"
      :key="idx"
      class="flex gap-3 w-full mt-3"
    >
      <InputText :value="item" :disabled="true" class="flex-1" />
      <Button icon="pi pi-times" @click="removeItem(idx)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { string } from 'yup';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

interface IProps {
  id: string;
  name: string;
  modelValue?: string[];
  errorMessage?: string;
  label?: string;
  type?: string;
  regexPattern?: RegExp;
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'email',
});

const emit = defineEmits(['update:modelValue']);

const itemInput = ref<string>('');
const itemList = ref<string[]>(props.modelValue || []);
const localErrorMessage = ref<string>('');

const isTypeEmail = computed(() => props.type === 'email');

const inputValidationType = computed(() => {
  return isTypeEmail.value
    ? string().email('Please enter a valid email address.').required()
    : string().required();
});

const {
  errorMessage: vError,
  handleBlur,
  value,
  resetField,
} = useField(props.name, inputValidationType.value, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const errorMessage = computed(() => props.errorMessage ?? vError.value);

const addToList = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(itemInput.value) && isTypeEmail.value) {
    localErrorMessage.value = 'Please enter a valid email address.';
    return;
  } else if (
    itemInput.value &&
    props.regexPattern &&
    !props.regexPattern.test(itemInput.value)
  ) {
    localErrorMessage.value = `Please enter a valid ${
      props.label ?? props.name
    }`;
    return;
  } else if (!itemInput.value && !isTypeEmail.value) {
    localErrorMessage.value = `Please enter ${props.label ?? props.name}`;
    return;
  }
  resetField();
  if (
    itemInput.value &&
    !itemList.value.includes(itemInput.value) &&
    !errorMessage.value
  ) {
    itemList.value.push(itemInput.value);
    itemInput.value = '';
    localErrorMessage.value = '';
    value.value = itemList.value;
    emit('update:modelValue', value.value);
  }
};

const removeItem = (index: number) => {
  itemList.value.splice(index, 1);
  emit('update:modelValue', itemList.value);
};

watch(
  () => value.value,
  (newVal) => {
    itemList.value = (newVal as string[]) || [];
  },
  { immediate: true },
);
</script>

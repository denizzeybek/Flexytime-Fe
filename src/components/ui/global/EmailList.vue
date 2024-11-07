<template>
  <div>
    <div class="flex flex-gap-3 flex-col">
      <label>{{ label }}</label>
      <div class="flex gap-3">
        <InputText
          type="email"
          v-model="emailInput"
          class="flex-1"
          :class="{ 'p-invalid': !!errorMessage }"
          @blur="handleBlur"
          @keyup.enter="addToList"
        />
        <Button icon="pi pi-plus" @click="addToList" />
      </div>
      <small :id="`${name}-help`" class="p-error text-red-500">{{ errorMessage }}</small>
      <small :id="`${name}-help`" class="p-error text-red-500">{{ localErrorMessage }}</small>
    </div>
    <div v-for="(email, idx) in emails" :key="idx" class="flex gap-3 w-full mt-3">
      <InputText :value="email" :disabled="true" class="flex-1" />
      <Button icon="pi pi-times" @click="removeEmail(idx)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useField } from 'vee-validate';
import { string } from 'yup';

interface IProps {
  name: string;
  modelValue: string[];
  errorMessage?: string;
  label?: string;
}

const props = defineProps<IProps>();
const emit = defineEmits(['update:modelValue']);

const emails = ref<string[]>(props.modelValue || []);
const emailInput = ref<string>('');
const localErrorMessage = ref<string>('');

const {
  errorMessage: vError,
  handleBlur,
  value,
} = useField(props.name, string().email('Please enter a valid email address.').required(), {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const errorMessage = computed(() => (props.errorMessage ? props.errorMessage : vError.value));

const addToList = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    localErrorMessage.value = 'Please enter a valid email address.';
    return;
  }

  if (emailInput.value && !emails.value.includes(emailInput.value) && !errorMessage.value) {
    emails.value.push(emailInput.value);
    emailInput.value = '';
    localErrorMessage.value = '';
    value.value = emails.value;
    emit('update:modelValue', value.value);
  }
};

const removeEmail = (index: number) => {
  emails.value.splice(index, 1);
  emit('update:modelValue', emails.value);
};

watch(
  () => value.value,
  (newVal) => {
    emails.value = newVal as string[] || [];
  },
  { immediate: true },
);
</script>

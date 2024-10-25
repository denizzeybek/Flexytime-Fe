<template>
  <div class="flex gap-3 w-full">
    <InputText type="email" v-model="email" class="flex-1" :invalid="emails?.length === 0" />
    <Button icon="pi pi-plus" @click="addToList" @keyup.enter="addToList" />
  </div>
  <small :id="`${name}-help`" class="p-error text-red-500">{{ localErrorMessage }}</small>

  <div v-for="(email, idx) in emails" :key="idx" class="flex gap-3 w-full">
    <InputText :value="email" :disabled="true" class="flex-1" />
    <Button icon="pi pi-times" @click="emails.splice(idx, 1)"></Button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel, watch } from 'vue';

interface IProps {
  errorMessage?: string;
  name: string;
}

const props = defineProps<IProps>();

const email = ref('');
const emails = defineModel<string[]>('emails', { default: [] });
const localErrorMessage = ref();

const addToList = () => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    localErrorMessage.value = 'Please enter a valid email address.';
    return;
  }

  emails.value.push(email.value);
  email.value = '';
};

watch(
  () => props.errorMessage,
  () => {
    localErrorMessage.value = props.errorMessage;
  },
  { immediate: true },
);

watch(
  () => email.value,
  () => {
    if (email.value) {
      localErrorMessage.value = '';
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>

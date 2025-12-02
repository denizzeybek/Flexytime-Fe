<template>
  <div class="space-y-4">
    <!-- Demo Card Input -->
    <div class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">{{ cardNumberLabel }}</label>
      <div class="relative">
        <InputText
          v-model="cardNumber"
          placeholder="4242 4242 4242 4242"
          class="w-full !pl-12 !py-3 !rounded-xl"
          :class="{ '!border-primary': cardNumber.length > 0 }"
          @update:model-value="emitChange"
        />
        <i class="pi pi-credit-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ expiryLabel }}</label>
        <InputText
          v-model="expiry"
          placeholder="MM/YY"
          class="w-full !py-3 !rounded-xl"
          @update:model-value="emitChange"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ cvcLabel }}</label>
        <InputText
          v-model="cvc"
          placeholder="123"
          class="w-full !py-3 !rounded-xl"
          type="password"
          maxlength="4"
          @update:model-value="emitChange"
        />
      </div>
    </div>

    <!-- Demo Notice -->
    <div class="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-xs">
      <i class="pi pi-info-circle"></i>
      <span>{{ demoModeText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import InputText from 'primevue/inputtext';

interface IProps {
  cardNumberLabel: string;
  expiryLabel: string;
  cvcLabel: string;
  demoModeText: string;
}

interface IEmits {
  (e: 'valid-change', isValid: boolean): void;
  (e: 'submit', data: { cardNumber: string; expiry: string; cvc: string }): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const cardNumber = ref('');
const expiry = ref('');
const cvc = ref('');

const isValid = computed(() => {
  return cardNumber.value.length >= 16 && expiry.value.length >= 4 && cvc.value.length >= 3;
});

const emitChange = () => {
  emit('valid-change', isValid.value);
};

const getFormData = () => ({
  cardNumber: cardNumber.value,
  expiry: expiry.value,
  cvc: cvc.value,
});

defineExpose({
  getFormData,
  isValid,
});
</script>

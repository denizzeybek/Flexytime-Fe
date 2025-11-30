<template>
  <Transition name="slide-down">
    <div
      v-if="selectedCount > 0"
      class="sticky top-0 z-20 bg-f-primary text-white rounded-xl p-4 shadow-lg flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <i class="pi pi-check-square text-lg" />
        </div>
        <div>
          <div class="font-semibold">{{ selectedCount }} {{ t('pages.timesheets.unclassified.itemsSelected') }}</div>
          <div class="text-sm opacity-80">{{ totalTime }}</div>
        </div>
      </div>
      <Button
        :label="t('pages.timesheets.unclassified.categorizeButton')"
        icon="pi pi-tag"
        class="!bg-white !text-f-primary hover:!bg-gray-100"
        @click="$emit('categorize')"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  selectedCount: number;
  totalTime: string;
}

interface IEmits {
  (e: 'categorize'): void;
}

defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

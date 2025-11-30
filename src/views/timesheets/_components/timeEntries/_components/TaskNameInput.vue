<template>
  <div class="flex-1 relative">
    <div
      class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent focus-within:border-f-primary focus-within:bg-white transition-all duration-200"
    >
      <i class="pi pi-pencil text-gray-400" />
      <FInput
        name="taskName"
        class="flex-1"
        custom-class="unstyled"
        :placeholder="t('pages.timesheets.enterTime.timeEntry.placeholder')"
        list="taskOptions"
        unstyled
        :datalist-options="taskOptions"
        :on-add-option="onAddTask"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  taskOptions: string[];
  onAddTask: (taskName: string) => Promise<void>;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

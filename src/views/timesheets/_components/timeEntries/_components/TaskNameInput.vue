<template>
  <FInput
    name="taskName"
    class="flex-1"
    :placeholder="t('pages.timesheets.enterTime.timeEntry.placeholder')"
    list="taskOptions"
    icon="pi pi-pencil"
    :datalist-options="taskOptions"
    :on-add-option="onAddTask"
    hide-error
  />
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

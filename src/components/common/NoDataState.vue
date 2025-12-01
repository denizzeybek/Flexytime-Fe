<template>
  <div class="flex flex-col items-center gap-4 py-8">
    <img src="@/assets/images/noData.svg" alt="No Data" class="w-32" />
    <p class="text-gray-500">{{ displayMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  message?: string;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();

const displayMessage = computed(() => props.message ?? t('common.noDataAvailable'));
</script>

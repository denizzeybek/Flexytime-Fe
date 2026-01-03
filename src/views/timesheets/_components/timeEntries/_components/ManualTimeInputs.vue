<template>
  <Transition name="slide-fade">
    <div v-if="visible" class="flex items-center gap-3">
      <FTimeRange :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')" />

      <FDateTimePicker
        name="date"
        :number-of-months="1"
        :prime-props="{
          hourFormat: '24',
          fluid: true,
        }"
        hide-error
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  visible: boolean;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>

<template>
  <Button
    type="button"
    :icon="displayedIsDark ? 'pi pi-moon' : 'pi pi-sun'"
    :aria-label="isDark ? t('common.theme.switchToLight') : t('common.theme.switchToDark')"
    text
    rounded
    class="!w-9 !h-9 !text-content-secondary dark:!text-content-tertiary hover:!text-amber-500 dark:hover:!text-amber-400 hover:!bg-amber-500/10 dark:hover:!bg-amber-400/10 transition-all"
    @click="toggleTheme"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTheme } from '@/composables/useTheme';
import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
const { isDark, toggleTheme } = useTheme();

const displayedIsDark = ref(isDark.value);

const getThemeTransitionMs = (): number => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-transition-duration')
    .trim();
  if (raw.endsWith('ms')) return parseFloat(raw);
  if (raw.endsWith('s')) return parseFloat(raw) * 1000;
  return 250;
};

watch(isDark, (val) => {
  setTimeout(() => {
    displayedIsDark.value = val;
  }, getThemeTransitionMs());
});
</script>

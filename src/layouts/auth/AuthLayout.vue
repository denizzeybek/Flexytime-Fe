<template>
  <div class="relative flex h-screen overflow-hidden">
    <!-- AuthAside hidden for cleaner login experience -->
    <!-- <AuthAside :ad="ads[adName]" /> -->

    <main class="flex w-full flex-col items-center h-screen overflow-y-auto transition-colors duration-300
                 bg-brand-primary-subtle dark:bg-surface-primary">
      <div class="px-4 flex justify-between items-center w-full py-3 gap-2">
        <ThemeToggle />
        <FSelect
          v-model="selectedLanguageModel"
          name="language"
          :options="languageOptions"
          class="max-w-[140px]"
          @update:model-value="handleLanguageChange"
        />
      </div>
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import ThemeToggle from '@/components/ui/local/ThemeToggle.vue';
import { useLanguage } from '@/composables/useLanguage';

type TAdName = 'login' | 'register' | 'download' | 'forgot-password' | 'reset-password';

interface IProps {
  adName: TAdName;
}

withDefaults(defineProps<IProps>(), {
  adName: 'login',
});

const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

const languageOptions = getLanguageOptions();

const selectedLanguageModel = ref(languageOptions.find(lang => lang.value === currentLanguage.value));

const handleLanguageChange = async (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    await changeLanguage(option.value);
  }
};

watch(currentLanguage, (newLang) => {
  selectedLanguageModel.value = languageOptions.find(lang => lang.value === newLang);
});
</script>

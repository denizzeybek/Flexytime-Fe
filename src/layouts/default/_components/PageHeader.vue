<template>
  <div class="flex justify-between items-center py-4 px-6 bg-white rounded-2xl shadow-lg border border-gray-100">
    <div class="flex items-center gap-3">
      <div class="block lg:hidden">
        <Button size="large" icon="pi pi-bars" text rounded @click="$emit('drawerChange', true)" />
      </div>
      <h1 class="text-3xl font-semibold text-gray-800 tracking-tight">{{ route.name }}</h1>
    </div>
    <div class="hidden lg:flex items-center gap-3">
      <Button
        size="large"
        icon="pi pi-shopping-cart"
        :label="t('pages.layouts.pageHeader.upgrade.label')"
        severity="warn"
        class="shadow-md hover:shadow-lg transition-all"
      />
      <!-- <Button size="large" icon="pi pi-youtube" severity="danger" /> -->
      <!-- <Button size="large" icon="pi pi-question" outlined severity="contrast" /> -->
      <FSelect
        name="language"
        :value="selectedLanguage"
        :options="languageOptions"
        @update:model-value="handleLanguageChange"
        class="max-w-[140px]"
      />
      <ProfileMenu />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import ProfileMenu from '@/components/ui/local/ProfileMenu.vue';
import { useRoute } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useI18n<{ message: MessageSchema }>();
const route = useRoute();
const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

interface IEmits {
  (event: 'drawerChange', val: boolean): void;
}

defineEmits<IEmits>();

const languageOptions = getLanguageOptions();

const selectedLanguage = computed(() => {
  return languageOptions.find(lang => lang.value === currentLanguage.value);
});

const handleLanguageChange = (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    changeLanguage(option.value);
  }
};
</script>

<template>
  <div class="bg-surface-primary rounded-xl border border-border-secondary dark:border-border-primary p-6 transition-colors">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-content-primary">{{ t('pages.profile.basic.sections.preferences') }}</h3>
      <span class="text-xs text-content-quaternary">{{ t('pages.profile.basic.sections.autoSave') }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">{{ t('pages.profile.basic.language.label') }}</label>
        <Select
          v-model="prefs.selectedLanguage.value"
          :options="prefs.languageOptions"
          optionLabel="name"
          :placeholder="t('pages.profile.basic.language.placeholder')"
          class="w-full"
          :loading="prefs.isLanguageLoading.value"
          @update:model-value="prefs.handleLanguageChange"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">{{ t('pages.profile.basic.timezone.label') }}</label>
        <Select
          v-model="prefs.selectedTimezone.value"
          :options="prefs.timeZoneList.value"
          optionLabel="name"
          :placeholder="t('pages.profile.basic.timezone.placeholder')"
          class="w-full"
          filter
          :loading="prefs.isTimezoneLoading.value"
          @update:model-value="prefs.handleTimezoneChange"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">{{ t('pages.profile.basic.currency.label') }}</label>
        <Select
          v-model="prefs.selectedCurrency.value"
          :options="prefs.currencyList.value"
          optionLabel="name"
          :placeholder="t('pages.profile.basic.currency.placeholder')"
          class="w-full"
          filter
          :loading="prefs.isCurrencyLoading.value"
          @update:model-value="prefs.handleCurrencyChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Select from 'primevue/select';

import { type MessageSchema } from '@/plugins/i18n';
import { useProfilePreferences } from '@/views/profile/_composables/useProfilePreferences';

const { t } = useI18n<{ message: MessageSchema }>();
const prefs = useProfilePreferences();
</script>

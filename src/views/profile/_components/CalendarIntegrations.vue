<template>
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ t('pages.profile.calendarIntegrations.title') }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ t('pages.profile.calendarIntegrations.description') }}
        </p>
      </div>

      <!-- Integration Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Outlook Desktop (Primary - Active) -->
        <IntegrationCard
          provider="outlook"
          :title="t('pages.profile.calendarIntegrations.providers.outlook.title')"
          :description="t('pages.profile.calendarIntegrations.providers.outlook.description')"
          :connected="hasOutlook"
          :calendars="outlookCalendars"
          :loading="loadingStates.outlook"
          :is-desktop-app="true"
          @toggle-calendar="(calendar, selected) => handleToggleCalendar('outlook', calendar, selected)"
        />

        <!-- Google Calendar (Coming Soon) -->
        <IntegrationCard
          provider="google"
          :title="t('pages.profile.calendarIntegrations.providers.google.title')"
          :description="t('pages.profile.calendarIntegrations.providers.google.description')"
          :connected="hasGoogle"
          :calendars="googleCalendars"
          :loading="loadingStates.google"
          :coming-soon="true"
          @toggle-calendar="(calendar, selected) => handleToggleCalendar('google', calendar, selected)"
        />

        <!-- Office 365 (Coming Soon) -->
        <IntegrationCard
          provider="office"
          :title="t('pages.profile.calendarIntegrations.providers.office.title')"
          :description="t('pages.profile.calendarIntegrations.providers.office.description')"
          :connected="hasOffice"
          :calendars="officeCalendars"
          :loading="loadingStates.office"
          :coming-soon="true"
          @toggle-calendar="(calendar, selected) => handleToggleCalendar('office', calendar, selected)"
        />
      </div>

      <!-- Info Message -->
      <Message severity="info" :closable="false" class="mt-4">
        <template #icon>
          <i class="pi pi-info-circle"></i>
        </template>
        {{ t('pages.profile.calendarIntegrations.infoMessage') }}
      </Message>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import Message from 'primevue/message';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

import IntegrationCard from './IntegrationCard.vue';

import type { CalendarFolder } from '@/client';

type Provider = 'google' | 'office' | 'outlook';

const { t } = useI18n<{ message: MessageSchema }>();
const profileStore = useProfileStore();
const { showSuccessMessage, showErrorMessage } = useFToast();

const loadingStates = reactive({
  google: false,
  office: false,
  outlook: false,
});

// Computed properties from store
const hasGoogle = computed(() => profileStore.GeneralProfile?.HasGoogle ?? false);
const hasOffice = computed(() => profileStore.GeneralProfile?.HasOffice ?? false);
const hasOutlook = computed(() => profileStore.GeneralProfile?.HasOutlook ?? false);

const googleCalendars = computed(() => profileStore.GeneralProfile?.GoogleCalendars ?? []);
const officeCalendars = computed(() => profileStore.GeneralProfile?.OfficeCalendars ?? []);
const outlookCalendars = computed(() => profileStore.GeneralProfile?.OutlookCalendars ?? []);

// Handle calendar toggle
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleToggleCalendar = async (_provider: Provider, _calendar: CalendarFolder, _selected: boolean) => {
  try {
    // TODO: Implement API call when endpoint is ready
    // await ProfileApiService.syncCalendar({ Provider: provider, Name: calendar.Name, Selected: selected });
    showSuccessMessage(t('pages.profile.calendarIntegrations.messages.calendarUpdated'));
    await profileStore.filter();
  } catch {
    showErrorMessage(t('pages.profile.calendarIntegrations.errors.updateFailed'));
  }
};

onMounted(async () => {
  await profileStore.filter();
});
</script>

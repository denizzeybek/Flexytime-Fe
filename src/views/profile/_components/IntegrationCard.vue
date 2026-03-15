<template>
  <div
    class="bg-surface-primary rounded-2xl border transition-all duration-200"
    :class="[
      comingSoon
        ? 'border-border-secondary dark:border-border-primary opacity-75'
        : connected
          ? 'border-green-200 dark:border-green-700 shadow-sm'
          : 'border-border-secondary dark:border-border-primary hover:border-border-focus'
    ]"
  >
    <!-- Header -->
    <div class="p-5 border-b border-border-secondary dark:border-border-primary">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <!-- Provider Icon -->
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="providerStyles.bgClass"
          >
            <i :class="[providerStyles.icon, 'text-xl', providerStyles.iconClass]"></i>
          </div>
          <div class="flex flex-col">
            <h3 class="font-semibold text-content-primary">{{ title }}</h3>
            <p class="text-xs text-content-tertiary mt-0.5">{{ description }}</p>
          </div>
        </div>

        <!-- Status Badge -->
        <Tag
          v-if="comingSoon"
          :value="t('pages.profile.calendarIntegrations.status.comingSoon')"
          severity="secondary"
          class="!text-xs"
        />
        <Tag
          v-else-if="connected"
          :value="t('pages.profile.calendarIntegrations.status.connected')"
          severity="success"
          class="!text-xs"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Coming Soon State -->
      <template v-if="comingSoon">
        <div class="flex flex-col items-center justify-center py-4 text-center">
          <i class="pi pi-clock text-2xl text-content-quaternary mb-2"></i>
          <p class="text-sm text-content-tertiary">
            {{ t('pages.profile.calendarIntegrations.comingSoonMessage') }}
          </p>
        </div>
      </template>

      <!-- Connected State - Show Calendars -->
      <template v-else-if="connected && calendars.length > 0">
        <div class="flex flex-col gap-3">
          <span class="text-xs font-medium text-content-tertiary uppercase tracking-wider">
            {{ t('pages.profile.calendarIntegrations.selectCalendars') }}
          </span>
          <div class="flex flex-col gap-2 max-h-48 overflow-y-auto">
            <label
              v-for="calendar in calendars"
              :key="calendar.Name"
              class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-tertiary dark:hover:bg-surface-secondary cursor-pointer transition-colors"
            >
              <Checkbox
                :model-value="calendar.Selected"
                :binary="true"
                @update:model-value="(value: boolean) => emit('toggleCalendar', calendar, value)"
              />
              <span class="text-sm text-content-secondary">{{ calendar.Name }}</span>
            </label>
          </div>
        </div>
      </template>

      <!-- Connected but no calendars -->
      <template v-else-if="connected && calendars.length === 0">
        <div class="flex flex-col items-center justify-center py-4 text-center">
          <i class="pi pi-calendar text-2xl text-content-quaternary mb-2"></i>
          <p class="text-sm text-content-tertiary">
            {{ t('pages.profile.calendarIntegrations.noCalendars') }}
          </p>
        </div>
      </template>

      <!-- Not Connected State -->
      <template v-else>
        <div class="flex flex-col items-center justify-center py-4 text-center">
          <i class="pi pi-link text-2xl text-content-quaternary mb-2"></i>
          <p class="text-sm text-content-tertiary">
            {{ t('pages.profile.calendarIntegrations.notConnected') }}
          </p>
        </div>
      </template>
    </div>

    <!-- Footer Actions -->
    <div class="px-5 pb-5">
      <template v-if="comingSoon">
        <!-- Coming Soon - Disabled Button -->
        <Button
          :label="t('pages.profile.calendarIntegrations.status.comingSoon')"
          size="small"
          class="w-full"
          disabled
          severity="secondary"
        />
      </template>
      <template v-else-if="isDesktopApp">
        <!-- Desktop App Info -->
        <div class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-700 dark:text-blue-400 text-xs">
          <i class="pi pi-desktop"></i>
          <span>{{ t('pages.profile.calendarIntegrations.desktopAppOnly') }}</span>
        </div>
      </template>
      <template v-else-if="connected">
        <Button
          :label="t('pages.profile.calendarIntegrations.disconnect')"
          severity="danger"
          outlined
          size="small"
          class="w-full"
          :loading="loading"
          @click="emit('disconnect')"
        />
      </template>
      <template v-else>
        <Button
          :label="t('pages.profile.calendarIntegrations.connect')"
          size="small"
          class="w-full"
          :loading="loading"
          @click="emit('connect')"
        >
          <template #icon>
            <i class="pi pi-link mr-2"></i>
          </template>
        </Button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';

import { type MessageSchema } from '@/plugins/i18n';

import type { CalendarFolder } from '@/client';

type Provider = 'google' | 'office' | 'outlook';

interface IProps {
  provider: Provider;
  title: string;
  description: string;
  connected: boolean;
  calendars: CalendarFolder[];
  loading?: boolean;
  isDesktopApp?: boolean;
  comingSoon?: boolean;
}

interface IEmits {
  (e: 'connect'): void;
  (e: 'disconnect'): void;
  (e: 'toggleCalendar', calendar: CalendarFolder, selected: boolean): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const providerStylesMap: Record<Provider, { icon: string; bgClass: string; iconClass: string }> = {
  google: {
    icon: 'pi pi-google',
    bgClass: 'bg-red-50 dark:bg-red-950/40',
    iconClass: 'text-red-500 dark:text-red-400',
  },
  office: {
    icon: 'pi pi-microsoft',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    iconClass: 'text-blue-500 dark:text-blue-400',
  },
  outlook: {
    icon: 'pi pi-envelope',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40',
    iconClass: 'text-sky-500 dark:text-sky-400',
  },
};

const providerStyles = computed(() => providerStylesMap[props.provider]);
</script>

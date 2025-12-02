<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <div class="mb-6 pb-5 border-b border-gray-100">
        <Tabs :value="route.name?.toString()!">
          <TabList>
            <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method">
              <span class="font-medium">{{ tab.label }}</span>
            </Tab>
          </TabList>
        </Tabs>
      </div>

      <div class="mt-1">
        <div :class="route.name !== ERouteNames.ProfileBasic ? 
        'bg-white rounded-xl border border-gray-200 p-6' : 
        ''">
          <router-view :key="route.path" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { ERouteNames } from '@/router/routeNames.enum';

import type { MessageSchema } from '@/plugins/i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n<{ message: MessageSchema }>();

const items = ref([
  {
    route: ERouteNames.ProfileBasic,
    label: t('pages.profile.tabs.basic'),
    method: () => {
      router.push({ name: ERouteNames.ProfileBasic });
    },
  },
  {
    route: ERouteNames.ProfileLicense,
    label: t('pages.profile.tabs.license'),
    method: () => {
      router.push({ name: ERouteNames.ProfileLicense });
    },
  },
  // {
  //   route: ERouteNames.ProfileCommunication,
  //   label: t('pages.profile.tabs.communications'),
  //   method: () => {
  //     router.push({ name: ERouteNames.ProfileCommunication });
  //   },
  // },
  {
    route: ERouteNames.ProfilePassword,
    label: t('pages.profile.tabs.password'),
    method: () => {
      router.push({ name: ERouteNames.ProfilePassword });
    },
  },
  {
    route: ERouteNames.ProfileCalendarIntegrations,
    label: t('pages.profile.tabs.calendarIntegrations'),
    method: () => {
      router.push({ name: ERouteNames.ProfileCalendarIntegrations });
    },
  },
]);
</script>

<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <div class="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
        <Tabs :value="route.name?.toString()!">
          <TabList>
            <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method">
              <span class="font-medium">{{ tab.label }}</span>
            </Tab>
          </TabList>
        </Tabs>
        <div id="table-search" class="px-4"></div>
      </div>

      <div class="mt-1">
        <router-view :key="route.path" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import Card from 'primevue/card';

import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

const { t } = useI18n<{ message: MessageSchema }>();

const route = useRoute();
const router = useRouter();
const items = computed(() => [
  {
    route: ERouteNames.ClassificationWebAddresses,
    label: t('pages.classification.tabs.webAddresses'),
    method: () => {
      router.push({ name: ERouteNames.ClassificationWebAddresses });
    },
  },
  {
    route: ERouteNames.ClassificationApplications,
    label: t('pages.classification.tabs.applications'),
    method: () => {
      router.push({ name: ERouteNames.ClassificationApplications });
    },
  },
]);
</script>

<style></style>

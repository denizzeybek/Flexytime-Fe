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
        <router-view :key="route.path" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import Card from 'primevue/card';

const route = useRoute();
const router = useRouter();

const items = ref([
  {
    route: ERouteNames.HRSettingsActiveAnnuals,
    label: ERouteNames.HRSettingsActiveAnnuals,
    method: () => {
      router.push({ name: ERouteNames.HRSettingsActiveAnnuals });
    },
  },
  {
    route: ERouteNames.HRSettingsPassiveAnnuals,
    label: ERouteNames.HRSettingsPassiveAnnuals,
    method: () => {
      router.push({ name: ERouteNames.HRSettingsPassiveAnnuals });
    },
  },
]);
</script>

<style></style>

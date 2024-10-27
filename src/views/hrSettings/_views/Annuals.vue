<template>
  <Tabs :value="route.meta.name?.toString()!">
    <TabList>
      <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method()">
        <span>{{ tab.label }}</span>
      </Tab>
    </TabList>
  </Tabs>

  <TabPanels>
    <TabPanel :key="route.path" :value="route.path">
      <router-view :key="route.path" />
    </TabPanel>
  </TabPanels>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

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

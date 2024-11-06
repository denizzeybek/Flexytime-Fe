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
  import { ref } from 'vue';
  import { ERouteNames } from '@/router/routeNames.enum';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const items = ref([
    {
      route: ERouteNames.CompanyReportsElastic,
      label: ERouteNames.CompanyReportsElastic,
      method: () => {
        router.push({ name: ERouteNames.CompanyReportsElastic });
      },
    },
    {
      route: ERouteNames.CompanyReportsDefault,
      label: ERouteNames.CompanyReportsDefault,
      method: () => {
        router.push({ name: ERouteNames.CompanyReportsDefault });
      },
    },
  ]);
  </script>
  
  <style></style>
  
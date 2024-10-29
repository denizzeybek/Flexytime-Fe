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
      <Card>
        <template #content>
          <router-view :key="route.path" />
        </template>
      </Card>
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
    route: ERouteNames.ProfileBasic,
    label: ERouteNames.ProfileBasic,
    method: () => {
      router.push({ name: ERouteNames.ProfileBasic });
    },
  },
  {
    route: ERouteNames.ProfileLicense,
    label: ERouteNames.ProfileLicense,
    method: () => {
      router.push({ name: ERouteNames.ProfileLicense });
    },
  },
  {
    route: ERouteNames.ProfileCommunication,
    label: ERouteNames.ProfileCommunication,
    method: () => {
      router.push({ name: ERouteNames.ProfileCommunication });
    },
  },
  {
    route: ERouteNames.ProfilePassword,
    label: ERouteNames.ProfilePassword,
    method: () => {
      router.push({ name: ERouteNames.ProfilePassword });
    },
  },
]);
</script>

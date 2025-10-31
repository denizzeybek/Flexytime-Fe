<template>
  <Card
    class="shadow-lg border mb-5 border-gray-100 rounded-2xl overflow-hidden"
  >
    <template #content>
      <div class="">
        <Tabs :value="route.name?.toString()!">
          <TabList>
            <Tab
              v-for="(tab, idx) in items"
              :key="idx"
              :value="tab.route"
              @click="tab.method"
            >
              <span class="font-medium">{{ tab.label }}</span>
            </Tab>
          </TabList>
        </Tabs>
      </div>
    </template>
  </Card>
  <div class="mt-1">
    <router-view :key="route.path" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import Card from 'primevue/card';

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

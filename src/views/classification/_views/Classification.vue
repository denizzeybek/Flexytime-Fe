<template>
  <div class="card">
    
    <Tabs :value="route.fullPath">
      <TabList>
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <a v-ripple :href="href" @click="navigate">
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>

    <TabPanels>
      <TabPanel :key="route.path" :value="route.path">
        <router-view :key="route.path" />
      </TabPanel>
    </TabPanels>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ERouteNames } from '@/router/routeNames.enum'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = ref([
  { route: '/classification/web-addresses', label: ERouteNames.ClassificationWebAddresses },
  { route: '/classification/applications', label: ERouteNames.ClassificationApplications }
])
</script>

<style></style>

<template>
  <aside
    class="fixed top-0 z-20 w-[238px] h-screen transition-transform -translate-x-full lg:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-6 py-2 overflow-y-auto">
      <!-- <RouterLink :to="{ name: ERouteNames.Dashboard }" class="flex items-center mb-2 ml-3">
        <RIcon :name="EIconNames.Ruul" :size="72" />
      </RouterLink> -->
      <Navbar />
    </div>
  </aside>
</template>

<script lang="ts" setup>
// import { EIconNames } from '@/common/enums/icons.enum'
// import { ERouteNames } from '@/router/routeNames.enum'

import Navbar from './Navbar.vue'


</script>

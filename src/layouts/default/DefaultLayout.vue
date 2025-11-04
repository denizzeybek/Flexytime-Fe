<template>
  <div class="flex w-full min-h-screen bg-gray-100 3xl:justify-center">
    <div class="flex flex-col max-w-[1800px] w-full relative">
      <Sidebar />
      <MobileSidebar v-model="visible" @drawerChange="visible = $event" />
      <PageWrapper @drawerChange="visible = $event">
        <RouterView />
      </PageWrapper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import MobileSidebar from './_components/MobileSidebar.vue'
import PageWrapper from './_components/PageWrapper.vue'
import Sidebar from './_components/Sidebar.vue'

const visible = ref(false)
</script>

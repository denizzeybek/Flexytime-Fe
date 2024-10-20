<template>
  <div class="flex w-full min-h-screen 3xl:justify-center">
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
import Sidebar from './_components/Sidebar.vue'
import MobileSidebar from './_components/MobileSidebar.vue'
import PageWrapper from './_components/PageWrapper.vue'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <div class="flex w-full min-h-screen bg-surface-secondary dark:bg-surface-primary 3xl:justify-center transition-colors duration-300">
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
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import MobileSidebar from './_components/MobileSidebar.vue'
import PageWrapper from './_components/PageWrapper.vue'
import Sidebar from './_components/Sidebar.vue'

const route = useRoute()
const visible = ref(false)

watch(() => route.name, () => {
  visible.value = false
})
</script>

<template>
  <div class="flex w-full min-h-screen bg-surface-secondary dark:bg-surface-primary 3xl:justify-center transition-colors duration-300">
    <div class="flex flex-col max-w-[1800px] w-full relative">
      <template v-if="!isAdmin">
        <Sidebar />
        <MobileSidebar v-model="visible" @drawerChange="visible = $event" />
      </template>
      <PageWrapper :hide-sidebar="isAdmin" @drawerChange="visible = $event">
        <RouterView />
      </PageWrapper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useProfileStore } from '@/stores/profile/profile'

import MobileSidebar from './_components/MobileSidebar.vue'
import PageWrapper from './_components/PageWrapper.vue'
import Sidebar from './_components/Sidebar.vue'

const route = useRoute()
const profileStore = useProfileStore()

const visible = ref(false)
const isAdmin = computed(() => profileStore.isAdmin)

watch(() => route.name, () => {
  visible.value = false
})
</script>

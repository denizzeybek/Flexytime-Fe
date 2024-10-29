<template>
  <aside
    class="fixed top-0 z-20 w-[238px] h-screen transition-transform -translate-x-full lg:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-6 py-2 overflow-y-auto">
      <Navbar />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import Navbar from './Navbar.vue'
</script>

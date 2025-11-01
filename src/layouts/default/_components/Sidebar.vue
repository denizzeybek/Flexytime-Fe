<template>
  <aside
    class="fixed top-0 left-0 z-20 w-[238px] h-screen transition-transform -translate-x-full lg:translate-x-0 p-4"
    aria-label="Sidebar"
  >
    <div class="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div class="h-full px-4 py-4 overflow-y-auto">
        <Navbar />
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import Navbar from './Navbar.vue'
</script>

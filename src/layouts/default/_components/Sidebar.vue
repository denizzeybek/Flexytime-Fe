<template>
  <aside
    class="fixed top-0 left-0 z-20 w-[260px] h-screen transition-transform -translate-x-full lg:translate-x-0 p-4"
    aria-label="Sidebar"
  >
    <div
      class="h-full rounded-2xl shadow-lg border overflow-hidden transition-colors duration-300
             bg-surface-primary dark:bg-surface-elevated
             border-border-secondary dark:border-border-primary"
    >
      <div class="h-full px-4 py-4 overflow-y-auto">
        <Navbar />
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import Navbar from './Navbar.vue'
</script>

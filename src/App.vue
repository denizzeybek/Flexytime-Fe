<template>
  <router-view />
</template>

<script setup>
</script>

<style>
/* #region tablist */
.p-tablist-content {
  @apply !mb-5 ;
}
.p-tabs {
  @apply !p-0 !m-0;
}
.p-tablist-tab-list {
  @apply !w-fit !rounded-xl !border-f-gray !border !bg-f-light-gray;
}
.p-tab {
  @apply !border-transparent !text-f-dark-gray  !rounded-xl;
}
.p-tab.p-tab-active {
  @apply !bg-white !text-black !rounded-xl !border-none !transform !scale-104;
}
.p-tablist-active-bar {
  @apply !hidden;
}
.p-tabpanels {
  @apply !bg-transparent;
  
}
/* #endregion */

/* #region panelMenu */
.p-panelmenu {
  @apply !gap-0;
}
.p-panelmenu .p-panelmenu-panel {
  @apply !border-none;
}
/* #endregion */

</style>

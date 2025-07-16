<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style>
/* #region tablist */
.p-tablist-content {
  @apply !px-5;
}
.p-tabs {
  @apply !p-0 !m-0;
}
.p-tablist-tab-list {
  @apply !w-fit !rounded-xl !border-f-gray !border !bg-f-light-gray;
}
.p-tab {
  @apply !border-transparent !text-f-dark-gray  !rounded-xl !py-3;
}
.p-tab.p-tab-active {
  @apply !bg-f-primary !text-white !rounded-xl  !transform !scale-104;
}
.p-tablist-active-bar {
  @apply !hidden;
}
.p-tabpanels {
  @apply !bg-transparent;
}
/* #endregion */

/* #region input */
.p-inputtext.p-password-input {
  @apply !w-full;
}
/*#endregion */

/* #region breadcrumb */
.p-breadcrumb {
  @apply !bg-transparent !p-0;
}
/*#endregion */

.p-button-secondary.p-button-outlined {
  @apply !bg-slate-50 !text-slate-700 !border-slate-300;
}
.p-button-secondary.p-button-outlined .p-button-icon {
  @apply !text-slate-700;
}
</style>

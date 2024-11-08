<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile/profile';

const profileStore = useProfileStore();

onMounted(async () => {
  await profileStore.filterTimeZones();
  await profileStore.filter()
});
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
  @apply !bg-white !text-black !rounded-xl !border-none !transform !scale-104;
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
</style>

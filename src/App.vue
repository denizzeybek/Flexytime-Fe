<template>
  <router-view />
</template>

<script setup lang="ts"></script>

<style>
@reference "@/tailwind.css";

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

/* #region panelmenu */
.p-panelmenu {
  @apply !border-0 !bg-transparent space-y-1;
}
.p-panelmenu-panel {
  @apply !p-0 !border-transparent;
}
.p-panelmenu-header {
  @apply !border-transparent !bg-transparent;
}
.p-panelmenu-header-content {
  @apply !border-0 !bg-transparent !rounded-lg transition-all;
}
.p-panelmenu-header-action {
  @apply flex items-center justify-between w-full gap-2 !px-3 !py-2 !text-gray-600 hover:!bg-gray-50 !rounded-lg transition-colors;
}
.p-panelmenu-header-label {
  @apply !text-[14px] !font-medium flex-1;
}
.p-submenu-icon {
  @apply !text-sm !text-gray-400 transition-transform;
}
.p-panelmenu-content {
  @apply !bg-gray-50/30;
}
.p-panelmenu-panel .p-menuitem-content {
  @apply !border-0 !pt-2 !pb-2 !pl-3 !space-y-1;
}
.p-panelmenu .p-menuitem {
  @apply !mb-0;
}
/* #endregion */
</style>

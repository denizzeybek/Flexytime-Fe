<!--
  Bu dosya yeni refactored component'ların nasıl kullanılacağını gösterir.
  Router'da bu şekilde implement edilebilir.
-->

<template>
  <!-- Team View Example -->
  <WorktimeUsageMain view-mode="team" />
  
  <!-- Individual View Example -->  
  <!-- <WorktimeUsageMain view-mode="individual" /> -->
</template>

<script setup lang="ts">
// Router'da bu şekilde kullanım:

// Team routes:
// {
//   path: '/clock/section',
//   component: () => import('@/views/worktimeUsage2/EXAMPLE_USAGE.vue'),
//   props: { viewMode: 'team' },
//   children: [
//     {
//       path: 'productivity-team',
//       component: () => import('@/views/worktimeUsage2/_components/subPages/productivity/ProductivityTable.vue'),
//       props: { viewType: 'team' }
//     },
//     {
//       path: 'productivity-individuals', 
//       component: () => import('@/views/worktimeUsage2/_components/subPages/productivity/ProductivityTable.vue'),
//       props: { viewType: 'individual' }
//     },
//     {
//       path: 'distribution',
//       component: () => import('@/views/worktimeUsage2/_components/subPages/distribution/DistributionView.vue')
//     },
//     {
//       path: 'productivity-graph',
//       component: () => import('@/views/worktimeUsage2/_components/subPages/productivity/ProductivityGraph.vue')
//     }
//   ]
// }

// Individual routes:
// {
//   path: '/clock/employee',
//   component: () => import('@/views/worktimeUsage2/EXAMPLE_USAGE.vue'),
//   props: { viewMode: 'individual' },
//   children: [
//     {
//       path: 'distribution',
//       component: () => import('@/views/worktimeUsage2/_components/subPages/distribution/DistributionView.vue')
//     },
//     {
//       path: 'productivity-graph',
//       component: () => import('@/views/worktimeUsage2/_components/subPages/productivity/ProductivityGraph.vue')
//     }
//   ]
// }

import WorktimeUsageMain from './_views/WorktimeUsageMain.vue';
</script>
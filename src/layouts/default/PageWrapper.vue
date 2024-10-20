<template>
  <div class="flex flex-col flex-1 lg:ml-[238px] my-2 lg:mb-5 mx-2 sm:m-3 sm:p-3 lg:mr-5">
    <CenoaBanner v-if="$route.name === ERouteNames.Dashboard" />
    <main class="flex flex-col flex-1 bg-r-white rounded-lg p-2 lg:px-9 lg:py-6">
      <div id="alert" class="alert"></div>
      <section class="flex flex-col flex-1 h-full rounded-b-lg">
        <slot></slot>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import CenoaBanner from '@/components/ui/local/CenoaBanner.vue'
import { ERouteNames } from '@/router/routeNames.enum'
</script>

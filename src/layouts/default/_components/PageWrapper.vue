<template>
  <div class="flex flex-col flex-1 lg:ml-[238px] my-2 lg:mb-5 mx-2 md:m-3 md:p-3 lg:mr-5">
    <main
      class="flex flex-col flex-1 bg-r-white rounded-lg p-2 lg:px-9 lg:py-6 bg-f-secondary-purple"
    >
      <div id="alert" class="alert"></div>
      <section class="flex flex-col flex-1 h-full rounded-b-lg">
        <PageHeader @drawerChange="emit('drawerChange', $event)" />
        <slot></slot>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ERouteNames } from '@/router/routeNames.enum'
import PageHeader from './PageHeader.vue'

interface IEmits {
  (event: 'drawerChange', val: boolean): void
}

const emit = defineEmits<IEmits>()
</script>

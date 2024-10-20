<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0 "
  >
    <!-- BACKDROP -->
    <div v-if="true" class="fixed inset-0 z-40 flex max-w-full bg-gray-700 bg-opacity-50">
      <section
        id="tour-tooltip"
        class="absolute max-w-[275px] w-[275px] border rounded-lg shadow border-r-stroke bg-r-white right-0 lg:left-1/2 lg:-translate-x-1/2 top-12"
      >
        <!-- ARROW -->
        <span
          class="absolute inline-block w-3 h-3 rotate-45 rounded-sm bg-r-white -translate-x-1/2 left-1/2 -top-1.5 border-t border-t-r-stroke border-l border-l-r-stroke"
        ></span>
        <div class="flex flex-col gap-1 px-5 py-4">
          <RText as="h6">{{ t('pages.dashboard.tour.title') }}</RText>
          <RText as="p" class="!text-r-secondary">{{
            t('pages.dashboard.tour.description')
          }}</RText>
        </div>
      </section>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { MessageSchema } from '@/plugins/i18n'
import { nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n<{ message: MessageSchema }>()

let component: HTMLElement

onMounted(() => {
  nextTick(() => {
    component = document.querySelector('#company-dropdown') as HTMLElement
    if (component) {
      component.style.position = 'relative'
      component.style.zIndex = '50'
      component.style.border = '5px solid #FFC005'
      component.style.borderRadius = '12px'
      component.appendChild(document.querySelector('#tour-tooltip') as HTMLElement)
    }
  })
})

onUnmounted(() => {
  if (component) {
    component.style.zIndex = ''
    component.style.border = ''
    component.style.borderRadius = ''
    component.removeChild(document.querySelector('#tour-tooltip') as HTMLElement)
  }
})
</script>

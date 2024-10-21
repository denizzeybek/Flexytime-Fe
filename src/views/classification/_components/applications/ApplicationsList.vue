<template>
  <WebAddressesTable :is-loading="isLoading" />
</template>

<script setup lang="ts">
import WebAddressesTable from './ApplicationsTable.vue'
import { onMounted, ref } from 'vue'
import { useClassificationApplicationsStore } from '@/stores/classification/applications'
import type { IApplicationDTOPayload } from '@/interfaces/application'

const applicationsStore = useClassificationApplicationsStore()
const isLoading = ref(false)

const fetchApplications = async () => {
  try {
    isLoading.value = true
    const payload = {
      descending: false,
      length: 5,
      search: '',
      sort: '',
      start: 1
    } as IApplicationDTOPayload
    await applicationsStore.filter(payload)
    isLoading.value = false
  } catch (error) {
    console.log('error ', error)
  }
}

onMounted(() => {
  // fetchApplications()
})
</script>

<style scoped></style>

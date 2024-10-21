<template>
  <WebAddressesTable :is-loading="isLoading" />
</template>

<script setup lang="ts">
import WebAddressesTable from './WebAddressesTable.vue'
import { onMounted, ref } from 'vue'
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses'
import type { IWebaddressDTOPayload } from '@/interfaces/webAddress'

const webAddressesStore = useClassificationWebAddressesStore()
const isLoading = ref(false)

const fetchWebAddresses = async () => {
  try {
    isLoading.value = true
    const payload = {
      descending: false,
      length: 5,
      search: '',
      sort: '',
      start: 1
    } as IWebaddressDTOPayload
    await webAddressesStore.filter(payload)
    isLoading.value = false
  } catch (error) {
    console.log('error ', error)
  }
}

onMounted(() => {
  // fetchWebAddresses()
})
</script>

<style scoped></style>

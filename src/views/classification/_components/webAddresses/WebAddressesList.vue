<template>
  <WebAddressesTable />
</template>

<script setup lang="ts">
import WebAddressesTable from './WebAddressesTable.vue'
import { onMounted } from 'vue'
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses'
import type { IWebaddressDTOPayload } from '@/interfaces/webAddress'

const webAddressesStore = useClassificationWebAddressesStore()

const fetchWebAddresses = async () => {
  try {
    const payload = {
      descending: false,
      length: 5,
      search: '',
      sort: '',
      start: 1
    } as IWebaddressDTOPayload
    await webAddressesStore.filter(payload)
  } catch (error) {
    console.log('error ', error);
  }
}

onMounted(() => {
  // fetchWebAddresses()
})
</script>

<style scoped></style>

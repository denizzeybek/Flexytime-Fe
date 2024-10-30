<template>
  <div class="flex gap-2 items-center">
    <Button v-tooltip.top="'Download Report'" icon="pi pi-arrow-circle-down" severity="secondary" />
    <DatePicker v-model="dates" selectionMode="range" variant="filled" :manualInput="false" />
    <FSelect
      v-model="country"
      customWidth="w-20"
      name="country"
      placeholder="Select country"
      :options="countries"
      :primeProps="{
        variant: 'filled',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const dates = ref([new Date(), new Date()]);
const country = ref({ name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' });

const countries = ref([
  { name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: 'Rate', value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: 'In Shift', value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
]);
</script>

<style scoped></style>

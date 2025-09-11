<template>
  <div v-if="isReady" class="flex gap-2 items-center w-full lg:w-fit">
    <Button
      v-tooltip.top="'Download Report'"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      outlined
    />
    
    <FDateTimePicker
      class="flex-1"
      name="date"
      placeholder="Enter date"
      :prime-props="{
        showTime: false,
        hourFormat: '24',
        fluid: true,
        selectionMode: 'range',
        incrementIcon: true,
        manuelInput: true,
        variant: 'filled',
      }"
    />
    
    <FSelect
      name="perspective"
      placeholder="Select perspective"
      :options="perspectiveOptions"
      :primeProps="{
        variant: 'filled',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, nextTick, ref } from 'vue';
import { useWorktimeFilters } from '../../_composables/useWorktimeFilters';
import type { FilterPayload } from '../../_types';

const handleFilterChange = inject('handleFilterChange') as (payload: FilterPayload) => void;
const isReady = ref(false);

const {
  date,
  perspective,
  resetForm,
  getInitialFormData,
  perspectiveOptions,
  triggerInitialLoad,
} = useWorktimeFilters(handleFilterChange);

onMounted(async () => {
  try {
    // Wait for component to be fully mounted
    await nextTick();
    
    resetForm({
      values: getInitialFormData.value,
    });
    
    // Wait for form to be reset
    await nextTick();
    
    triggerInitialLoad();
    
    // Mark component as ready
    isReady.value = true;
  } catch (error) {
    console.error('Error during FilterActions mount:', error);
    // Still mark as ready to prevent infinite loading
    isReady.value = true;
  }
});
</script>
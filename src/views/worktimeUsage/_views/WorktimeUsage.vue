<template>
  <div class="card flex justify-center">
      <SelectButton v-model="value" :options="options" aria-labelledby="basic" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('One-Way');
const options = ref(['One-Way', 'Return', 'Two Way']);
</script>
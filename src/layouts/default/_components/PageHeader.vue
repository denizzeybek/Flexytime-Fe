<template>
  <div>
    <div class="block lg:hidden">
      <Button icon="pi pi-arrow-right" @click="$emit('drawerChange', true)" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface IEmits {
  (event: 'drawerChange', val: boolean): void
}

defineEmits<IEmits>()
</script>

<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 z-10 border rounded-lg bg-f-white border-f-red"
  >
    <div class="flex items-center justify-between w-full h-full px-5 bg-f-red/10">
      <span class="flex items-center gap-2">
        <span class="pi pi-exclamation-triangle !text-f-red !text-2xl"></span>
        <FText as="h6" className="!text-f-red">{{ message }}</FText>
      </span>
      <span class="cursor-pointer">
        <span class="pi pi-times !text-f-red !text-2xl"></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  message: string;
}
defineProps<IProps>();
</script>

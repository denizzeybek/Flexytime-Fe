<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-between p-5 border rounded-lg border-f-green bg-f-green/15 text-f-green"
  >
    <span class="flex items-center gap-2">
      <span class="pi pi-check-circle !text-f-success !text-2xl" ></span>
      <FText as="h6" className="!text-f-green">{{ message }}</FText>
    </span>
    <span class="cursor-pointer">
      <span class="pi pi-times !text-f-success !text-2xl"></span>
    </span>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  message: string;
}
defineProps<IProps>();
</script>

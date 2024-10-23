<template>
  <div
    :class="[`border-f-${severity}`]"
    outlined
    class="!flex-1 border h-[72px] flex items-center !rounded-xl !p-4"
  >
    <div class="flex items-center gap-2">
      <Button :severity="severity" icon="pi pi-clock" class="!w-8 !h-8 !rounded-md"></Button>
      <div class="flex flex-col justify-start">
        <div :class="`text-f-${severity}`" class="text-sm">{{ title }}</div>
        <div class="text-f-black text-sm">{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  severity: string;
  title: string;
  value: any;
}

defineProps<IProps>();
</script>

<style scoped></style>

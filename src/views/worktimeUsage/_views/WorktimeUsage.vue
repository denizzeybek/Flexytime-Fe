<template>
  <div id="messages-area" class="flex flex-col gap-3 mb-4">
    <Message severity="warn" icon="pi pi-exclamation-triangle">Info Message</Message>
  </div>
  <section>
    <div class="flex gap-4 h-[150px] w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>
</template>

<script setup lang="ts">
import UserBadge from '@/views/worktimeUsage/_components/UserBadge.vue';
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';

</script>

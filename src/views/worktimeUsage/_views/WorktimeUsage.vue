<template>
  <div id="messages-area" class="flex flex-col gap-3 mb-4">
    <Message severity="warn" icon="pi pi-exclamation-triangle">Info Message</Message>
    <!-- <Message severity="warn" icon="pi pi-exclamation-triangle">Info Message</Message> -->
  </div>
  <section>
    <div class="flex gap-4 h-[150px] w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UserBadge from '@/views/worktimeUsage/_components/UserBadge.vue';
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';
import { useFToast } from '@/composables/useFToast';

const value = ref('One-Way');
const options = ref(['One-Way', 'Return', 'Two Way']);
const { showSuccessMessage, showErrorMessage } = useFToast();

onMounted(() => {
  showSuccessMessage('Success Message');
  showErrorMessage('Error Message');
});
</script>

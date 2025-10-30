<template>
  <div v-if="visible" class="mb-4">
    <PMessage :severity="severity" :closable="closable" @close="handleClose">
      <template #default>
        {{ message }}
      </template>
    </PMessage>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PMessage from 'primevue/message';

interface IProps {
  message: string;
  severity?: 'success' | 'info' | 'warn' | 'error';
  closable?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  severity: 'info',
  closable: true,
});

const visible = ref(true);

watch(
  () => props.message,
  () => {
    visible.value = true;
  }
);

const handleClose = () => {
  visible.value = false;
};
</script>

import { IProps } from './Select.vue';
<template>
  <Avatar v-bind="primeProps" :label="avatarLabel"/>
</template>

<script setup lang="ts">
import Avatar, { type AvatarProps } from 'primevue/avatar';
import { computed } from 'vue';

interface IProps {
  primeProps?: AvatarProps;
  label: string;
}
const props = defineProps<IProps>();

const avatarLabel = computed(() => {
  return props.label
    .split(' ') // Split the name by spaces
    .map((word) => word[0]) // Get the first letter of each word
    .join('') // Join the letters together
    .toUpperCase();
});
</script>

<style scoped></style>

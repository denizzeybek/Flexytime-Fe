<template>
  <Avatar v-bind="primeProps" :label="avatarLabel" :class="customClass">
    <slot/>
  </Avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Avatar, { type AvatarProps } from 'primevue/avatar';

import { getAvatarLabel } from '@/helpers/utils';

interface IProps {
  primeProps?: AvatarProps;
  label: string;
  customClass?: string;
}
const props = defineProps<IProps>();

const avatarLabel = computed(() => getAvatarLabel(props.label));
</script>

<style scoped></style>

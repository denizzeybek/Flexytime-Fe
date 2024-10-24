<template>
  <template v-for="(model, idx) in navItems" :key="idx">
    <NavChildItem :model="model" />
  </template>
</template>

<script lang="ts" setup>
import NavChildItem from './NavChildItem.vue';
import type { IModel } from './NavChildItem.vue';

export interface IProps {
  navItems: IModel[];
}

defineProps<IProps>();

</script>

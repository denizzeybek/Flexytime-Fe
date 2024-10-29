<template>
  <!-- EMPTY LAYOUT -->
  <div class="container flex flex-col max-w-5xl min-h-screen px-3 py-6 mx-auto sm:px-6 sm:py-9">
    <!-- EMPTY LAYOUT HEADER -->
    <slot name="header" v-if="slots.header"></slot>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible">
      <template #container="{ closeCallback }">
        <Navbar @close="closeCallback" />
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'

const visible = defineModel<boolean>()
</script>

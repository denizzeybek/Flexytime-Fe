<template>
  <div>
    <div
      :class="{ bold: isFolder }"
      @click="toggle"
      @dblclick="changeType"
      :style="{ paddingLeft: `${indent}px` }"
    >
      <div class="border border-f-gray p-4 rounded-md flex items-center justify-between mb-5">
        <div class="flex items-center gap-2">
          <Button v-if="isFolder" :icon="iconClass" />
          <div class="text-md">
            {{ model.name }}
          </div>
        </div>
        <div class="flex gap-2">
          <Button severity="info" @click.stop="addChild">+</Button>
        </div>
      </div>
    </div>

    <div v-show="isOpen" v-if="isFolder">
      <TreeItem
        v-for="(childModel, index) in model.children"
        :key="index"
        :model="childModel"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const { model, depth = 0 } = defineProps({
  model: Object,
  depth: Number,
});

// State and Computed properties
const isOpen = ref(false);
const isFolder = computed(() => model.children && model.children.length);
const indent = computed(() => depth * 25); // Indent each level by 20px
const iconClass = computed(() => (isOpen.value ? 'pi pi-angle-down' : 'pi pi-angle-right'));

// Methods
const toggle = () => (isOpen.value = !isOpen.value);

const changeType = () => {
  if (!isFolder.value) {
    model.children = [];
    addChild();
    isOpen.value = true;
  }
};

const addChild = () => {
  // Check if children is already initialized
  if (!Array.isArray(model.children)) {
    model.children = [];
  }
  // Add a new child element
  model.children.push({ name: 'new item' });
  isOpen.value = true;
};
</script>

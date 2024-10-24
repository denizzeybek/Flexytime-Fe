<template>
  <div @click="toggle" @dblclick="changeType" :style="{ paddingLeft: `${indent}px` }">
    <div class="border border-f-gray p-4 rounded-md flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <Button v-show="isFolder" :icon="iconClass" unstyled></Button>
        <InputText
          v-if="isEditing"
          v-model="clonedModel.title"
          id="title"
          name="title"
          placeholder="Enter Name"
        />
        <div v-else class="text-md">
          {{ clonedModel?.title }}
        </div>
      </div>

      <template v-if="isEditing">
        <InputText
          v-if="isEditing"
          v-model="clonedModel.memberName"
          id="memberName"
          name="memberName"
          placeholder="Enter memberName"
        />
        <InputText
          v-if="isEditing"
          v-model="clonedModel.titleName"
          id="titleName"
          name="titleName"
          placeholder="Enter titleName"
        />
      </template>

      <template v-else>
        <div class="text-md">
          {{ clonedModel?.memberName }}
        </div>
        <div class="text-md">
          {{ clonedModel?.titleName }}
        </div>
      </template>
      <div class="flex gap-2">
        <template v-if="isEditing">
          <Button
            severity="secondary"
            size="small"
            @click.stop="completeEdit"
            icon="pi pi-check"
            outlined
          ></Button>
          <Button
            severity="secondary"
            size="small"
            @click.stop="cancelEdit"
            icon="pi pi-times"
            outlined
          ></Button>
        </template>
        <template v-else>
          <Button severity="primary" size="small" @click.stop="addChild" icon="pi pi-plus"></Button>
          <Button
            severity="info"
            size="small"
            @click.stop="isEditing = true"
            icon="pi pi-pencil"
          ></Button>
          <Button
            severity="danger"
            size="small"
            @click.stop="handleRemove"
            icon="pi pi-trash"
          ></Button>
        </template>
      </div>
    </div>
  </div>

  <div v-show="isOpen" v-if="isFolder">
    <OrganizationItem
      v-for="(childModel, index) in clonedModel.children"
      :key="index"
      :model="childModel"
      :depth="depth + 1"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const { model, depth = 0 } = defineProps({
  model: Object,
  depth: Number,
});

// State and Computed properties

const clonedModel = ref();
const initialClonedModel = ref();
const isEditing = ref(false);

const isOpen = ref(false);
const isFolder = computed(() => model?.children && model?.children?.length);
const indent = computed(() => depth * 25);
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
  if (!Array.isArray(model?.children)) {
    model.children = [];
  }
  // Add a new child element
  model?.children?.push({ title: 'new item' });
  isOpen.value = true;
};

const completeEdit = () => {
  isEditing.value = false;
};

const cancelEdit = () => {
  clonedModel.value = initialClonedModel.value;
  isEditing.value = false;
};

const handleRemove = () => {
  // Remove the current item
};

watch(
  () => model,
  () => {
    if (model) {
      initialClonedModel.value = JSON.parse(JSON.stringify(model));
      clonedModel.value = model;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div @click="toggle" @dblclick="changeType" :style="{ paddingLeft: `${indent}px` }">
    <div class="border border-f-gray p-4 rounded-md flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <Button v-show="isFolder" :icon="iconClass" unstyled></Button>
        <FAvatar :label="clonedModel.title" />
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
          v-model="clonedModel.MemberName"
          id="MemberName"
          name="MemberName"
          placeholder="Enter MemberName"
        />
        <InputText
          v-if="isEditing"
          v-model="clonedModel.TitleName"
          id="TitleName"
          name="TitleName"
          placeholder="Enter TitleName"
        />
      </template>

      <template v-else>
        <div class="text-md">
          {{ clonedModel?.MemberName }}
        </div>
        <div class="text-md">
          {{ clonedModel?.TitleName }}
        </div>
      </template>
      <div class="flex gap-2">
        <template v-if="isEditing">
          <Button
            severity="secondary"
            size="small"
            @click="completeEdit"
            icon="pi pi-check"
            outlined
          ></Button>
          <Button
            severity="secondary"
            size="small"
            @click="cancelEdit"
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
      @itemChange="emit('itemChange', clonedModel)"
      @itemRemove="emit('itemRemove', clonedModel.ID)"
    />
  </div>
</template>

<script setup lang="ts">
import type { IOrganizationChartNodes } from '@/interfaces/company/organizationChart';
import { computed, ref, watch } from 'vue';

interface IProps {
  model: IOrganizationChartNodes;
  depth?: number;
}

const { model, depth = 0 } = defineProps<IProps>();

interface IEmits {
  (event: 'itemChange', value: IOrganizationChartNodes): void;
  (event: 'itemRemove', ID: string): void;
}
const emit = defineEmits<IEmits>();

const clonedModel = ref();
const initialClonedModel = ref();
const isEditing = ref(false);
const isOpen = ref(false);

const isFolder = computed(() => model?.children && model?.children?.length);
const indent = computed(() => depth * 15);
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
  model?.children?.push({
    children: [],
    title: 'Title',
    Name: 'Accounting Department',
    ID: '629176fc571d4g9a082d5175',
    TitleName: 'Accounting Manager',
    MemberName: 'Member Name',
  });
  isOpen.value = true;
};

const completeEdit = () => {
  isEditing.value = false;
  emit('itemChange', clonedModel.value);
};

const cancelEdit = () => {
  clonedModel.value = initialClonedModel.value;
  isEditing.value = false;
};

const handleRemove = () => {
  emit('itemRemove', (clonedModel as any).ID);
};

watch(
  () => model,
  () => {
    if (model) {
      initialClonedModel.value = JSON.parse(JSON.stringify(model)) as IOrganizationChartNodes;
      clonedModel.value = model as IOrganizationChartNodes;
    }
  },
  { immediate: true },
);
</script>

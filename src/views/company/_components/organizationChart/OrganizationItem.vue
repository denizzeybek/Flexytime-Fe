<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div :style="{ paddingLeft: `${indent}px` }" @click="toggle" @dblclick="changeType">
    <div class="border border-f-gray p-4 rounded-md flex justify-between items-center flex-col lg:flex-row gap-8 mb-5">
      <div class="w-full flex justify-between lg:pr-48 gap-4">
        <div class="flex items-center gap-2">
          <Button v-show="isFolder" :icon="iconClass" unstyled class="flex items-center"/>
          <FAvatar :label="clonedModel.title" />
          <InputText
            v-if="isEditing"
            id="title"
            v-model="clonedModel.title"
            name="title"
            :placeholder="t('pages.company.organizationItem.title.placeholder')"
          />
          <div v-else class="text-md">
            {{ clonedModel?.title }}
          </div>
        </div>
        <template v-if="isEditing">
          <InputText
            v-if="isEditing"
            id="MemberName"
            v-model="clonedModel.MemberName"
            name="MemberName"
            :placeholder="t('pages.company.organizationItem.memberName.placeholder')"
          />
          <InputText
            v-if="isEditing"
            id="TitleName"
            v-model="clonedModel.TitleName"
            name="TitleName"
            :placeholder="t('pages.company.organizationItem.titleName.placeholder')"
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
      </div>
      <div class="flex gap-2">
        <template v-if="isEditing">
          <Button
            severity="secondary"
            size="small"
            icon="pi pi-check"
            outlined
            @click="completeEdit"
          ></Button>
          <Button
            severity="secondary"
            size="small"
            icon="pi pi-times"
            outlined
            @click="cancelEdit"
          ></Button>
        </template>
        <template v-else>
          <Button severity="primary" size="small" icon="pi pi-plus" @click.stop="addChild"></Button>
          <Button
            severity="info"
            size="small"
            icon="pi pi-pencil"
            @click.stop="isEditing = true"
          ></Button>
          <Button
            severity="danger"
            size="small"
            icon="pi pi-trash"
            @click.stop="handleRemove"
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
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { OrganizationNodeViewModel } from '@/client';

interface IProps {
  model: OrganizationNodeViewModel;
  depth?: number;
}

interface IEmits {
  (event: 'itemChange', value: OrganizationNodeViewModel): void;
  (event: 'itemRemove', ID: string): void;
}

const { model, depth = 0 } = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

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
    // eslint-disable-next-line vue/no-mutating-props
    model.children = [];
    addChild();
    isOpen.value = true;
  }
};

const addChild = () => {
  // Check if children is already initialized
  if (!Array.isArray(model?.children)) {
    // eslint-disable-next-line vue/no-mutating-props
    model.children = [];
  }
  // Add a new child element
  // eslint-disable-next-line vue/no-mutating-props
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
      initialClonedModel.value = JSON.parse(JSON.stringify(model)) as OrganizationNodeViewModel;
      clonedModel.value = model as OrganizationNodeViewModel;
    }
  },
  { immediate: true },
);
</script>

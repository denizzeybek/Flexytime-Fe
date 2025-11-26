<template>
  <Dialog
    :visible="visible"
    :header="dialogTitle"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="w-full max-w-2xl"
    @update:visible="handleClose"
  >
    <div class="space-y-4">
      <!-- Team/Title Name -->
      <div class="flex flex-col gap-2">
        <label for="node-title" class="font-semibold text-gray-700">
          {{ t('pages.company.organizationChartV2.editDialog.fields.title.label') }}
          <span class="text-red-500">*</span>
        </label>
        <InputText
          id="node-title"
          v-model="formData.title"
          :placeholder="t('pages.company.organizationChartV2.editDialog.fields.title.placeholder')"
          :class="{ 'p-invalid': errors.title }"
          @blur="validateTitle"
        />
        <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
      </div>

      <!-- Team Name (Name field) -->
      <div class="flex flex-col gap-2">
        <label for="node-name" class="font-semibold text-gray-700">
          {{ t('pages.company.organizationChartV2.editDialog.fields.name.label') }}
        </label>
        <InputText
          id="node-name"
          v-model="formData.Name"
          :placeholder="t('pages.company.organizationChartV2.editDialog.fields.name.placeholder')"
        />
        <small class="text-gray-500">{{ t('pages.company.organizationChartV2.editDialog.fields.name.hint') }}</small>
      </div>

      <!-- Member Name -->
      <div class="flex flex-col gap-2">
        <label for="node-member" class="font-semibold text-gray-700">
          {{ t('pages.company.organizationChartV2.editDialog.fields.memberName.label') }}
        </label>
        <InputText
          id="node-member"
          v-model="formData.MemberName"
          :placeholder="t('pages.company.organizationChartV2.editDialog.fields.memberName.placeholder')"
        />
        <small class="text-gray-500">{{ t('pages.company.organizationChartV2.editDialog.fields.memberName.hint') }}</small>
      </div>

      <!-- Title Name (Job Title) -->
      <div class="flex flex-col gap-2">
        <label for="node-title-name" class="font-semibold text-gray-700">
          {{ t('pages.company.organizationChartV2.editDialog.fields.titleName.label') }}
        </label>
        <InputText
          id="node-title-name"
          v-model="formData.TitleName"
          :placeholder="t('pages.company.organizationChartV2.editDialog.fields.titleName.placeholder')"
        />
        <small class="text-gray-500">{{ t('pages.company.organizationChartV2.editDialog.fields.titleName.hint') }}</small>
      </div>

      <!-- Abbreviation -->
      <div class="flex flex-col gap-2">
        <label for="node-abbreviation" class="font-semibold text-gray-700">
          {{ t('pages.company.organizationChartV2.editDialog.fields.abbreviation.label') }}
        </label>
        <InputText
          id="node-abbreviation"
          v-model="formData.Abbreviation"
          :placeholder="t('pages.company.organizationChartV2.editDialog.fields.abbreviation.placeholder')"
          maxlength="10"
        />
        <small class="text-gray-500">{{ t('pages.company.organizationChartV2.editDialog.fields.abbreviation.hint') }}</small>
      </div>

      <!-- Additional Info Panel -->
      <div v-if="mode === 'edit' && node?.ID" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="text-sm text-gray-600">
          <div class="flex justify-between py-1">
            <span class="font-medium">{{ t('pages.company.organizationChartV2.editDialog.info.nodeId') }}:</span>
            <span class="font-mono text-xs">{{ node.ID }}</span>
          </div>
          <div v-if="node.TeamId" class="flex justify-between py-1">
            <span class="font-medium">{{ t('pages.company.organizationChartV2.editDialog.info.teamId') }}:</span>
            <span class="font-mono text-xs">{{ node.TeamId }}</span>
          </div>
          <div v-if="node.MemberId" class="flex justify-between py-1">
            <span class="font-medium">{{ t('pages.company.organizationChartV2.editDialog.info.memberId') }}:</span>
            <span class="font-mono text-xs">{{ node.MemberId }}</span>
          </div>
          <div v-if="node.TitleId" class="flex justify-between py-1">
            <span class="font-medium">{{ t('pages.company.organizationChartV2.editDialog.info.titleId') }}:</span>
            <span class="font-mono text-xs">{{ node.TitleId }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          :label="t('pages.company.organizationChartV2.editDialog.buttons.cancel')"
          severity="secondary"
          outlined
          @click="handleClose"
        />
        <Button
          :label="t('pages.company.organizationChartV2.editDialog.buttons.save')"
          icon="pi pi-check"
          :disabled="!isFormValid"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { OrganizationNodeViewModel } from '@/client';

interface IProps {
  visible: boolean;
  node: OrganizationNodeViewModel | null;
  mode: 'add' | 'edit';
}

interface IEmits {
  (event: 'update:visible', value: boolean): void;
  (event: 'save', node: OrganizationNodeViewModel): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const formData = ref<OrganizationNodeViewModel>({
  children: [],
  title: '',
  Name: '',
  MemberName: '',
  TitleName: '',
  Abbreviation: '',
});

const errors = ref({
  title: '',
});

const dialogTitle = computed(() => {
  return props.mode === 'add'
    ? t('pages.company.organizationChartV2.editDialog.titleAdd')
    : t('pages.company.organizationChartV2.editDialog.titleEdit');
});

const isFormValid = computed(() => {
  return !!(formData.value.title?.trim() && !errors.value.title);
});

const validateTitle = () => {
  if (!formData.value.title?.trim()) {
    errors.value.title = t('pages.company.organizationChartV2.editDialog.validation.titleRequired');
  } else if (formData.value.title.trim().length < 2) {
    errors.value.title = t('pages.company.organizationChartV2.editDialog.validation.titleMinLength');
  } else {
    errors.value.title = '';
  }
};

const handleSave = () => {
  validateTitle();

  if (isFormValid.value) {
    // Clean up the data
    const nodeToSave: OrganizationNodeViewModel = {
      ...formData.value,
      title: formData.value.title?.trim(),
      Name: formData.value.Name?.trim(),
      MemberName: formData.value.MemberName?.trim(),
      TitleName: formData.value.TitleName?.trim(),
      Abbreviation: formData.value.Abbreviation?.trim(),
    };

    emit('save', nodeToSave);
    handleClose();
  }
};

const handleClose = () => {
  emit('update:visible', false);
  // Reset errors
  errors.value = {
    title: '',
  };
};

watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      formData.value = {
        ...newNode,
        children: newNode.children || [],
      };
    } else {
      formData.value = {
        children: [],
        title: '',
        Name: '',
        MemberName: '',
        TitleName: '',
        Abbreviation: '',
      };
    }
    // Reset errors when node changes
    errors.value = {
      title: '',
    };
  },
  { immediate: true, deep: true },
);
</script>

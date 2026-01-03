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
    <form class="space-y-4" @submit.prevent="handleSave">
      <!-- Team/Title Name -->
      <FInput
        id="node-title"
        name="title"
        :label="t('pages.company.organizationChartV2.editDialog.fields.title.label') + ' *'"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.title.placeholder')"
      />

      <!-- Team Name (Name field) -->
      <FInput
        id="node-name"
        name="name"
        :label="t('pages.company.organizationChartV2.editDialog.fields.name.label')"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.name.placeholder')"
      />

      <!-- Member Name -->
      <FSelect
        name="member"
        :label="t('pages.company.organizationChartV2.editDialog.fields.memberName.label')"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.memberName.placeholder')"
        :options="memberOptions"
        :prime-props="{
          filter: true,
          showClear: true,
        }"
      />

      <!-- Title Name (Job Title) -->
      <FSelect
        name="jobTitle"
        :label="t('pages.company.organizationChartV2.editDialog.fields.titleName.label')"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.titleName.placeholder')"
        :options="titleOptions"
        :prime-props="{
          filter: true,
          showClear: true,
        }"
      />

      <!-- Abbreviation -->
      <FInput
        id="node-abbreviation"
        name="abbreviation"
        :label="t('pages.company.organizationChartV2.editDialog.fields.abbreviation.label')"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.abbreviation.placeholder')"
        :prime-props="{ maxlength: 10 }"
      />
    </form>

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
          :disabled="!meta.valid"
          @click="handleSave"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';

import type { OrganizationNodeViewModel } from '@/client';
import type { IOption } from '@/common/interfaces/option.interface';

interface IProps {
  visible: boolean;
  node: OrganizationNodeViewModel | null;
  mode: 'add' | 'edit';
}

interface IEmits {
  (event: 'update:visible', value: boolean): void;
  (event: 'save', node: OrganizationNodeViewModel): void;
}

interface IFormValues {
  title: string;
  name: string;
  member: IOption | null;
  jobTitle: IOption | null;
  abbreviation: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const organizationsStore = useCompanyOrganizationChartsStore();

const validationSchema = yup.object({
  title: yup
    .string()
    .required(t('pages.company.organizationChartV2.editDialog.validation.titleRequired'))
    .min(2, t('pages.company.organizationChartV2.editDialog.validation.titleMinLength')),
  name: yup.string(),
  member: yup.object().nullable(),
  jobTitle: yup.object().nullable(),
  abbreviation: yup.string().max(10),
});

const { meta, values, setValues, resetForm } = useForm<IFormValues>({
  validationSchema,
  initialValues: {
    title: '',
    name: '',
    member: null,
    jobTitle: null,
    abbreviation: '',
  },
});

const memberOptions = computed<IOption[]>(() => {
  return organizationsStore.members.map((m) => ({
    name: m.Name || '',
    value: m.ID || '',
    label: m.Name || '',
  }));
});

const titleOptions = computed<IOption[]>(() => {
  return organizationsStore.titles.map((item) => ({
    name: item.Name || '',
    value: item.ID || '',
    label: item.Name || '',
  }));
});

const dialogTitle = computed(() => {
  return props.mode === 'add'
    ? t('pages.company.organizationChartV2.editDialog.titleAdd')
    : t('pages.company.organizationChartV2.editDialog.titleEdit');
});

const handleSave = () => {
  if (!meta.value.valid) return;

  const nodeToSave: OrganizationNodeViewModel = {
    ...props.node,
    title: values.title?.trim(),
    Name: values.name?.trim(),
    MemberId: values.member?.value || undefined,
    MemberName: values.member?.name || '',
    TitleId: values.jobTitle?.value || undefined,
    TitleName: values.jobTitle?.name || '',
    Abbreviation: values.abbreviation?.trim(),
    children: props.node?.children || [],
  };

  emit('save', nodeToSave);
  handleClose();
};

const handleClose = () => {
  emit('update:visible', false);
  resetForm();
};

watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      // Find matching member and title options
      let memberOption: IOption | null = null;
      let jobTitleOption: IOption | null = null;

      if (newNode.MemberId) {
        memberOption = memberOptions.value.find((m) => m.value === newNode.MemberId) || null;
      } else if (newNode.MemberName) {
        memberOption = memberOptions.value.find((m) => m.name === newNode.MemberName) || null;
      }

      if (newNode.TitleId) {
        jobTitleOption = titleOptions.value.find((t) => t.value === newNode.TitleId) || null;
      } else if (newNode.TitleName) {
        jobTitleOption = titleOptions.value.find((t) => t.name === newNode.TitleName) || null;
      }

      setValues({
        title: newNode.title || '',
        name: newNode.Name || '',
        member: memberOption,
        jobTitle: jobTitleOption,
        abbreviation: newNode.Abbreviation || '',
      });
    } else {
      resetForm();
    }
  },
  { immediate: true, deep: true },
);
</script>

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
      <FInput
        id="node-name"
        name="name"
        :label="t('pages.company.organizationChartV2.editDialog.fields.name.label') + ' *'"
        :placeholder="t('pages.company.organizationChartV2.editDialog.fields.name.placeholder')"
      />

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
    </form>

    <template #footer>
      <FModalFooter>
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
      </FModalFooter>
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
  name: string;
  member: IOption | null;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const organizationsStore = useCompanyOrganizationChartsStore();

const validationSchema = yup.object({
  name: yup
    .string()
    .required(t('pages.company.organizationChartV2.editDialog.validation.titleRequired'))
    .min(2, t('pages.company.organizationChartV2.editDialog.validation.titleMinLength')),
  member: yup.object().nullable(),
});

const { meta, values, setValues, resetForm } = useForm<IFormValues>({
  validationSchema,
  initialValues: {
    name: '',
    member: null,
  },
});

const memberOptions = computed<IOption[]>(() => {
  return organizationsStore.members.map((m) => ({
    name: m.Name || '',
    value: m.ID || '',
    label: m.Name || '',
  }));
});

const dialogTitle = computed(() => {
  return props.mode === 'add'
    ? t('pages.company.organizationChartV2.editDialog.titleAdd')
    : t('pages.company.organizationChartV2.editDialog.titleEdit');
});

const handleSave = () => {
  if (!meta.value.valid) return;

  const teamName = values.name?.trim() ?? '';

  const nodeToSave: OrganizationNodeViewModel = {
    ...props.node,
    Name: teamName,
    title: teamName,
    MemberId: values.member?.value || undefined,
    MemberName: values.member?.name || null,
    TitleId: undefined,
    TitleName: '',
    Abbreviation: '',
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
      let memberOption: IOption | null = null;

      if (newNode.MemberId) {
        memberOption = memberOptions.value.find((m) => m.value === newNode.MemberId) || null;
      } else if (newNode.MemberName) {
        memberOption = memberOptions.value.find((m) => m.name === newNode.MemberName) || null;
      }

      setValues({
        name: newNode.Name || newNode.title || '',
        member: memberOption,
      });
    } else {
      resetForm();
    }
  },
  { immediate: true, deep: true },
);
</script>

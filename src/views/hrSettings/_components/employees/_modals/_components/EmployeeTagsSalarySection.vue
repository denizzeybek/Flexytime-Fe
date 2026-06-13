<template>
  <div class="flex items-center gap-4 flex-1">
    <FMultiSelect
      v-if="showTags"
      name="tags"
      class="grow"
      :placeholder="t('pages.hrSettings.employees.modal.tags.placeholder')"
      :label="t('pages.hrSettings.employees.modal.tags.label')"
      :options="tagOptions"
      :header-add-btn="true"
      :prime-props="{
        maxSelectedLabels: 3,
      }"
      @add-list="handleAddTag"
    />
    <FInput
      id="salary"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.salary.label')"
      :placeholder="t('pages.hrSettings.employees.modal.salary.placeholder')"
      name="salary"
      :prime-props="{ autocomplete: 'off' }"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useField } from 'vee-validate';

import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';

interface ISelectOption {
  name: string | undefined;
  value: string | undefined;
}

interface IProps {
  tagOptions: ISelectOption[];
  showTags?: boolean;
}

withDefaults(defineProps<IProps>(), {
  showTags: true,
});

const { t } = useI18n<{ message: MessageSchema }>();
const employeesStore = useHRSettingsEmployeesStore();

const { value: selectedTags } = useField<ISelectOption[]>('tags');

const handleAddTag = (name: string) => {
  const option = employeesStore.addPendingTag(name);
  if (!option.name) return;
  const current = selectedTags.value ?? [];
  if (current.some((t) => (t.name ?? '').toLowerCase() === option.name.toLowerCase())) {
    return;
  }
  selectedTags.value = [...current, option];
};
</script>

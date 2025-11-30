<template>
  <div class="flex items-center gap-4 flex-1">
    <FMultiSelect
      v-if="showTags"
      name="tags"
      class="grow"
      :placeholder="t('pages.hrSettings.employees.modal.tags.placeholder')"
      :label="t('pages.hrSettings.employees.modal.tags.label')"
      :options="tagOptions"
      :header-add-btn="false"
      :prime-props="{
        maxSelectedLabels: 3,
      }"
    />
    <FInput
      id="salary"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.salary.label')"
      name="salary"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

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
</script>

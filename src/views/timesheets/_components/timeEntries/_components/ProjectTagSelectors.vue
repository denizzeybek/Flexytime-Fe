<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <div class="flex-1">
      <FSelect
        name="project"
        :placeholder="t('pages.timesheets.enterTime.project.placeholder')"
        :options="projectOptions"
        :header-add-btn="true"
        :prime-props="{
          filter: true,
        }"
      />
    </div>
    <div class="flex-1">
      <FMultiSelect
        name="tags"
        :placeholder="t('pages.timesheets.enterTime.tags.placeholder')"
        :options="tagOptions"
        :header-add-btn="true"
        :prime-props="{
          maxSelectedLabels: 3,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface ISelectOption {
  name: string;
  value: string;
}

interface IProps {
  projectOptions: ISelectOption[];
  tagOptions: ISelectOption[];
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

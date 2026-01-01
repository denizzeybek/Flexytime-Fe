<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <FInput
        id="memberName"
        class="flex-1"
        :label="t('pages.hrSettings.employees.modal.memberName.label')"
        name="memberName"
      />
      <FInput
        id="email"
        class="flex-1"
        type="email"
        :label="t('pages.hrSettings.employees.modal.email.label')"
        name="email"
      />
    </div>
    <FCheckbox
      v-if="showEnabled"
      name="enabled"
      label-left
      :label="t('pages.hrSettings.employees.modal.enabled.label')"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  showEnabled?: boolean;
}

withDefaults(defineProps<IProps>(), {
  showEnabled: false,
});

const { t } = useI18n<{ message: MessageSchema }>();
</script>

<template>
  <div class="flex items-center flex-col lg:flex-row gap-12">
    <div class="flex lg:flex-col flex-1 gap-4">
      <FInput
        id="memberName"
        class="grow"
        :label="t('pages.hrSettings.employees.modal.memberName.label')"
        name="memberName"
      />
      <FInput
        id="email"
        class="grow"
        type="email"
        :label="t('pages.hrSettings.employees.modal.email.label')"
        name="email"
      />
      <FCheckbox
        v-if="showEnabled"
        name="enabled"
        label-left
        :label="t('pages.hrSettings.employees.modal.enabled.label')"
      />
    </div>
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

<template>
  <div class="flex gap-4 flex-1">
    <FPassword
      id="password"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.password.label')"
      name="password"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
</script>

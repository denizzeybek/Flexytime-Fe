<template>
  <div class="flex gap-4 flex-1">
    <FPassword
      id="password"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.password.label')"
      :placeholder="passwordPlaceholder"
      name="password"
      :prime-props="{ autocomplete: 'new-password' }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IProps {
  /** When true, the placeholder reminds the operator that blank = keep the existing hash. */
  isEdit?: boolean;
}

const props = withDefaults(defineProps<IProps>(), { isEdit: false });

const { t } = useI18n<{ message: MessageSchema }>();

const passwordPlaceholder = computed(() =>
  props.isEdit
    ? t('pages.hrSettings.employees.modal.password.placeholderEdit')
    : t('pages.hrSettings.employees.modal.password.placeholder'),
);
</script>

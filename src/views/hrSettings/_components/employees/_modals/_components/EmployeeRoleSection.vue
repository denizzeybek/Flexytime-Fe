<template>
  <div class="flex gap-4 flex-1">
    <FSelect
      id="title"
      class="grow"
      name="title"
      :label="t('pages.hrSettings.employees.modal.title.label')"
      :placeholder="t('pages.hrSettings.employees.modal.title.placeholder')"
      :options="titleOptions"
    />
    <FSelect
      id="team"
      class="grow"
      name="team"
      :label="t('pages.hrSettings.employees.modal.team.label')"
      :placeholder="t('pages.hrSettings.employees.modal.team.placeholder')"
      :options="teamOptions"
    />
    <FInput
      v-if="showOperatingUser"
      id="operatingUser"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.operatingUser.label')"
      name="operatingUser"
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
  titleOptions: ISelectOption[];
  teamOptions: ISelectOption[];
  showOperatingUser?: boolean;
}

withDefaults(defineProps<IProps>(), {
  showOperatingUser: false,
});

const { t } = useI18n<{ message: MessageSchema }>();
</script>

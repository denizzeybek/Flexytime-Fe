<template>
  <FSelect
    name="role"
    :label="t('pages.hrSettings.employees.modal.role.label')"
    :placeholder="t('pages.hrSettings.employees.modal.role.placeholder')"
    :options="roleOptions"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

interface IRoleOption {
  name: string;
  value: number;
  icon: string;
}

interface IProps {
  modelValue: IRoleOption;
}

interface IEmits {
  (e: 'update:modelValue', value: IRoleOption): void;
}

defineProps<IProps>();
defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();

const roleOptions = computed<IRoleOption[]>(() => [
  {
    name: t('pages.hrSettings.employees.modal.tab.employee'),
    value: 0,
    icon: 'pi pi-user',
  },
  {
    name: t('pages.hrSettings.employees.modal.tab.teamManager'),
    value: 1,
    icon: 'pi pi-users',
  },
  {
    name: t('pages.hrSettings.employees.modal.tab.systemAdmin'),
    value: 2,
    icon: 'pi pi-shield',
  },
]);
</script>

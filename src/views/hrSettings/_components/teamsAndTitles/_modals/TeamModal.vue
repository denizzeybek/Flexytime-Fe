<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.hrSettings.teamsAndTitles.teams.modal.edit') : t('pages.hrSettings.teamsAndTitles.teams.modal.add')"
    class="lg:!w-[500px] !w-full"
    :style="{ width: '30rem' }"
  >
    <form v-if="open" class="flex flex-col gap-4" @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <label for="teamName">{{ t('pages.hrSettings.teamsAndTitles.teams.form.name') }}</label>
        <InputText
          id="teamName"
          v-model="name"
          v-bind="nameAttrs"
          :placeholder="t('pages.hrSettings.teamsAndTitles.teams.form.namePlaceholder')"
          :invalid="!!errors.name"
        />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <FSelect
        v-if="isEditing"
        id="manager"
        name="manager"
        :label="t('pages.hrSettings.teamsAndTitles.teams.form.manager')"
        :placeholder="t('pages.hrSettings.teamsAndTitles.teams.form.managerPlaceholder')"
        :options="managerOptions"
        :prime-props="{
          filter: true,
          showClear: true,
        }"
      />

      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          @click="open = false"
        />
        <Button
          type="submit"
          :label="t('common.buttons.save')"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';

import type { TeamListItem } from '@/stores/hrSettings/teams';

interface IProps {
  data?: TeamListItem;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback();
const teamsStore = useHRSettingsTeamsStore();
const employeesStore = useHRSettingsEmployeesStore();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

// Get all employees as potential managers (excluding System Admins - Role 2)
const managerOptions = computed(() => {
  return employeesStore.list
    .filter((emp) => emp.Role !== 2) // Exclude System Admins
    .map((emp) => ({
      name: emp.MemberName ?? '',
      value: emp.ID ?? '',
    }));
});

// Get initial manager option for the dropdown
const getInitialManagerOption = () => {
  if (!props.data?.Manager) return undefined;
  return {
    name: props.data.Manager.Name,
    value: props.data.Manager.ID,
  };
};

const schema = toTypedSchema(
  yup.object({
    name: yup.string().required(t('validation.required')),
    manager: yup.object().nullable(),
  }),
);

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.data?.Name || '',
    manager: getInitialManagerOption(),
  },
});

const [name, nameAttrs] = defineField('name');
const [, managerAttrs] = defineField('manager');

// Suppress unused variable warning
void nameAttrs;
void managerAttrs;

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ID: props.data?.ID,
    Name: values.name,
  };

  await executeWithFeedback(async () => {
    // Save team first
    await teamsStore.saveTeam(payload);

    // If editing and manager changed, assign new manager
    if (isEditing.value && props.data?.ID) {
      const currentManagerId = props.data?.Manager?.ID || null;
      const newManagerId = (values.manager as { value?: string } | null)?.value || null;

      if (currentManagerId !== newManagerId) {
        await teamsStore.assignManager(props.data.ID, newManagerId);
      }
    }
  }, isEditing.value
    ? t('pages.hrSettings.teamsAndTitles.teams.messages.updated')
    : t('pages.hrSettings.teamsAndTitles.teams.messages.created'));

  open.value = false;
});

onMounted(async () => {
  // Ensure employees are loaded for manager dropdown
  if (employeesStore.list.length === 0) {
    await employeesStore.filter();
  }
});
</script>

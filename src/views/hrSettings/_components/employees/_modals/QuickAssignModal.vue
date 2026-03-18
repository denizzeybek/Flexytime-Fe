<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="t('pages.hrSettings.employees.quickAssign.title')"
    class="lg:!w-[500px] !w-full"
    :style="{ width: '30rem' }"
  >
    <form v-if="open" class="flex flex-col gap-4" @submit="onSubmit">
      <div class="flex flex-col gap-2">
        <label class="font-medium text-content-secondary">
          {{ t('pages.hrSettings.employees.quickAssign.employee') }}
        </label>
        <div class="flex items-center gap-3 p-3 bg-surface-secondary dark:bg-surface-tertiary rounded-lg">
          <FAvatar :label="props.employee?.MemberName" />
          <FText class="font-medium">{{ props.employee?.MemberName }}</FText>
        </div>
      </div>

      <FSelect
        id="team"
        name="team"
        :label="t('pages.hrSettings.employees.modal.team.label')"
        :placeholder="t('pages.hrSettings.employees.modal.team.placeholder')"
        :options="teamOptions"
        :header-add-btn="true"
        :prime-props="{
          filter: true,
        }"
        @add-list="handleAddTeam"
      />

      <FSelect
        id="title"
        name="title"
        :label="t('pages.hrSettings.employees.modal.title.label')"
        :placeholder="t('pages.hrSettings.employees.modal.title.placeholder')"
        :options="titleOptions"
        :header-add-btn="true"
        :prime-props="{
          filter: true,
        }"
        @add-list="handleAddTitle"
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

import { useFToast } from '@/composables/useFToast';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';
import { useHRSettingsTitlesStore } from '@/stores/hrSettings/titles';

import type { TheMemberViewModel } from '@/client';

interface IProps {
  employee?: TheMemberViewModel;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const { executeWithFeedback } = useOperationFeedback();
const employeesStore = useHRSettingsEmployeesStore();
const titlesStore = useHRSettingsTitlesStore();
const teamsStore = useHRSettingsTeamsStore();

const open = defineModel<boolean>('open');

// Get initial team option for the dropdown
const getInitialTeamOption = () => {
  if (!props.employee?.TeamId) return undefined;
  return {
    name: props.employee.TeamName ?? '',
    value: props.employee.TeamId,
  };
};

// Get initial title option for the dropdown
const getInitialTitleOption = () => {
  if (!props.employee?.TitleId) return undefined;
  return {
    name: props.employee.TitleName ?? '',
    value: props.employee.TitleId,
  };
};

const schema = toTypedSchema(
  yup.object({
    team: yup.object().required(t('common.validation.mixed.required', { field: t('common.validation.fields.team') })),
    title: yup.object().required(t('common.validation.mixed.required', { field: t('common.validation.fields.title') })),
  }),
);

const { defineField, handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    team: getInitialTeamOption(),
    title: getInitialTitleOption(),
  },
});

const [, teamAttrs] = defineField('team');
const [, titleAttrs] = defineField('title');

// Suppress unused variable warnings
void teamAttrs;
void titleAttrs;
void errors;

const titleOptions = computed(() => {
  return titlesStore.list.map((title) => ({
    name: title.Name ?? '',
    value: title.ID ?? '',
  }));
});

const teamOptions = computed(() => {
  return teamsStore.list.map((team) => ({
    name: team.Name ?? '',
    value: team.ID ?? '',
  }));
});

const handleAddTitle = async (name: string) => {
  try {
    await titlesStore.saveTitle({ Name: name });
    showSuccessMessage(t('pages.hrSettings.teamsAndTitles.titles.messages.created'));
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const handleAddTeam = async (name: string) => {
  try {
    await teamsStore.saveTeam({ Name: name });
    showSuccessMessage(t('pages.hrSettings.teamsAndTitles.teams.messages.created'));
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const onSubmit = handleSubmit(async (values) => {
  if (!props.employee?.ID) return;

  const teamId = (values.team as { value?: string } | null)?.value;
  const titleId = (values.title as { value?: string } | null)?.value;

  if (!teamId || !titleId) return;

  await executeWithFeedback(
    () => employeesStore.quickAssign(props.employee!.ID!, teamId, titleId),
    t('pages.hrSettings.employees.quickAssign.success'),
  );

  open.value = false;
});

onMounted(async () => {
  if (titlesStore.list.length === 0) {
    await titlesStore.fetchTitles();
  }
  if (teamsStore.list.length === 0) {
    await teamsStore.fetchTeams();
  }
});
</script>

<template>
  <div class="flex gap-4 flex-1">
    <FSelect
      id="title"
      class="grow"
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
    <FSelect
      id="team"
      class="grow"
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
    <FInput
      v-if="showOperatingUser"
      id="operatingUser"
      class="grow"
      :label="t('pages.hrSettings.employees.modal.operatingUser.label')"
      :placeholder="t('pages.hrSettings.employees.modal.operatingUser.placeholder')"
      name="operatingUser"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';
import { useHRSettingsTitlesStore } from '@/stores/hrSettings/titles';

interface IProps {
  showOperatingUser?: boolean;
}

withDefaults(defineProps<IProps>(), {
  showOperatingUser: false,
});

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const titlesStore = useHRSettingsTitlesStore();
const teamsStore = useHRSettingsTeamsStore();

const { list: titles } = storeToRefs(titlesStore);
const { list: teams } = storeToRefs(teamsStore);

const titleOptions = computed(() =>
  titles.value.map((title) => ({
    name: title.Name ?? '',
    value: title.ID ?? '',
  })),
);

const teamOptions = computed(() =>
  teams.value.map((team) => ({
    name: team.Name ?? '',
    value: team.ID ?? '',
  })),
);

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
</script>

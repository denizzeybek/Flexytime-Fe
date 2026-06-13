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
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/Employees';
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
const employeesStore = useHRSettingsEmployeesStore();
const titlesStore = useHRSettingsTitlesStore();
const teamsStore = useHRSettingsTeamsStore();

/**
 * Two data sources can populate these dropdowns:
 *   (1) The dedicated `titlesStore.list` / `teamsStore.list` — fetched
 *       eagerly on Employees-page mount via `/webapi/company/titles` and
 *       `/webapi/company/teams`. Used by every CRUD screen for these
 *       entities.
 *   (2) The bundled lookups inside `definitionControllerEmployees()` —
 *       already populated on Employees-page mount because the table is
 *       built from the same response. Lives on
 *       `employeesStore.{employeeTitles,managerTitles,teams}`.
 *
 * We prefer (1) when it's hydrated (matches Add-Title / Add-Team
 * round-trips), and fall back to (2) so the dropdowns are never empty
 * on first paint even if (1) is still in flight. The maps land on the
 * same `{name, value}` shape `FSelect` consumes regardless.
 */
const titleOptions = computed(() => {
  const primary = titlesStore.list;
  if (primary.length > 0) {
    return primary.map((title) => ({
      name: title.Name ?? '',
      value: title.ID ?? '',
    }));
  }
  // Fallback: titles bundled into the employees() response carry the
  // same {ID, Name} shape (DefinitionMemberViewModel) — merge
  // employee + manager title pools, dedup by ID.
  const seen = new Set<string>();
  const fallback: Array<{ name: string; value: string }> = [];
  for (const t of [...employeesStore.employeeTitles, ...employeesStore.managerTitles]) {
    const id = t.ID ?? '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    fallback.push({ name: t.Name ?? '', value: id });
  }
  return fallback;
});

const teamOptions = computed(() => {
  const primary = teamsStore.list;
  if (primary.length > 0) {
    return primary.map((team) => ({
      name: team.Name ?? '',
      value: team.ID ?? '',
    }));
  }
  return employeesStore.teams.map((team) => ({
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

onMounted(async () => {
  // Fetch titles and teams if not already loaded
  if (titlesStore.list.length === 0) {
    await titlesStore.fetchTitles();
  }
  if (teamsStore.list.length === 0) {
    await teamsStore.fetchTeams();
  }
});
</script>

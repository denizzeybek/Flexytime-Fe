<template>
  <DataTable
    v-model:filters="filters"
    tableStyle="min-width: 50rem"
    paginator
    :value="isLoading ? skeletonData : teams"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50]"
  >
    <template #header>
      <div class="flex justify-end">
        <IconField>
          <InputIcon>
            <i class="pi pi-search" />
          </InputIcon>
          <InputText v-model="filters['global'].value" :placeholder="t('common.search.placeholder')" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full flex justify-center py-8">
        <FText>{{ t('pages.hrSettings.teamsAndTitles.teams.table.empty') }}</FText>
      </div>
    </template>
    <Column sortable field="Name" :header="t('pages.hrSettings.teamsAndTitles.teams.table.columns.name')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
        <div v-else class="flex items-center gap-3">
          <i class="pi pi-users text-primary" />
          <FText>{{ slotProps.data.Name }}</FText>
        </div>
      </template>
    </Column>
    <Column field="MemberCount" :header="t('pages.hrSettings.teamsAndTitles.teams.table.columns.memberCount')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <Tag v-else :value="String(slotProps.data.MemberCount || 0)" severity="info" />
      </template>
    </Column>
    <Column field="Manager" :header="t('pages.hrSettings.teamsAndTitles.teams.table.columns.manager')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="8rem" />
        <div v-else-if="slotProps.data.Manager" class="flex items-center gap-2">
          <FAvatar :label="slotProps.data.Manager.Name" size="small" />
          <FText>{{ slotProps.data.Manager.Name }}</FText>
        </div>
        <Tag v-else :value="t('pages.hrSettings.teamsAndTitles.teams.table.noManager')" severity="warn" />
      </template>
    </Column>
    <Column :header="t('pages.hrSettings.teamsAndTitles.teams.table.columns.actions')">
      <template #body="slotProps">
        <Skeleton v-if="isLoading" height="1.5rem" width="5rem" />
        <OptionsDropdown
          v-else
          :options="options"
          @optionClick="handleOptionClick($event, slotProps.data)"
        />
      </template>
    </Column>

    <template #footer>
      <div class="flex flex-col gap-3 lg:flex-row lg:justify-between items-center">
        <Button icon="pi pi-plus" :label="t('pages.hrSettings.teamsAndTitles.teams.addButton')" class="shadow-sm" @click="handleNew" />
        <FText>{{ t('pages.hrSettings.teamsAndTitles.teams.footer', { count: teams.length }) }}</FText>
      </div>
    </template>
  </DataTable>

  <TeamModal
    v-if="isModalOpen"
    v-model:open="isModalOpen"
    :data="currentTeam"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { FilterMatchMode } from '@primevue/core/api';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';

import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { useFToast } from '@/composables/useFToast';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { createSkeletonData } from '@/helpers/skeleton';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsTeamsStore } from '@/stores/hrSettings/teams';

import TeamModal from './_modals/TeamModal.vue';

import type { TeamListItem } from '@/stores/hrSettings/teams';

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage } = useFToast();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const confirm = useConfirm();
const teamsStore = useHRSettingsTeamsStore();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  Name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const currentTeam = ref<TeamListItem>();
const isModalOpen = ref(false);

const isLoading = computed(() => teamsStore.isLoading);
const teams = computed(() => teamsStore.list);

const options = computed(() => [
  {
    label: t('common.actions.edit'),
    icon: 'pi pi-pencil',
    value: EOptionsDropdown.Edit,
  },
  {
    label: t('common.actions.delete'),
    icon: 'pi pi-trash',
    value: EOptionsDropdown.Delete,
  },
]);

const handleNew = async () => {
  currentTeam.value = undefined;
  await nextTick();
  isModalOpen.value = true;
};

const handleEdit = (team: TeamListItem) => {
  currentTeam.value = team;
  isModalOpen.value = true;
};

const handleDelete = (teamId: string) => {
  confirm.require({
    message: t('common.confirmDelete'),
    header: t('common.confirmation'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: t('common.buttons.yes'),
    rejectLabel: t('common.buttons.no'),
    accept: async () => {
      await executeWithFeedback(
        () => teamsStore.deleteTeam(teamId),
        t('pages.hrSettings.teamsAndTitles.teams.messages.deleted'),
      );
    },
  });
};

const handleOptionClick = (option: EOptionsDropdown, team: TeamListItem) => {
  if (option === EOptionsDropdown.Edit) {
    handleEdit(team);
  } else if (option === EOptionsDropdown.Delete) {
    handleDelete(team.ID!);
  }
};

const fetchTeams = async () => {
  try {
    await teamsStore.fetchTeams();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

const skeletonData = createSkeletonData(5, {
  Name: '',
  MemberCount: 0,
  Manager: undefined,
});

onMounted(() => {
  fetchTeams();
});
</script>

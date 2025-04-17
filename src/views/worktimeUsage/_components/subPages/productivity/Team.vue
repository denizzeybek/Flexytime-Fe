<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="teams"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column sortable field="Team" header="Team">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FAvatar :label="slotProps.data.Team?.Abbreviation ?? ''" />
              <FText>{{ slotProps.data.Team.Name }}</FText>
            </div>
          </template>
        </Column>
        <Column sortable field="Supervisor" header="Supervisor">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FAvatar :label="slotProps.data.Supervisor?.Abbreviation ?? ''" />
              <FText>{{ slotProps.data.Supervisor.Name }}</FText>
            </div>
          </template>
        </Column>
        <Column sortable field="Start" header="Start">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.Start.time }}</FText>
            </div>
          </template>
        </Column>
        <Column field="End" header="End">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.End.time }}</FText>
            </div>
          </template>
        </Column>
        <Column field="Work" header="Work">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.Work.time }}</FText>
            </div>
          </template>
        </Column>
        <Column field="Leisure" header="Leisure">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.Leisure.time }}</FText>
            </div>
          </template></Column
        >
        <Column field="Meeting" header="Meeting">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.Meeting.time }}</FText>
            </div>
          </template>
        </Column>
        <Column field="Unclassified" header="Unclassified">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FText as="h6">{{ slotProps.data.Unclassified.time }}</FText>
            </div>
          </template></Column
        >
        <template #footer> In total there are {{ teams ? teams.length : 0 }} teams. </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { EDomain } from '@/enums/domain.enum';
import { getDomainEnum } from '@/views/classification/_etc/helpers';
import { useSectionsStore } from '@/stores/worktimeUsage/section';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const sectionsStore = useSectionsStore();

const teams = computed<any>(() => sectionsStore.Teamset?.Teams);
</script>

<style scoped></style>

<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="tableData"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column v-if="showEmployeeColumn" sortable field="Employee" header="Name">
          <template #body="slotProps">
            <div 
              @click="slotProps.data ? handleEmployeeClick(slotProps.data) : null" 
              :class="['flex items-center gap-3', slotProps.data ? 'cursor-pointer' : '']"
            >
              <FAvatar :label="slotProps.data.Employee?.Abbreviation ?? ''" />
              <FText>{{ slotProps.data.Employee.Name }}</FText>
            </div>
          </template>
        </Column>
        
        <Column sortable field="Team" header="Team">
          <template #body="slotProps">
            <div
              @click="slotProps.data ? handleTeamClick(slotProps.data) : null"
              :class="['flex items-center gap-3', slotProps.data ? 'cursor-pointer' : '']"
            >
              <FAvatar
                v-if="slotProps.data.Team?.Abbreviation"
                :label="slotProps.data.Team?.Abbreviation ?? ''"
              />
              <FText>{{ slotProps.data.Team.Name }}</FText>
            </div>
          </template>
        </Column>
        
        <Column v-if="showSupervisorColumn" sortable field="Supervisor" header="Supervisor">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FAvatar :label="slotProps.data.Supervisor?.Abbreviation ?? ''" />
              <FText>{{ slotProps.data.Supervisor.Name }}</FText>
            </div>
          </template>
        </Column>
        
        <Column v-if="showTagsColumn" sortable field="Tags" header="Tags">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <template v-for="(tag, idx) in slotProps.data.Tags" :key="idx">
                <Tag :value="tag" />
              </template>
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
          </template>
        </Column>
        
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
          </template>
        </Column>
        
        <template #footer>
          In total there are {{ tableData ? tableData.length : 0 }} {{ footerText }}.
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import type { TeamMember, FilterPayload } from '../../../_types';

interface Props {
  isLoading: boolean;
  viewType: 'team' | 'individual';
}

const props = defineProps<Props>();

const route = useRoute();
const sectionsStore = useSectionsStore();
const handleFilterChange = inject('handleFilterChange') as (payload: FilterPayload) => void;

const isTeamData = computed(() => sectionsStore.Teamset?.IsTeam);

const tableData = computed<TeamMember[]>(() => {
  if (props.viewType === 'individual') {
    return sectionsStore.Individuals || [];
  }
  return isTeamData.value ? sectionsStore.Teamset?.Teams || [] : sectionsStore.Teamset?.Members || [];
});

const showEmployeeColumn = computed(() => !isTeamData.value);
const showSupervisorColumn = computed(() => isTeamData.value);
const showTagsColumn = computed(() => props.viewType === 'individual');

const footerText = computed(() => {
  if (props.viewType === 'individual') return 'individuals';
  return isTeamData.value ? 'teams' : 'members';
});

const handleTeamClick = (data: TeamMember) => {
  if (!data || !data.ID) return; // Null check
  
  const currentTeamId = route.query.teamId;
  if (!currentTeamId || currentTeamId !== data.ID) {
    const payload: FilterPayload = {
      perspective: Number(route.query?.perspective) || 0,
      interval: route.query?.interval as string || '',
      teamId: data.ID,
    };
    handleFilterChange(payload);
  }
};

const handleEmployeeClick = (data: TeamMember) => {
  if (!data || !data.ID) return; // Null check
  
  const payload: FilterPayload = {
    perspective: Number(route.query?.perspective) || 0,
    interval: route.query?.interval as string || '',
    memberId: data.ID,
    isIndividual: true,
  };
  handleFilterChange(payload);
};
</script>
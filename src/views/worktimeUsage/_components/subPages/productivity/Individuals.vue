<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="individuals"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column sortable field="Employee" header="Name">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <FAvatar :label="slotProps.data.Employee?.Abbreviation ?? ''" />
              <FText>{{ slotProps.data.Employee.Name }}</FText>
            </div>
          </template>
        </Column>
        <Column sortable field="TeamName" header="TeamName"></Column>
        <Column sortable field="Tags" header="Tags">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
              <template v-for="(tag, idx) in slotProps.data.Tags" :key="idx">
                <Tag :value="tag" />
              </template>
            </div>
          </template>
        </Column>
        <Column field="Start" header="Start">
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
        <template #footer>
          In total there are {{ individuals ? individuals.length : 0 }} individuals.
        </template>
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

const individuals = computed<any>(() => sectionsStore.Individuals);
</script>

<style scoped></style>

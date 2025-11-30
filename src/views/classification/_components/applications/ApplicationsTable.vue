<template>
  <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :first="first"
        :value="isLoading ? skeletonData : applications"
        :totalRecords="totalItems"
        :rows="10"
        lazy
        @page="onPageChange"
        @sort="onSortOrder"
      >
        <Column sortable field="Name" :header="t('pages.classification.table.columns.name')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <span v-else>{{ slotProps.data.Name }}</span>
          </template>
        </Column>
        <Column sortable field="Teams" :header="t('pages.classification.table.columns.teams')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="6rem" />
            <span v-else>{{ slotProps.data.Teams }}</span>
          </template>
        </Column>
        <Column :header="t('pages.classification.table.columns.alwaysOn')">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" width="2rem" height="2rem" class="rounded" />
            <Checkbox
              v-else
              :modelValue="slotProps.data.AlwaysOn"
              :binary="true"
              @change="
                onAlwaysOnChange(slotProps.data)
              "
            />
          </template>
        </Column>
        <Column :header="t('pages.classification.table.columns.actions')">
          <template #body="slotProps">
            <div v-if="isLoading" class="flex gap-3">
              <Skeleton width="2.5rem" height="2.5rem" class="rounded-lg" />
              <Skeleton width="2.5rem" height="2.5rem" class="rounded-lg" />
              <Skeleton width="2.5rem" height="2.5rem" class="rounded-lg" />
            </div>
            <div v-else class="flex gap-3">
              <Button
                icon="pi pi-wrench"
                severity="success"
                :outlined="getDomainEnum(slotProps.data.Domain) !== EDomain.WORK"
                @click="updateDomain({ data: slotProps.data, Domain: EDomain.WORK })"
              />
              <Button
                icon="pi pi-moon"
                severity="danger"
                :outlined="getDomainEnum(slotProps.data.Domain) !== EDomain.LEISURE"
                @click="updateDomain({ data: slotProps.data, Domain: EDomain.LEISURE })"
              />
              <Button
                icon="pi pi-calendar"
                severity="warn"
                :outlined="getDomainEnum(slotProps.data.Domain) !== EDomain.MEETING"
                @click="updateDomain({ data: slotProps.data, Domain: EDomain.MEETING })"
              />
            </div>
          </template>
        </Column>

        <template #footer>
          {{ t('pages.classification.table.footer.applications', [applications ? applications.length : 0]) }}
        </template>
      </DataTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Checkbox from 'primevue/checkbox';
import Skeleton from 'primevue/skeleton';

import { useFToast } from '@/composables/useFToast';
import { EDomain } from '@/enums/domain.enum';
import { type MessageSchema } from '@/plugins/i18n';
import { useClassificationApplicationsStore } from '@/stores/classification/applications';
import { getDomainEnum } from '@/views/classification/_etc/helpers';

interface IProps {
  isLoading: boolean;
}

interface IEmits {
  (event: 'onPageChange', currentPage): void;
  (event: 'onSortChange', sortField): void;
}

defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage } = useFToast();
const applicationsStore = useClassificationApplicationsStore();

const first = ref(0);

const applications = computed(() => applicationsStore.list);

const totalItems = computed(() => applicationsStore.totalItems);

const onPageChange = (event: any) => {
  first.value = event.first;
  const offset = event.first;
  const rows = event.rows;
  emit('onPageChange', { offset, rows });
};

const onSortOrder = (event: any) => {
  const { sortField } = event;
  emit('onSortChange', sortField);
};

const onAlwaysOnChange = async (event) => {
  try {
    const { ID, AlwaysOn, Domain, Name } = event;
    const payload = {
      ID,
      AlwaysOn: !AlwaysOn,
      Domain,
      Name,
    };

    await applicationsStore.save(payload);
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
};

const updateDomain = async (event) => {
  try {
    const { data, Domain } = event;
    const { ID, AlwaysOn, Name } = data;
    const payload = {
      ID,
      AlwaysOn,
      Domain,
      Name,
    };

    await applicationsStore.save(payload);
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  Name: '',
  Teams: '',
  AlwaysOn: false,
  Domain: 0,
}));
</script>

<style scoped></style>

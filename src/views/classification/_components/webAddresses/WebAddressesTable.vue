<template>
  <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :first="first"
        :value="isLoading ? skeletonData : webAddresses"
        :totalRecords="totalItems"
        :rows="10"
        lazy
        @page="onPageChange"
        @sort="onSortOrder"
      >
        <Column sortable field="HostName" header="Name">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
            <span v-else>{{ slotProps.data.HostName }}</span>
          </template>
        </Column>
        <Column sortable field="TopicName" header="Topic">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="8rem" />
            <span v-else>{{ slotProps.data.TopicName }}</span>
          </template>
        </Column>
        <Column field="Teams" header="Teams">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" height="1.5rem" width="6rem" />
            <span v-else>{{ slotProps.data.Teams }}</span>
          </template>
        </Column>
        <Column header="Always On">
          <template #body="slotProps">
            <Skeleton v-if="isLoading" width="2rem" height="2rem" class="rounded" />
            <Checkbox
              v-else
              @change="onAlwaysOnChange(slotProps.data)"
              :modelValue="slotProps.data.AlwaysOn"
              :binary="true"
            />
          </template>
        </Column>
        <!-- <Column header="timeCol">
           <template #body="slotProps">
            <i class="pi pi-clock""></i>
            {{ getTimeData(slotProps.data.Timeout.time) }}
          </template>
        </Column> -->
        <Column header="Actions">
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

        <template #footer> In total there are {{ totalItems }} webAddresses. </template>
      </DataTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Skeleton from 'primevue/skeleton';
import { EDomain } from '@/enums/domain.enum';
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses';
import { getDomainEnum } from '@/views/classification/_etc/helpers';
import Checkbox from 'primevue/checkbox';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

interface IEmits {
  (event: 'onPageChange', currentPage): void;
  (event: 'onSortChange', sortField): void;
}
const emit = defineEmits<IEmits>();

const webAddressesStore = useClassificationWebAddressesStore();

const first = ref(0);

const webAddresses = computed(() => webAddressesStore.list);

const totalItems = computed(() => webAddressesStore.totalItems);

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
    console.log('event ', event);
    const { ID, AlwaysOn, Domain } = event;
    const payload = {
      ID,
      AlwaysOn: !AlwaysOn,
      Domain,
    };

    await webAddressesStore.save(payload);
  } catch (error) {
    console.log(error);
  }
};

const updateDomain = async (event) => {
  try {
    console.log('domain ', event);
    const { data, Domain } = event;
    const { ID, AlwaysOn } = data;
    const payload = {
      ID,
      AlwaysOn,
      Domain,
    };

    await webAddressesStore.save(payload);
  } catch (error) {
    console.log(error);
  }
};

// Skeleton dummy data - 5 rows for loading state
const skeletonData = Array.from({ length: 5 }, (_, i) => ({
  ID: `skeleton-${i}`,
  HostName: '',
  TopicName: '',
  Teams: '',
  AlwaysOn: false,
  Domain: 0,
}));
</script>

<style scoped></style>

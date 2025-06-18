<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :first="first"
        :loading="isLoading"
        :value="applications"
        :totalRecords="totalItems"
        :rows="10"
        lazy
        @page="onPageChange"
        @sort="onSortOrder"
      >
        <Column sortable field="Name" header="Name"> </Column>
        <Column sortable field="Teams" header="Teams"> </Column>
        <Column header="Always On">
          <template #body="slotProps">
            <Checkbox
              @change="
                onAlwaysOnChange(slotProps.data)
              "
              :modelValue="slotProps.data.AlwaysOn"
              :binary="true"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <div class="flex gap-3">
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
          In total there are {{ applications ? applications.length : 0 }} applications.
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClassificationApplicationsStore } from '@/stores/classification/applications';
import { getDomainEnum } from '@/views/classification/_etc/helpers';
import { EDomain } from '@/enums/domain.enum';
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>

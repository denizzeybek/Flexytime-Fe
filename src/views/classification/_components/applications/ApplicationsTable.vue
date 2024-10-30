<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="applications"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column field="Name" header="Name"> </Column>
        <Column field="Teams" header="Teams"> </Column>
        <Column header="Always On">
          <template #body="slotProps">
            <Checkbox
              @change="
                onAlwaysOnChange({ props: slotProps.data.ID, alwaysOn: !slotProps.data.AlwaysOn })
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
              />
              <Button
                icon="pi pi-moon"
                severity="danger"
                :outlined="getDomainEnum(slotProps.data.Domain) !== EDomain.LEISURE"
              />
              <Button
                icon="pi pi-calendar"
                severity="warn"
                :outlined="getDomainEnum(slotProps.data.Domain) !== EDomain.MEETING"
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
import { computed } from 'vue';
import { useClassificationApplicationsStore } from '@/stores/classification/applications';
import { getDomainEnum } from '@/views/classification/_etc/helpers';
import { EDomain } from '@/enums/domain.enum';
import Checkbox from 'primevue/checkbox';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const applicationsStore = useClassificationApplicationsStore();

const applications = computed(() => applicationsStore.list);

const onAlwaysOnChange = async (event) => {
  try {
    const { props, alwaysOn } = event;
    const { ID, Name, Domain } = props;
    const payload = {
      ID,
      Name,
      Domain,
      AlwaysOn: alwaysOn,
    };

    // await applicationsStore.update(payload)
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>

<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="webAddressesList"
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
          In total there are {{ webAddressesList ? webAddressesList.length : 0 }} webAddressesList.
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClassificationApplicationsStore } from '@/stores/classification/applications'
import { getDomainEnum } from '@/views/classification/_etc/helpers'
import { EDomain } from '@/enums/domain.enum'
import Checkbox from 'primevue/checkbox'

interface IProps {
  isLoading: boolean
}

defineProps<IProps>()

const applicationsStore = useClassificationApplicationsStore()

const webAddressesList = ref([
  {
    HostName: null,
    DomainDisplay: 'Work',
    Name: ' Ashampoo',
    IsWork: true,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: null,
    Actions: null,
    Customise: null,
    Timeout: null,
    Teams: 'All',
    ID: 'c3b06a4f-ede0-4213-8c82-b5be2c440def',
    AlwaysOn: true,
    Domain: 4
  },
  {
    HostName: null,
    DomainDisplay: 'Unclassified',
    Name: '1056-winamp58_3653_beta_full_en-us',
    IsWork: false,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: null,
    Actions: null,
    Customise: null,
    Timeout: null,
    Teams: 'All',
    ID: 'e35d4f28-ad5c-4e4e-96c8-feb96161ff73',
    AlwaysOn: false,
    Domain: 2
  },
  {
    HostName: null,
    DomainDisplay: 'Work',
    Name: 'Adobe Acrobat',
    IsWork: true,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: null,
    Actions: null,
    Customise: null,
    Timeout: null,
    Teams: 'All',
    ID: '151f8715-2628-42b1-8e2d-50129fa7339f',
    AlwaysOn: false,
    Domain: 4
  },
  {
    HostName: null,
    DomainDisplay: 'Work',
    Name: 'advanced_ip_scanner',
    IsWork: true,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: null,
    Actions: null,
    Customise: null,
    Timeout: null,
    Teams: 'All',
    ID: '2263a1c4-75f1-4ffc-9bf8-2b585796e5e5',
    AlwaysOn: false,
    Domain: 4
  },
  {
    HostName: null,
    DomainDisplay: 'Unclassified',
    Name: 'Advanced_IP_Scanner_2.5.3850.tmp',
    IsWork: false,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: null,
    Actions: null,
    Customise: null,
    Timeout: null,
    Teams: 'All',
    ID: '89d6010c-751a-4629-a4c1-9192360fc23e',
    AlwaysOn: false,
    Domain: 3
  }
])

const onAlwaysOnChange = async (event) => {
  try {
    const { props, alwaysOn } = event
    const { ID, Name, Domain } = props
    const payload = {
      ID,
      Name,
      Domain,
      AlwaysOn: alwaysOn
    }

    // await applicationsStore.update(payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>

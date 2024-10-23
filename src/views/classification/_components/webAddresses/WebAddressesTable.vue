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
        <Column field="HostName" header="Name"> </Column>
        <Column field="TopicName" header="Topic"> </Column>
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
        <!-- <Column header="timeCol">
           <template #body="slotProps">
            <i class="pi pi-clock""></i>
            {{ getTimeData(slotProps.data.Timeout.time) }}
          </template> 
        </Column> -->
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
import { EDomain } from '@/enums/domain.enum'
import { useClassificationWebAddressesStore } from '@/stores/classification/webAddresses'
import { getDomainEnum } from '@/views/classification/_etc/helpers'

interface IProps {
  isLoading: boolean
}

defineProps<IProps>()

const webAddressesStore = useClassificationWebAddressesStore()

const webAddressesList = ref([
  {
    HostName: '10.201.2.7',
    DomainDisplay: 'Meeting',
    Name: '10.201.2.7',
    IsWork: false,
    IsMeeting: true,
    IsLeisure: false,
    TopicName: 'Not Rated',
    Actions: null,
    Customise: null,
    Timeout: {
      time: '00:00',
      statisticType: 'starttime'
    },
    Teams: 'All',
    ID: '12c7a998-af79-4c42-b4ee-c944eaaec0dc',
    AlwaysOn: true,
    Domain: 3
  },
  {
    HostName: '10.5.0.1',
    DomainDisplay: 'Leisure',
    Name: '10.5.0.1',
    IsWork: false,
    IsMeeting: false,
    IsLeisure: true,
    TopicName: 'Not Rated',
    Actions: null,
    Customise: null,
    Timeout: {
      time: '00:00',
      statisticType: 'starttime'
    },
    Teams: 'All',
    ID: 'dbd6cb5c-8a9e-4e51-9f30-8d7e40341b95',
    AlwaysOn: false,
    Domain: 2
  },
  {
    HostName: '10.5.17.241',
    DomainDisplay: 'Leisure',
    Name: '10.5.17.241',
    IsWork: false,
    IsMeeting: false,
    IsLeisure: true,
    TopicName: 'Not Rated',
    Actions: null,
    Customise: null,
    Timeout: {
      time: '00:00',
      statisticType: 'starttime'
    },
    Teams: 'All',
    ID: '727ab586-7cb2-481c-a3e8-abb0af674616',
    AlwaysOn: false,
    Domain: 2
  },
  {
    HostName: 'aa.com.tr',
    DomainDisplay: 'Leisure',
    Name: 'aa.com.tr',
    IsWork: false,
    IsMeeting: false,
    IsLeisure: true,
    TopicName: 'News and Media',
    Actions: null,
    Customise: null,
    Timeout: {
      time: '00:00',
      statisticType: 'starttime'
    },
    Teams: 'All',
    ID: 'fc38d858-0400-4158-bb6e-ea283881a293',
    AlwaysOn: false,
    Domain: 2
  },
  {
    HostName: 'account.live.com',
    DomainDisplay: 'Work',
    Name: 'account.live.com',
    IsWork: true,
    IsMeeting: false,
    IsLeisure: false,
    TopicName: 'Web-based Email',
    Actions: null,
    Customise: null,
    Timeout: {
      time: '00:00',
      statisticType: 'starttime'
    },
    Teams: 'All',
    ID: '450d0cbc-7f66-484a-97f3-000c7b612224',
    AlwaysOn: true,
    Domain: 4
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

    // await webAddressesStore.update(payload)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped></style>

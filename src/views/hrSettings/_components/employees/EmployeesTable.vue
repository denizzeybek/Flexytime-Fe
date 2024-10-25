<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="employeesList"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <Column sortable field="MemberName" header="Name">
          <template #body="slotProps">
            <div class="flex items-center gap-3">
            <FAvatar :label="slotProps.data.MemberName" />
            <FText>{{ slotProps.data.MemberName }}</FText>
          </div>
          </template>
        </Column>
        <Column sortable field="RoleName" header="Role Name"> </Column>
        <Column field="Tags" header="Tags">
          <template #body="slotProps">
            <div v-if="slotProps.data.Tags?.length" class="flex flex-col gap-1">
              <div v-for="(tag, idx) in slotProps.data.Tags" :key="idx">
                <Tag :value="tag" />
              </div>
            </div>
            <div v-else></div>
          </template>
        </Column>
        <Column sortable field="TitleName" header="Title Name"> </Column>
        <Column sortable field="TeamName" header="Team Name"> </Column>
        <Column field="Salary" header="Salary"> </Column>
        <Column header="Enabled">
          <template #body="slotProps">
            <Checkbox
              @change="
                onAlwaysOnChange({ props: slotProps.data.ID, alwaysOn: !slotProps.data.Enabled })
              "
              :modelValue="slotProps.data.Enabled"
              :binary="true"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <OptionsDropdown
              :options="options"
              @optionClick="handleOptionClick($event, slotProps.data.ID)"
            />
          </template>
        </Column>

        <template #footer>
          In total there are {{ employeesList ? employeesList.length : 0 }} employeesList.
        </template>
      </DataTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tag from 'primevue/tag';
import Checkbox from 'primevue/checkbox';
import { useHRSettingsEmployeesStore } from '@/stores/hrSettings/employees';
import { getDomainEnum } from '@/views/classification/_etc/helpers';
import OptionsDropdown from '@/components/ui/local/OptionsDropdown.vue';
import { EOptionsDropdown } from '@/enums/optionsDropdown.enum';

interface IProps {
  isLoading: boolean;
}

defineProps<IProps>();

const employeesStore = useHRSettingsEmployeesStore();

const options = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    value: EOptionsDropdown.Edit,
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    value: EOptionsDropdown.Delete,
  },
]);

const employeesList = ref([
  {
    Abbreviation: 'JE',
    RoleName: 'Manager',
    TeamName: 'Commercial Project Bidding',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291770657a0318a082d51e0',
    MemberName: 'Judith Elliott',
    TeamId: '629176ff57a0318a082d51b5',
    TitleId: '629176f457a0318a082d50e5',
    TitleName: 'Bidding Supervisor',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\judith.elliott',
    Enabled: true,
    Role: 1,
    Tags: ['Analizyum'],
    ImageData: null,
  },
  {
    Abbreviation: 'EW',
    RoleName: 'Manager',
    TeamName: 'Finance Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291770757a0318a082d51e7',
    MemberName: 'Evelyn Wall',
    TeamId: '629176fb57a0318a082d5166',
    TitleId: '629176f857a0318a082d513c',
    TitleName: 'Finance Director',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\evelyn.wall',
    Enabled: true,
    Role: 1,
    Tags: ['Billing'],
    ImageData: null,
  },
  {
    Abbreviation: 'CM',
    RoleName: 'Employee',
    TeamName: 'Commercial Project Bidding',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291770957a0318a082d51fc',
    MemberName: 'Celine Miller',
    TeamId: '629176ff57a0318a082d51b5',
    TitleId: '629176f757a0318a082d512d',
    TitleName: 'Bidding Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\celine.miller',
    Enabled: true,
    Role: 0,
    Tags: ['Accounting', 'Finance', 'Billing', 'Collection'],
    ImageData: null,
  },
  {
    Abbreviation: 'KM',
    RoleName: 'Manager',
    TeamName: 'Strategy Development',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291770b57a0318a082d520a',
    MemberName: 'Kyan Mooney',
    TeamId: '629176fc57a0318a082d516b',
    TitleId: '629176f357a0318a082d50de',
    TitleName: 'Strategy Supervisor',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\kyan.mooney',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'JH',
    RoleName: 'Manager',
    TeamName: 'Trading Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291771557a0318a082d5261',
    MemberName: 'Julie Harding',
    TeamId: '629176ff57a0318a082d51b3',
    TitleId: '629176f757a0318a082d5128',
    TitleName: 'Trade Manager',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\julie.harding',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'AO',
    RoleName: 'Manager',
    TeamName: 'Collection and Budget',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291771657a0318a082d526d',
    MemberName: 'Agnes Owens',
    TeamId: '629176fc57a0318a082d5177',
    TitleId: '629176f357a0318a082d50d2',
    TitleName: 'Collection Supervisor',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\agnes.owens',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'RC',
    RoleName: 'Manager',
    TeamName: 'Price and Competition Analysis',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291771a57a0318a082d5295',
    MemberName: 'Remi Conner',
    TeamId: '629176fc57a0318a082d516e',
    TitleId: '629176f857a0318a082d5144',
    TitleName: 'Bidding Supervisor',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\remi.conner',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'EJ',
    RoleName: 'Employee',
    TeamName: 'Strategy Development',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291771d57a0318a082d52ae',
    MemberName: 'Erik Johnson',
    TeamId: '629176fc57a0318a082d516b',
    TitleId: '629176f557a0318a082d5109',
    TitleName: 'Strategy Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\erik.johnson',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'JW',
    RoleName: 'Employee',
    TeamName: 'Collection and Budget',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772357a0318a082d52e1',
    MemberName: 'Josephine Walsh',
    TeamId: '629176fc57a0318a082d5177',
    TitleId: '629176f857a0318a082d513e',
    TitleName: 'Collection Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\josephine.walsh',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'DH',
    RoleName: 'Manager',
    TeamName: 'Accounting Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772457a0318a082d52e8',
    MemberName: 'Danielle Hurst',
    TeamId: '629176fc57a0318a082d5175',
    TitleId: '629176f357a0318a082d50dd',
    TitleName: 'Accounting Manager',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\danielle.hurst',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'LF',
    RoleName: 'Manager',
    TeamName: 'Finance Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772457a0318a082d52ed',
    MemberName: 'Luis Fox',
    TeamId: '629176ff57a0318a082d51ae',
    TitleId: '629176f357a0318a082d50dd',
    TitleName: 'Accounting Manager',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\luis.fox',
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'KL',
    RoleName: 'Employee',
    TeamName: 'Sales Support Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772b57a0318a082d5329',
    MemberName: 'Kristina Lozano',
    TeamId: '629176ff57a0318a082d51ab',
    TitleId: '629176f857a0318a082d5141',
    TitleName: 'Sales Supervisor',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\k.lozano',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'JW',
    RoleName: 'Administrator',
    TeamName: 'Contoso',
    ImageUrl:
      'https://api.flexytime.com/Download/GetImage/6291772d57a0318a082d5340?638140671444100000&downloadKey=WUDSH27CR9WU',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772d57a0318a082d5340',
    MemberName: 'Jamie Watkins',
    TeamId: '629176fe57a0318a082d51a2',
    TitleId: '629176f957a0318a082d514d',
    TitleName: 'General Manager',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\jamie.watkins',
    Enabled: true,
    Role: 2,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'JL',
    RoleName: 'Employee',
    TeamName: 'Accounting Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291772e57a0318a082d5346',
    MemberName: 'Jose Lambert',
    TeamId: '629176fc57a0318a082d5175',
    TitleId: '629176f457a0318a082d50e8',
    TitleName: 'Accounting Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\jose.lambert',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'FY',
    RoleName: 'Manager',
    TeamName: 'Sales Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291773057a0318a082d535b',
    MemberName: 'FlexyTime Yönetici',
    TeamId: '629176fc57a0318a082d517e',
    TitleId: '629176f657a0318a082d5112',
    TitleName: 'Sales Director',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: null,
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'SM',
    RoleName: 'Employee',
    TeamName: 'Accounting Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291773357a0318a082d5370',
    MemberName: 'Samson Mullen',
    TeamId: '629176fc57a0318a082d5175',
    TitleId: '629176f457a0318a082d50e8',
    TitleName: 'Accounting Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\samson.mullen',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'TT',
    RoleName: 'Employee',
    TeamName: 'Collection and Budget',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291773357a0318a082d5374',
    MemberName: 'Tobias Turner',
    TeamId: '629176fc57a0318a082d5177',
    TitleId: '629176f857a0318a082d513e',
    TitleName: 'Collection Expert',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'CONTOSO\\tobias.turner',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'PD',
    RoleName: 'Manager',
    TeamName: 'Sales Support Department',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '6291773657a0318a082d538d',
    MemberName: 'Phillip Dotson',
    TeamId: '629176ff57a0318a082d51ab',
    TitleId: '647c860c717e9a0f80979b49',
    TitleName: 'Support Manager',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: null,
    Enabled: true,
    Role: 1,
    Tags: [],
    ImageData: null,
  },
  {
    Abbreviation: 'M',
    RoleName: 'Employee',
    TeamName: 'Work Group',
    ImageUrl: '',
    ManagementTitleId: null,
    EmployeeTitleId: null,
    EmployeeTitles: null,
    ManagerTitles: null,
    TagsDisplay: '',
    EnabledDisplay: 'True',
    ID: '66a0b15a5e7b6c08a03fd096',
    MemberName: 'mehme',
    TeamId: '66a0b15a5e7b6c08a03fd095',
    TitleId: '629176f957a0318a082d514b',
    TitleName: 'UnTitled',
    Salary: '0',
    Password: null,
    Email: null,
    WindowsIdentity: 'DESKTOP-DJETEOL\\mehme',
    Enabled: true,
    Role: 0,
    Tags: [],
    ImageData: null,
  },
]);

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

    // await employeesStore.update()
  } catch (error) {
    console.log(error);
  }
};

const handleOptionClick = (option, id) => {
  console.log(option, id);
};
</script>

<style scoped></style>

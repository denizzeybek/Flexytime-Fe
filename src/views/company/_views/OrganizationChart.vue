<template>
  <Card>
    <template #header>
      <li
        class="items-center hidden gap-2 px-12 py-4 text-lg lg:ml-4 font-normal rounded-lg lg:grid-rows-1 lg:grid text-r-secondary lg:grid-cols-8"
      >
        <div class="lg:col-span-2 lg:ml-4">Team Name</div>
        <div class="lg:col-span-2 lg:ml-4">Member Name</div>
        <div class="text-center lg:col-span-2">Title</div>
        <div></div>
        <!---->
        <div></div>
      </li>
    </template>
    <template #content>
      <div v-for="team in mockData" :key="team.ID">
        <ul class="flex flex-col gap-2">
          <OrganizationItem :model="team" @itemChange="onItemChange($event)" />
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button @click="handleAddTeam" icon="pi pi-plus" label="Add Team" />
        <Button severity="info" label="Save" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IOrganizationChartNodes } from '@/interfaces/company/organizationChart';
import OrganizationItem from '@/views/company/_components/organizationChart/OrganizationItem.vue';
import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';

const { showErrorMessage } = useFToast();
const organizationsStore = useCompanyOrganizationChartsStore();

const mockData = ref<IOrganizationChartNodes[]>([
  {
    children: [
      {
        children: [
          {
            children: [],
            title: 'Accounting Department',
            Abbreviation: 'AD',
            Name: 'Accounting Department',
            ID: '629176fc57a0318a082d5175',
            TitleName: 'Accounting Manager',
            TitleId: '629176f357a0318a082d50dd',
            MemberId: '64015c5ee435600a443e8dc4',
            MemberName: 'Danielle Hurst',
            TeamId: null,
          },
          {
            children: [
              {
                children: [],
                title: 'Collection and Budget',
                Abbreviation: 'CAB',
                Name: 'Collection and Budget',
                ID: '629176fc57a0318a082d5177',
                TitleName: 'Collection Supervisor',
                TitleId: '629176f357a0318a082d50d2',
                MemberId: '64015c5ee435600a443e8c32',
                MemberName: 'Agnes Owens',
                TeamId: null,
              },
            ],
            title: 'Finance Department',
            Abbreviation: 'FD',
            Name: 'Finance Department',
            ID: '629176ff57a0318a082d51ae',
            TitleName: 'Accounting Manager',
            TitleId: '629176f357a0318a082d50dd',
            MemberId: '64015c5ee435600a443e8d7f',
            MemberName: 'Luis Fox',
            TeamId: null,
          },
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [],
                            title: 'Deniz Department',
                            Abbreviation: 'CAB',
                            Name: 'Collection and Budget',
                            ID: '629176fc57a0318a082d5177345123173984',
                            TitleName: 'Collection Supervisor',
                            TitleId: '629176f357a0318a082d50d2',
                            MemberId: '64015c5ee435600a443e8c32',
                            MemberName: 'Agnes Owens',
                            TeamId: null,
                          },
                        ],
                        title: 'Collection and Budget',
                        Abbreviation: 'CAB',
                        Name: 'Collection and Budget',
                        ID: '629176fc57a0318a082d517734573984',
                        TitleName: 'Collection Supervisor',
                        TitleId: '629176f357a0318a082d50d2',
                        MemberId: '64015c5ee435600a443e8c32',
                        MemberName: 'Agnes Owens',
                        TeamId: null,
                      },
                    ],
                    title: 'Collection and Budget',
                    Abbreviation: 'CAB',
                    Name: 'Collection and Budget',
                    ID: '629176fc57a0318a082d517712312',
                    TitleName: 'Collection Supervisor',
                    TitleId: '629176f357a0318a082d50d2',
                    MemberId: '64015c5ee435600a443e8c32',
                    MemberName: 'Agnes Owens',
                    TeamId: null,
                  },
                ],
                title: 'Strategy Development',
                Abbreviation: 'SD',
                Name: 'Strategy Development',
                ID: '629176fc57a0318a082d516b',
                TitleName: 'Strategy Supervisor',
                TitleId: '629176f357a0318a082d50de',
                MemberId: '64015c5ee435600a443e8c13',
                MemberName: 'Kyan Mooney',
                TeamId: null,
              },
              {
                children: [],
                title: 'Price and Competition Analysis',
                Abbreviation: 'PACA',
                Name: 'Price and Competition Analysis',
                ID: '629176fc57a0318a082d516e',
                TitleName: 'Bidding Supervisor',
                TitleId: '629176f857a0318a082d5144',
                MemberId: '64015c5ee435600a443e8c27',
                MemberName: 'Remi Conner',
                TeamId: null,
              },
              {
                children: [],
                title: 'Commercial Project Bidding',
                Abbreviation: 'CPB',
                Name: 'Commercial Project Bidding',
                ID: '629176ff57a0318a082d51b5',
                TitleName: 'Bidding Supervisor',
                TitleId: '629176f457a0318a082d50e5',
                MemberId: '64015c5ee435600a443e8e3c',
                MemberName: 'Judith Elliott',
                TeamId: null,
              },
            ],
            title: 'Trading Department',
            Abbreviation: 'TD',
            Name: 'Trading Department',
            ID: '629176ff57a0318a082d51b3',
            TitleName: 'Trade Manager',
            TitleId: '629176f757a0318a082d5128',
            MemberId: '64015c5ee435600a443e8d79',
            MemberName: 'Julie Harding',
            TeamId: null,
          },
        ],
        title: 'Finance Department',
        Abbreviation: 'FD',
        Name: 'Finance Department',
        ID: '629176fb57a0318a082d5166',
        TitleName: 'Finance Director',
        TitleId: '629176f857a0318a082d513c',
        MemberId: '64015c5ee435600a443e8e1e',
        MemberName: 'Evelyn Wall',
        TeamId: null,
      },
      {
        children: [
          {
            children: [],
            title: 'Sales Support Department',
            Abbreviation: 'SSD',
            Name: 'Sales Support Department',
            ID: '629176ff57a0318a082d51ab',
            TitleName: 'Support Manager',
            TitleId: '647c860c717e9a0f80979b49',
            MemberId: '64015c5ee435600a443e8cfb',
            MemberName: 'Phillip Dotson',
            TeamId: null,
          },
        ],
        title: 'Sales Department',
        Abbreviation: 'SD',
        Name: 'Sales Department',
        ID: '629176fc57a0318a082d517e',
        TitleName: 'Sales Director',
        TitleId: '629176f657a0318a082d5112',
        MemberId: '64015c5ee435600a443e8d19',
        MemberName: 'FlexyTime Yönetici',
        TeamId: null,
      },
    ],
    title: 'Contoso',
    Abbreviation: 'C',
    Name: 'Contoso',
    ID: '629176fe57a0318a082d51a2',
    TitleName: 'General Manager',
    TitleId: '629176f957a0318a082d514d',
    MemberId: '64015c5ee435600a443e8d02',
    MemberName: 'Jamie Watkins',
    TeamId: null,
  },
  {
    children: [],
    title: 'Work Group',
    Abbreviation: 'WG',
    Name: 'Work Group',
    ID: '66a0b15a5e7b6c08a03fd095',
    TitleName: 'UnTitled',
    TitleId: '629176f957a0318a082d514b',
    MemberId: '',
    MemberName: null,
    TeamId: null,
  },
]);

const updatedData = ref();
const isLoading = ref(false);

const handleAddTeam = () => {
  mockData.value.push({
    children: [],
    title: 'New Item',
  });
};

const onItemChange = (item: IOrganizationChartNodes) => {
  updatedData.value = recursiveReplaceById(mockData.value, item.ID, item);
};

const recursiveReplaceById = (data, targetId, newData) => {
  // Map over the array of objects (data structure)
  return data.map((item) => {
    // If the current item's ID matches the target ID, replace the entire object with newData
    if (item.ID === targetId) {
      return { ...newData };
    }

    // If the current object has children, recursively call the function on the children
    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children = recursiveReplaceById(item.children, targetId, newData);
    }

    // Return the (possibly modified) object
    return item;
  });
};

const fetchOrganizationChart = async () => {
  try {
    isLoading.value = true;
    await organizationsStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

onMounted(() => {
  // fetchOrganizationChart();
})
</script>

<style>
.item {
  cursor: pointer;
  line-height: 1.5;
}
.bold {
  font-weight: bold;
}
</style>

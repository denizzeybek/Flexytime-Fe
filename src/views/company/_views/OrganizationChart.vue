<template>
  <Card>
    <template #content>
      <div v-for="team in mockData" :key="team.ID">
        <OrganizationItem :model="team" />
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
import { ref } from 'vue';
import OrganizationItem from '@/views/company/_components/organizationChart/OrganizationItem.vue';

export interface ITeam {
  title: string;
  children?: ITeam[];
  abbreviation?: string;
  name?: string;
  ID?: string;
  titleName?: string;
  titleId?: string;
  memberId?: string;
  memberName?: string | null;
  teamId?: string | null;
}

const mockData = ref<ITeam[]>([
  {
    children: [
      {
        children: [
          {
            children: [],
            title: 'Accounting Department',
            abbreviation: 'AD',
            name: 'Accounting Department',
            ID: '629176fc57a0318a082d5175',
            titleName: 'Accounting Manager',
            titleId: '629176f357a0318a082d50dd',
            memberId: '64015c5ee435600a443e8dc4',
            memberName: 'Danielle Hurst',
            teamId: null,
          },
          {
            children: [
              {
                children: [],
                title: 'Collection and Budget',
                abbreviation: 'CAB',
                name: 'Collection and Budget',
                ID: '629176fc57a0318a082d5177',
                titleName: 'Collection Supervisor',
                titleId: '629176f357a0318a082d50d2',
                memberId: '64015c5ee435600a443e8c32',
                memberName: 'Agnes Owens',
                teamId: null,
              },
            ],
            title: 'Finance Department',
            abbreviation: 'FD',
            name: 'Finance Department',
            ID: '629176ff57a0318a082d51ae',
            titleName: 'Accounting Manager',
            titleId: '629176f357a0318a082d50dd',
            memberId: '64015c5ee435600a443e8d7f',
            memberName: 'Luis Fox',
            teamId: null,
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
                            title: 'Collection and Budget',
                            abbreviation: 'CAB',
                            name: 'Collection and Budget',
                            ID: '629176fc57a0318a082d5177345123173984',
                            titleName: 'Collection Supervisor',
                            titleId: '629176f357a0318a082d50d2',
                            memberId: '64015c5ee435600a443e8c32',
                            memberName: 'Agnes Owens',
                            teamId: null,
                          },
                        ],
                        title: 'Collection and Budget',
                        abbreviation: 'CAB',
                        name: 'Collection and Budget',
                        ID: '629176fc57a0318a082d517734573984',
                        titleName: 'Collection Supervisor',
                        titleId: '629176f357a0318a082d50d2',
                        memberId: '64015c5ee435600a443e8c32',
                        memberName: 'Agnes Owens',
                        teamId: null,
                      },
                    ],
                    title: 'Collection and Budget',
                    abbreviation: 'CAB',
                    name: 'Collection and Budget',
                    ID: '629176fc57a0318a082d517712312',
                    titleName: 'Collection Supervisor',
                    titleId: '629176f357a0318a082d50d2',
                    memberId: '64015c5ee435600a443e8c32',
                    memberName: 'Agnes Owens',
                    teamId: null,
                  },
                ],
                title: 'Strategy Development',
                abbreviation: 'SD',
                name: 'Strategy Development',
                ID: '629176fc57a0318a082d516b',
                titleName: 'Strategy Supervisor',
                titleId: '629176f357a0318a082d50de',
                memberId: '64015c5ee435600a443e8c13',
                memberName: 'Kyan Mooney',
                teamId: null,
              },
              {
                children: [],
                title: 'Price and Competition Analysis',
                abbreviation: 'PACA',
                name: 'Price and Competition Analysis',
                ID: '629176fc57a0318a082d516e',
                titleName: 'Bidding Supervisor',
                titleId: '629176f857a0318a082d5144',
                memberId: '64015c5ee435600a443e8c27',
                memberName: 'Remi Conner',
                teamId: null,
              },
              {
                children: [],
                title: 'Commercial Project Bidding',
                abbreviation: 'CPB',
                name: 'Commercial Project Bidding',
                ID: '629176ff57a0318a082d51b5',
                titleName: 'Bidding Supervisor',
                titleId: '629176f457a0318a082d50e5',
                memberId: '64015c5ee435600a443e8e3c',
                memberName: 'Judith Elliott',
                teamId: null,
              },
            ],
            title: 'Trading Department',
            abbreviation: 'TD',
            name: 'Trading Department',
            ID: '629176ff57a0318a082d51b3',
            titleName: 'Trade Manager',
            titleId: '629176f757a0318a082d5128',
            memberId: '64015c5ee435600a443e8d79',
            memberName: 'Julie Harding',
            teamId: null,
          },
        ],
        title: 'Finance Department',
        abbreviation: 'FD',
        name: 'Finance Department',
        ID: '629176fb57a0318a082d5166',
        titleName: 'Finance Director',
        titleId: '629176f857a0318a082d513c',
        memberId: '64015c5ee435600a443e8e1e',
        memberName: 'Evelyn Wall',
        teamId: null,
      },
      {
        children: [
          {
            children: [],
            title: 'Sales Support Department',
            abbreviation: 'SSD',
            name: 'Sales Support Department',
            ID: '629176ff57a0318a082d51ab',
            titleName: 'Support Manager',
            titleId: '647c860c717e9a0f80979b49',
            memberId: '64015c5ee435600a443e8cfb',
            memberName: 'Phillip Dotson',
            teamId: null,
          },
        ],
        title: 'Sales Department',
        abbreviation: 'SD',
        name: 'Sales Department',
        ID: '629176fc57a0318a082d517e',
        titleName: 'Sales Director',
        titleId: '629176f657a0318a082d5112',
        memberId: '64015c5ee435600a443e8d19',
        memberName: 'FlexyTime Yönetici',
        teamId: null,
      },
    ],
    title: 'Contoso',
    abbreviation: 'C',
    name: 'Contoso',
    ID: '629176fe57a0318a082d51a2',
    titleName: 'General Manager',
    titleId: '629176f957a0318a082d514d',
    memberId: '64015c5ee435600a443e8d02',
    memberName: 'Jamie Watkins',
    teamId: null,
  },
  {
    children: [],
    title: 'Work Group',
    abbreviation: 'WG',
    name: 'Work Group',
    ID: '66a0b15a5e7b6c08a03fd095',
    titleName: 'UnTitled',
    titleId: '629176f957a0318a082d514b',
    memberId: '',
    memberName: null,
    teamId: null,
  },
]);

const handleAddTeam = () => {
  mockData.value.push({
    children: [],
    title: 'new item',
  });
};
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

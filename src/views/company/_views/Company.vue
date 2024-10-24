<template>
  <TreeTable
    :value="newData"
    v-model:editingRows="editingRows"
    editMode="row"
    @row-edit-save="onRowEditSave"
    :pt="{
      table: { style: 'min-width: 50rem' },
      column: {
        bodycell: ({ state }) => ({
          style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem',
        }),
      },
    }"
  >
    <Column field="title" header="Title" :expander="true"></Column>
    <Column field="MemberName" header="MemberName"></Column>
    <Column field="TitleName" header="TitleName">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" fluid />
      </template>
    </Column>
    <Column style="width: 10rem" :rowEditor="true">
      <!-- <Button type="button" icon="pi pi-pencil" outlined severity="info" /> -->
      <!-- <Button type="button" icon="pi pi-trash" outlined severity="danger" /> -->
    </Column>
  </TreeTable>
</template>

<script setup>
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import { ref, computed } from 'vue';
import { v4 as UUID } from 'uuid';

const products = ref();
const editingRows = ref([]);

const onRowEditSave = (event) => {
  let { newData, index } = event;

  products.value[index] = newData;
};

const nodes = ref([
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
                children: [],
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

const transformData = (node) => {
  return {
    key: UUID(),
    data: {
      title: node.title,
      Abbreviation: node.Abbreviation,
      Name: node.Name,
      ID: node.ID,
      TitleName: node.TitleName,
      TitleId: node.TitleId,
      MemberId: node.MemberId,
      MemberName: node.MemberName,
      TeamId: node.TeamId,
    },
    children: node.children ? node?.children?.map(transformData) : [],
  };
};

const newData = computed(() => {
  return nodes.value.map(transformData);
});
</script>

<template>
  <Card>
    <template #content>
      <div class="w-full flex justify-end">
        <Button @click="toggleApplications" label="Toggle All" />
      </div>
      <TreeTable
        v-model:expandedKeys="expandedKeys"
        :value="personData"
        tableStyle="min-width: 50rem"
      >
        <Column v-for="col of columns" :key="col.field" :field="col.field" :expander="col.expander">
          <template #header>
            <div class="flex flex-col gap-3 justify-center items-center">
              <div>{{ col.header.title }}</div>
              <div class="font-medium">{{ col.header.subTitle }}</div>
            </div>
          </template>
        </Column>
      </TreeTable>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';
import dayjs from 'dayjs';

type THeaderData = {
  title: string;
  subTitle: string;
};

interface IProps {
  headerData: THeaderData[];
}

const props = defineProps<IProps>();

const timeManagementsStore = useTimesheetsTimeManagementsStore();

const expandedKeys = ref({});
const isOpen = ref(false);


const testData = computed(() => {
    const dateRage = timeManagementsStore.dateRange;
    return generateDateRange(dateRage[0], dateRage[1]);
});

const columns = computed(() => {
  const keys = ['title', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
  const headers = testData.value;
  return keys.map((key, index) => ({
    field: key,
    header: {
      title: headers[index - 1]?.title,
      subTitle: headers[index - 1]?.subTitle,
    },
    expander: key === 'title',
  }));
});

const personData = computed(() => {
  if (!timeManagementsStore.personList?.length) return [];
  return timeManagementsStore.personList.map((person, idx) => {
    const days = person.Days;
    const name = person.Name;
    const children = person.Children;
    const keys = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    return {
      key: idx.toString(),
      data: {
        title: name,
        ...days.reduce((acc, time, index) => {
          acc[keys[index]] = time;
          return acc;
        }, {}),
      },
      children: children.map((child, index) => {
        return {
          key: `${idx}-${index}`,
          data: {
            title: child.Name,
            ...child.Days.reduce((acc, time, index) => {
              acc[keys[index]] = time;
              return acc;
            }, {}),
          },
        };
      }),
    };
  });
});

const toggleApplications = () => {
  let _expandedKeys = { ...expandedKeys.value };
  if (!isOpen.value) {
    personData.value.forEach((element, idx) => {
      _expandedKeys[idx] = true;
    });
  } else {
    personData.value.forEach((element, idx) => {
      delete _expandedKeys[idx];
    });
  }
  isOpen.value = !isOpen.value;
  expandedKeys.value = _expandedKeys;
};

const generateDateRange = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  
  return Array.from({ length: end.diff(start, 'day') + 1 }, (_, i) => {
    const currentDate = start.add(i, 'day');
    return {
      title: currentDate.format('DD MMM'),
      subTitle: currentDate.format('dddd'),
    };
  });
};

watch(
  () => timeManagementsStore.personList?.length,
  (listLength) => {
    if (listLength) {
      toggleApplications();
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>

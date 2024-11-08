<template>
  <div class="flex w-full justify-between items-center flex-col lg:flex-row gap-4">
    <Tabs :value="route.meta.name?.toString()!" class="w-fit h-fit">
      <TabList>
        <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method()">
          <span>{{ tab.label }}</span>
        </Tab>
      </TabList>
    </Tabs>
    <FDateTimePicker
      class="min-w-[15rem]"
      name="date"
      placeholder="Enter date"
      :prime-props="{
        showTime: false,
        hourFormat: '24',
        fluid: true,
        size: 'large',
        selectionMode: 'range',
        maxDate: maxDate,
      }"
    />
  </div>

  <TabPanels>
    <TabPanel :key="route.path" :value="route.path">
      <router-view :key="route.path" />
    </TabPanel>
  </TabPanels>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';
import { useForm } from 'vee-validate';
import { array, string, object } from 'yup';
import dayjs from 'dayjs';

const timeManagementsStore = useTimesheetsTimeManagementsStore();
const route = useRoute();
const router = useRouter();

const startDate = '11/01/2024';
const endDate = '11/07/2024';

const maxDate = ref(new Date());
const items = ref([
  {
    route: ERouteNames.TimeManagementPerson,
    label: ERouteNames.TimeManagementPerson,
    method: () => {
      router.push({ name: ERouteNames.TimeManagementPerson });
    },
  },
  {
    route: ERouteNames.TimeManagementProject,
    label: ERouteNames.TimeManagementProject,
    method: () => {
      router.push({ name: ERouteNames.TimeManagementProject });
    },
  },
]);

const validationSchema = object({
  date: array().label('Date').of(string()),
});

const { resetForm, defineField } = useForm({
  validationSchema,
});

const [date] = defineField('date');


watch(
  () => date.value,
  (dates) => {
    if (dates && dates.length > 0) {
      const startDate = dayjs(dates[0]);
      maxDate.value = startDate.add(1, 'week').subtract(1, 'day').toDate();
    }
  },
  { immediate: true },
);

watch(
  () => route.meta.name,
  (name) => {
    // TODO: burda payload'ı yollarken startDate ve endDate'i de yollamak gerekebilir. onu da datePicker'dan alman gerekir. şu an datePicker'a göre almıyor
    if (name === ERouteNames.TimeManagementPerson) {
      timeManagementsStore.filterPerson([startDate, endDate]);
    } else if (name === ERouteNames.TimeManagementProject) {
      timeManagementsStore.filterProject();
    }
  },
  { immediate: true },
);

onMounted(() => {
  resetForm({
    values: {
      // TODO: burda initial value verirken problem var. Bunları date formatları değiştirdiğinde gözden geçirmen gerekebilir
      // date: [startDate, endDate],
    },
  });
});
</script>

<style></style>

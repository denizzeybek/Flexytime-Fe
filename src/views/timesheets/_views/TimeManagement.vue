<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <div class="flex w-full justify-between items-center flex-col lg:flex-row gap-5 mb-6 pb-5">
        <Tabs :value="route.name?.toString()!" class="w-fit h-fit">
          <TabList>
            <Tab v-for="(tab, idx) in items" :key="idx" :value="tab.route" @click="tab.method">
              <span class="font-medium">{{ t(tab.labelKey) }}</span>
            </Tab>
          </TabList>
        </Tabs>
        <div class="flex gap-3">
          <FDateTimePicker
            class="min-w-[15rem]"
            name="date"
            :placeholder="t('pages.timesheets.timeManagement.datePlaceholder')"
            :showPrevNextButtons="true"
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
      </div>

      <div class="mt-1">
        <router-view :key="route.path" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRoute, useRouter } from 'vue-router';
import { useTimesheetsTimeManagementsStore } from '@/stores/timeSheets/timeManagement';
import { useForm } from 'vee-validate';
import { array, string, object } from 'yup';
import dayjs from 'dayjs';
import Card from 'primevue/card';

const { t } = useI18n<{ message: MessageSchema }>();


const timeManagementsStore = useTimesheetsTimeManagementsStore();
const route = useRoute();
const router = useRouter();

const startDate = '11/01/2024';
const endDate = '11/07/2024';

const maxDate = ref(new Date());
const items = ref([
  {
    route: ERouteNames.TimeManagementPerson,
    labelKey: 'pages.layouts.navbar.timeManagement',
    method: () => {
      router.push({ name: ERouteNames.TimeManagementPerson });
    },
  },
  {
    route: ERouteNames.TimeManagementProject,
    labelKey: 'pages.layouts.navbar.timeManagement',
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
      timeManagementsStore.setDate(dates);
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
      timeManagementsStore.filterProject([startDate, endDate]);
    }
  },
  { immediate: true },
);

onMounted(() => {
  resetForm({
    values: {
      date: [dayjs().toDate(), dayjs().add(6, 'day').toDate()],
      // TODO: burda initial value verirken problem var. Bunları date formatları değiştirdiğinde gözden geçirmen gerekebilir
      // date: [startDate, endDate],
    },
  });
});
</script>

<style></style>

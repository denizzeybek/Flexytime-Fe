<template>
  <div class="flex flex-col gap-5">
    <template v-for="(field, idx) in fields" :key="field.key">
      <Card class="shadow-md border border-gray-100 rounded-xl hover:shadow-lg transition-shadow">
        <template #content>
          <form class="space-y-5" @submit="submitHandler">
            <div class="w-full flex items-center gap-4 flex-col lg:flex-row">
              <div class="flex w-full">
                <FInput
                  :name="`timeEntries[${idx}].timeEntry`"
                  class="flex-1"
                  customClass="unstyled"
                  :placeholder="t('pages.timesheets.enteredTimes.timeEntry.placeholder')"
                  list="timeEntryOptions"
                  unstyled
                  :datalistOptions="timeEntryOptions"
                  @updateList="timeEntryOptions.push($event)"
                />
              </div>
              <div class="flex items-center gap-4 w-full justify-between lg:justify-end">
                <!-- todo:: buton on change'i değiştir -->
                <Button
                  type="button"
                  icon="pi pi-dollar"
                  severity="success"
                  :outlined="!field.value.isBillable"
                  @click="isBillable = !isBillable"
                />
                <div v-show="isManualLayout(field.value.type)" class="flex gap-4">
                  <div class="flex items-center gap-1">
                    <FInput
                      :name="`timeEntries[${idx}].startTime`"
                      customClass="unstyled time-input"
                      :placeholder="t('pages.timesheets.enteredTimes.timeInput.placeholder')"
                      :transformValue="transformTimeValue"
                      unstyled
                    />
                    <span>-</span>
                    <FInput
                      :name="`timeEntries[${idx}].endTime`"
                      customClass="unstyled time-input"
                      :placeholder="t('pages.timesheets.enteredTimes.timeInput.placeholder')"
                      :transformValue="transformTimeValue"
                      unstyled
                    />
                  </div>
                  <!-- todo:: date'i initial set ederken formatla -->
                </div>
                <FDateTimePicker
                  :name="`timeEntries[${idx}].date`"
                  :numberOfMonths="1"
                  :prime-props="{
                    hourFormat: '24',
                    fluid: true,
                  }"
                />
                <FText
                  v-if="isManualLayout(field.value.type)"
                  id="timeDifference"
                  as="h5"
                  :innerText="field.value.timeDifference"
                />
                <FText v-else id="ongoingTime" as="h5" :innerText="field.value.elapsedTime" />

                <div class="flex flex-col gap-2 justify-center items-center">
                  <Button
                    v-if="isTimerLayout(field.value.type)"
                    icon="pi pi-clock"
                    outlined
                    unstyled
                    type="button"
                    class="w-fit text-f-success"
                    :v-tooltip.top="t('pages.timesheets.enteredTimes.layoutButtons.timer')"
                  />
                  <Button
                    v-else
                    icon="pi pi-list"
                    outlined
                    unstyled
                    type="button"
                    class="w-fit text-f-success"
                    :v-tooltip.top="t('pages.timesheets.enteredTimes.layoutButtons.manual')"
                  />
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4 w-full">
              <FSelect
                :name="`timeEntries[${idx}].project`"
                :placeholder="t('pages.timesheets.enteredTimes.project.placeholder')"
                :options="projectOptions"
                :headerAddBtn="true"
                :prime-props="{
                  filter: true,
                }"
                @addList="console.log('addList')"
              />
              <FMultiSelect
                :name="`timeEntries[${idx}].tags`"
                class="w-full lg:w-fit"
                :placeholder="t('pages.timesheets.enteredTimes.tags.placeholder')"
                :options="tagOptions"
                :headerAddBtn="true"
                :prime-props="{
                  maxSelectedLabels: 3,
                }"
                @addList="console.log('addList')"
              />
            </div>
          </form>
        </template>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed,ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import { useFieldArray, useForm } from 'vee-validate';
import { array, object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { transformTimeValue } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';

const { t } = useI18n<{ message: MessageSchema }>();

enum ELayout {
  TIMER = 'timer',
  MANUAL = 'manual',
}

const { showSuccessMessage, showErrorMessage } = useFToast();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const timeEntryOptions = ['Lansman projesi', 'Reconcilliation', 'Settlement'];
const projectOptions = [
  {
    name: 'Clearing',
    value: 'Clearing',
  },
  {
    name: 'Productivity',
    value: 'Productivity',
  },
  {
    name: 'SAP',
    value: 'SAP',
  },
];
const tagOptions = [
  {
    name: 'Lansman',
    value: 'Lansman',
  },
  {
    name: 'Reporting',
    value: 'Reporting',
  },
  {
    name: 'Seller',
    value: 'Seller',
  },
];

const validationSchema = object({
  timeEntries: array().of(
    object().shape({
      timeEntry: string().required().label('Time entry'),
      date: string().nullable().label('Date'),
      startTime: string().nullable().label('Start Time'),
      endTime: string().nullable().label('End Time'),
      project: object()
        .shape({
          name: string().label('Name'),
          value: string().label('Value'),
        })
        .label('Project'),
      tags: array()
        .label('Tag')
        .of(
          object().shape({
            name: string().required().label('Name'),
            value: string().required().label('Value'),
          }),
        ),
    }),
  ),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<any>('timeEntries');

const isBillable = ref(false);

const getInitialFormData = computed(() => {
  return timeEntriesStore.manualTimeEntries.map((entry) => ({
    timeEntry: entry.timeEntry,
    date: dayjs(entry.date).toDate(),
    startTime: entry.startTime,
    endTime: entry.endTime,
    project: entry.project,
    tags: entry.tags,
    isBillable: entry.isBillable,
    elapsedTime: entry.elapsedTime,
    type: entry.type,
    timeDifference: entry.timeDifference,
  }));
});

const isManualLayout = (activeLayout: ELayout) => {
  return activeLayout === ELayout.MANUAL;
};
const isTimerLayout = (activeLayout: ELayout) => {
  return activeLayout === ELayout.TIMER;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.timesheets.enteredTimes.messages.success'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

watch(
  () => timeEntriesStore.manualTimeEntries,
  () => {
    resetForm({
      values: {
        timeEntries: getInitialFormData.value,
      },
    });
  },
  {
    immediate: true,
  },
);
</script>

<style scoped></style>

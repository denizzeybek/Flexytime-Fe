<template>
  <div>
    <Card class="shadow-md border border-gray-100 rounded-xl">
      <template #content>
        <form @submit="submitHandler" class="space-y-5">
          <div class="w-full flex items-center gap-4 flex-col lg:flex-row">
            <div class="flex w-full">
              <FInput
                name="timeEntry"
                class="flex-1"
                customClass="unstyled"
                placeholder="What are you working on?"
                list="timeEntryOptions"
                unstyled
                :datalistOptions="timeEntryOptions"
                @updateList="timeEntryOptions.push($event)"
              />
            </div>
            <div class="flex items-center gap-4 w-full justify-between lg:justify-end">
              <Button
                @click="isBillable = !isBillable"
                type="button"
                icon="pi pi-dollar"
                severity="success"
                :outlined="isBillable"
              />
              <div v-show="isManualLayout" class="flex gap-4">
                <div class="flex items-center gap-1">
                  <FInput
                    name="startTime"
                    customClass="unstyled time-input"
                    placeholder="00:00"
                    :transformValue="transformTimeValue"
                    unstyled
                  />
                  <span>-</span>
                  <FInput
                    name="endTime"
                    customClass="unstyled time-input"
                    placeholder="00:00"
                    :transformValue="transformTimeValue"
                    unstyled
                  />
                </div>

                <FDateTimePicker
                  name="date"
                  :numberOfMonths="1"
                  :prime-props="{
                    hourFormat: '24',
                    fluid: true,
                  }"
                />
              </div>
              <FText
                v-if="isManualLayout"
                id="timeDifference"
                as="h5"
                :innerText="timeDifference"
              />
              <FText v-else id="ongoingTime" as="h5" :innerText="formattedElapsedTime" />
              <Button
                v-if="isTimerLayout"
                :severity="!isRunning ? 'info' : 'danger'"
                @click.stop="isRunning ? stopTimer() : startTimer()"
                :label="!isRunning ? 'START' : 'STOP'"
                :type="isRunning ? 'button' : 'submit'"
              />
              <Button v-if="isManualLayout" severity="info" label="ADD" type="submit" />
              <div class="flex flex-col gap-2 justify-center items-center">
                <Button
                  @click="activeLayout = ELayout.TIMER"
                  icon="pi pi-clock"
                  :class="isTimerLayout ? 'text-f-success' : 'text-f-black'"
                  outlined
                  unstyled
                  type="button"
                  class="w-fit"
                  v-tooltip.top="'Timer'"
                />
                <Button
                  @click="activeLayout = ELayout.MANUAL"
                  icon="pi pi-list"
                  :class="isManualLayout ? 'text-f-success' : 'text-f-black'"
                  outlined
                  unstyled
                  type="button"
                  class="w-fit"
                  v-tooltip.top="'Manual'"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4 w-full">
            <FSelect
              name="project"
              placeholder="Select project"
              :options="projectOptions"
              :headerAddBtn="true"
              :prime-props="{
                filter: true,
              }"
              @addList="console.log('addList')"
            />
            <FMultiSelect
              name="tags"
              class="w-full lg:w-fit"
              placeholder="Select tag(s)"
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
  </div>
</template>

<script setup lang="ts">
import { useFToast } from '@/composables/useFToast';
import { calculateTimeDifference, transformTimeValue } from '@/helpers/utils';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch, computed } from 'vue';
import { array, object, string } from 'yup';
import { useTimer } from '../../_composables/useTimer';
import dayjs from 'dayjs';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';


const { showSuccessMessage, showErrorMessage } = useFToast();
const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { isRunning, formattedElapsedTime, startTimer, stopTimer, resetTimer } = useTimer();

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

const activeLayout = ref(ELayout.TIMER);
const isBillable = ref(false);
const timeDifference = ref('');

const isManualLayout = computed(() => activeLayout.value === ELayout.MANUAL);
const isTimerLayout = computed(() => activeLayout.value === ELayout.TIMER);

const validationSchema = object({
  timeEntry: string().required().label('Time entry'),
  date: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('Date'),
  startTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('Start Time'),
  endTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('End Time'),
  project: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .label('Project'),
  tags: array()
    .label('Tags')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
});

const { handleSubmit, resetForm, defineField } = useForm({
  validationSchema,
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = {
      ...values,
      isBillable: isBillable.value,
      elapsedTime: formattedElapsedTime.value,
      timeDifference: timeDifference.value,
      type: activeLayout.value,
      date: isTimerLayout.value ? dayjs().toDate() : values.date,
    };
    timeEntriesStore.addManualTimeEntries(payload);
    showSuccessMessage('Time entry entered!');

    if (activeLayout.value === ELayout.TIMER) {
      resetTimer();
    }
    resetForm();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

watch(
  [startTime, endTime],
  ([newStartTime, newEndTime]) => {
    if (newStartTime && newEndTime) {
      timeDifference.value = calculateTimeDifference(newStartTime, newEndTime);
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  resetForm({
    values: {
      startTime: dayjs().subtract(10, 'minute').format('HH:mm'),
      endTime: dayjs().format('HH:mm'),
      date: dayjs().toDate(),
    },
  });
});
</script>

<style scoped></style>

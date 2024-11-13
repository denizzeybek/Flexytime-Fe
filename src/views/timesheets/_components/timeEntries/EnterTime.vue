<template>
  <div>
    <Card>
      <template #content>
        <form @submit="submitHandler">
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
              <div v-show="activeLayout === ELayout.MANUAL" class="flex gap-4">
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
                v-if="activeLayout === ELayout.MANUAL"
                id="timeDifference"
                as="h5"
                :innerText="timeDifference"
              />
              <FText v-else id="ongoingTime" as="h5" :innerText="formattedElapsedTime" />
              <Button
                v-if="activeLayout === ELayout.TIME"
                :severity="!isRunning ? 'info' : 'danger'"
                @click.stop="isRunning ? stopTimer() : startTimer()"
                :label="!isRunning ? 'START' : 'STOP'"
                :type="isRunning ? 'button' : 'submit'"
              />
              <Button
                v-if="activeLayout === ELayout.MANUAL"
                severity="info"
                label="ADD"
                type="submit"
              />
              <div class="flex flex-col gap-2 justify-center items-center">
                <Button
                  @click="activeLayout = ELayout.TIME"
                  icon="pi pi-clock"
                  :class="activeLayout === ELayout.TIME ? 'text-f-success' : 'text-f-black'"
                  outlined
                  unstyled
                  type="button"
                  class="w-fit"
                  v-tooltip.top="'Timer'"
                />
                <Button
                  @click="activeLayout = ELayout.MANUAL"
                  icon="pi pi-list"
                  :class="activeLayout === ELayout.MANUAL ? 'text-f-success' : 'text-f-black'"
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
import { onMounted, ref, watch } from 'vue';
import { array, object, string } from 'yup';
import { useTimer } from '../../_composables/useTimer';
import dayjs from 'dayjs';

enum ELayout {
  TIME = 'time',
  MANUAL = 'manual',
}

const { showSuccessMessage, showErrorMessage } = useFToast();
const { isRunning, formattedElapsedTime, startTimer, stopTimer, resetTimer } = useTimer();

const timeEntryOptions = ['asdasd', 'fffff', 'ccccc'];
const projectOptions = [
  {
    name: 'Eclone',
    value: 'eclone',
  },
  {
    name: 'Ruuul',
    value: 'ruul',
  },
  {
    name: 'Flexytime',
    value: 'flexytime',
  },
];
const tagOptions = [
  {
    name: 'Eclone',
    value: 'eclone',
  },
  {
    name: 'Ruuul',
    value: 'ruul',
  },
  {
    name: 'Flexytime',
    value: 'flexytime',
  },
];

const activeLayout = ref(ELayout.TIME);
const isBillable = ref(false);
const timeDifference = ref('');

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
  teams: array()
    .label('Team')
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
    console.log('values ', values);
    showSuccessMessage('Time entry entered!');
    if (activeLayout.value === ELayout.TIME) {
      resetTimer();
      resetForm();
    }
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

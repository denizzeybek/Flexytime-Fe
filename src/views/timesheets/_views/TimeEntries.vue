<template>
  <div>
    <Card>
      <template #content>
        <form @submit="submitHandler">
          <div class="w-full flex items-center gap-4">
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
            <Button
              @click="isBillable = !isBillable"
              type="button"
              icon="pi pi-dollar"
              severity="success"
              :outlined="isBillable"
            />
            <template v-if="activeLayout === ELayout.MANUAL">
              <div class="flex items-center gap-1">
                <FInput
                  name="startTime"
                  customClass="unstyled time-input"
                  placeholder="00:00"
                  :transformValue="transformValue"
                  unstyled
                />
                <span>-</span>
                <FInput
                  name="endTime"
                  customClass="unstyled time-input"
                  placeholder="00:00"
                  :transformValue="transformValue"
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
            </template>
            <FText as="h5" :innerText="timeDifference" />
            <Button
              v-if="activeLayout === ELayout.TIME"
              :severity="!isStarted ? 'info' : 'danger'"
              @click.stop="isStarted = true"
              :label="!isStarted ? 'START' : 'STOP'"
              :type="!isStarted ? 'button' : 'submit'"
            />
            <Button
              v-if="activeLayout === ELayout.MANUAL"
              severity="info"
              label="ADD"
              type="submit"
            />
            <div class="flex flex-col gap-2">
              <Button
                @click="activeLayout = ELayout.TIME"
                icon="pi pi-clock"
                :class="activeLayout === ELayout.TIME ? 'text-f-success' : 'text-f-black'"
                outlined
                unstyled
                type="button"
              />
              <Button
                @click="activeLayout = ELayout.MANUAL"
                icon="pi pi-list"
                :class="activeLayout === ELayout.MANUAL ? 'text-f-success' : 'text-f-black'"
                outlined
                unstyled
                type="button"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <FSelect
              name="project"
              placeholder="Select project"
              :options="projectOptions"
              :footerAddBtn="true"
              :prime-props="{
                filter: true,
              }"
              @addList="console.log('addList')"
            />
            <FMultiSelect
              name="tags"
              placeholder="Select tag(s)"
              :options="tagOptions"
              :footerAddBtn="true"
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
import { onMounted, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

enum ELayout {
  TIME = 'time',
  MANUAL = 'manual',
}

const { showSuccessMessage, showErrorMessage } = useFToast();

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

const activeLayout = ref(ELayout.MANUAL);
const isBillable = ref(false);
const isStarted = ref(false);
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

const { handleSubmit, isSubmitting, values, resetForm, defineField } = useForm({
  validationSchema,
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Time entry entered!');
    if (activeLayout.value === ELayout.TIME) {
      isStarted.value = false;
    }
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const transformValue = (event: InputEvent): string | null => {
  const input = (event.target as HTMLInputElement).value.trim();

  if (/^\d{4}$/.test(input)) {
    const hours = input.slice(0, 2);
    const minutes = input.slice(2, 4);
    const time = dayjs().hour(parseInt(hours, 10)).minute(parseInt(minutes, 10)).second(0);
    if (time.isValid() && time.hour() < 24 && time.minute() < 60) {
      return time.format('HH:mm');
    }
  }
  return null;
};

const calculateTimeDifference = (start: string, end: string): string => {
  if (!start || !end) return 'Zaman değerleri eksik';

  const today = dayjs().format('YYYY-MM-DD'); // Bugünün tarihi
  
  // Start ve End zamanlarını geçerli bir tarih ile oluşturuyoruz
  const startMoment = dayjs(`${today} ${start}`, 'YYYY-MM-DD HH:mm');
  const endMoment = dayjs(`${today} ${end}`, 'YYYY-MM-DD HH:mm');

  if (!startMoment.isValid() || !endMoment.isValid()) {
    return 'Geçersiz zaman formatı';
  }
  const diff = endMoment.diff(startMoment);
  const diffDuration = dayjs.duration(diff);
  return diffDuration.format('HH:mm:ss');
};

// startTime ve endTime değiştiğinde izleyici
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
      startTime: dayjs().format('HH:mm'),
      endTime: dayjs().format('HH:mm'),
    },
  });
});
</script>

<style scoped></style>

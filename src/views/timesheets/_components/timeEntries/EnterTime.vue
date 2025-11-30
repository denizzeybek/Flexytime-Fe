<template>
  <div>
    <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-visible">
      <template #content>
        <form @submit="submitHandler">
          <!-- Main Input Row -->
          <div class="flex flex-col gap-5">
            <!-- Task Input with Timer Display -->
            <div class="flex flex-col lg:flex-row gap-4">
              <!-- Task Name Input -->
              <div class="flex-1 relative">
                <div
                  class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent focus-within:border-f-primary focus-within:bg-white transition-all duration-200"
                >
                  <i class="pi pi-pencil text-gray-400" />
                  <FInput
                    name="taskName"
                    class="flex-1"
                    customClass="unstyled"
                    :placeholder="t('pages.timesheets.enterTime.timeEntry.placeholder')"
                    list="taskOptions"
                    unstyled
                    :datalistOptions="taskOptions"
                    :onAddOption="handleAddTask"
                  />
                </div>
              </div>

              <!-- Timer/Manual Controls -->
              <div class="flex items-center gap-3">
                <!-- Billable Toggle -->
                <button
                  v-tooltip.top="isBillable ? 'Billable' : 'Not Billable'"
                  type="button"
                  class="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                  :class="
                    isBillable
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  "
                  @click="isBillable = !isBillable"
                >
                  <i class="pi pi-dollar text-lg" />
                </button>

                <!-- Manual Time Inputs -->
                <Transition name="slide-fade">
                  <div v-if="isManualLayout" class="flex items-center gap-3">
                    <!-- Time Range -->
                    <div
                      class="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border-2 border-transparent focus-within:border-f-primary focus-within:bg-white transition-all"
                    >
                      <i class="pi pi-clock text-gray-400 text-sm" />
                      <FInput
                        name="startTime"
                        customClass="unstyled time-input"
                        :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
                        :transformValue="transformTimeValue"
                        unstyled
                      />
                      <span class="text-gray-300">-</span>
                      <FInput
                        name="endTime"
                        customClass="unstyled time-input"
                        :placeholder="t('pages.timesheets.enterTime.timeInput.placeholder')"
                        :transformValue="transformTimeValue"
                        unstyled
                      />
                    </div>

                    <!-- Date Picker -->
                    <div class="bg-gray-50 rounded-xl border-2 border-transparent focus-within:border-f-primary">
                      <FDateTimePicker
                        name="date"
                        :numberOfMonths="1"
                        :prime-props="{
                          hourFormat: '24',
                          fluid: true,
                        }"
                      />
                    </div>
                  </div>
                </Transition>

                <!-- Time Display -->
                <div
                  class="min-w-[100px] h-11 px-4 rounded-xl flex items-center justify-center font-mono text-lg font-bold transition-all duration-200"
                  :class="
                    isRunning
                      ? 'bg-f-primary/10 text-f-primary animate-pulse'
                      : isManualLayout
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{ isManualLayout ? timeDifference || '00:00' : formattedElapsedTime }}
                </div>

                <!-- Action Button -->
                <Button
                  v-if="isTimerLayout"
                  :severity="!isRunning ? 'info' : 'danger'"
                  type="button"
                  class="h-11 px-6 rounded-xl font-semibold transition-all duration-200"
                  :class="isRunning ? 'animate-pulse' : ''"
                  @click="isRunning ? handleStop() : handleStart()"
                >
                  <i :class="!isRunning ? 'pi pi-play' : 'pi pi-stop'" class="mr-2" />
                  {{ !isRunning ? t('common.buttons.start') : t('common.buttons.stop') }}
                </Button>
                <Button
                  v-if="isManualLayout"
                  severity="info"
                  type="submit"
                  class="h-11 px-6 rounded-xl font-semibold"
                >
                  <i class="pi pi-plus mr-2" />
                  {{ t('common.buttons.add') }}
                </Button>

                <!-- Layout Toggle -->
                <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
                  <button
                    v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.timer')"
                    type="button"
                    class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                    :class="
                      isTimerLayout ? 'bg-white text-f-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    "
                    @click="activeLayout = ELayout.TIMER"
                  >
                    <i class="pi pi-clock" />
                  </button>
                  <button
                    v-tooltip.top="t('pages.timesheets.enterTime.layoutButtons.manual')"
                    type="button"
                    class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                    :class="
                      isManualLayout ? 'bg-white text-f-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    "
                    @click="activeLayout = ELayout.MANUAL"
                  >
                    <i class="pi pi-list" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Project & Tags Row -->
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="flex-1">
                <FSelect
                  name="project"
                  :placeholder="t('pages.timesheets.enterTime.project.placeholder')"
                  :options="projectOptions"
                  :headerAddBtn="true"
                  :prime-props="{
                    filter: true,
                  }"
                />
              </div>
              <div class="flex-1">
                <FMultiSelect
                  name="tags"
                  :placeholder="t('pages.timesheets.enterTime.tags.placeholder')"
                  :options="tagOptions"
                  :headerAddBtn="true"
                  :prime-props="{
                    maxSelectedLabels: 3,
                  }"
                />
              </div>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import Card from 'primevue/card';
import { useForm } from 'vee-validate';
import { array, object, string } from 'yup';

import { TimesheetApiService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import { calculateTimeDifference, transformTimeValue } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';

import type { TimeEntryModifyViewModel } from '@/client';

interface ITagOption {
  name: string;
  value: string;
}

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

// Use store getters for options (computed from store state)
const taskOptions = computed(() => timeEntriesStore.taskNames);
const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);

// Handle adding new task from input dropdown
const handleAddTask = async (taskName: string) => {
  await timeEntriesStore.saveTask(taskName);
};

// Timer state
const elapsedTime = ref(0);
const isRunning = ref(false);
let timerInterval: ReturnType<typeof setInterval> | null = null;
let timerStartTime: Date | null = null;

const formattedElapsedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((elapsedTime.value % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedTime.value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

const validationSchema = object({
  taskName: string().required().label('Task'),
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
    .nullable()
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

const { handleSubmit, resetForm, defineField, values } = useForm({
  validationSchema,
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

const activeLayout = ref(ELayout.TIMER);
const isBillable = ref(false);
const timeDifference = ref('');

const isManualLayout = computed(() => activeLayout.value === ELayout.MANUAL);
const isTimerLayout = computed(() => activeLayout.value === ELayout.TIMER);

const startTimer = () => {
  if (!isRunning.value) {
    isRunning.value = true;
    timerStartTime = new Date();
    timerInterval = setInterval(() => {
      elapsedTime.value += 1;
    }, 1000);
  }
};

const stopTimer = () => {
  if (isRunning.value) {
    isRunning.value = false;
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
};

const resetTimer = () => {
  stopTimer();
  elapsedTime.value = 0;
  timerStartTime = null;
};

const handleStart = () => {
  startTimer();
};

const handleStop = async () => {
  stopTimer();
  // Auto-submit when stopping the timer - use the same submitHandler as manual
  if (elapsedTime.value > 0 && values.taskName) {
    await submitHandler();
  }
};

const formatElapsedTimeForPayload = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const getOrCreateTask = async (taskName: string): Promise<{ ID?: string; Name: string }> => {
  // Check if task already exists in store
  const existingTask = timeEntriesStore.getTaskByName(taskName);
  if (existingTask) {
    return { ID: existingTask.ID, Name: existingTask.Name ?? taskName };
  }

  // Save new task via store
  const newTask = await timeEntriesStore.saveTask(taskName);
  if (newTask) {
    return { ID: newTask.ID, Name: newTask.Name ?? taskName };
  }

  // Fallback: return without ID if save failed
  return { Name: taskName };
};

const submitHandler = handleSubmit(async (formValues) => {
  try {
    const dateFormat = 'DD.MM.YYYY HH:mm';
    const selectedDate = formValues.date ? dayjs(formValues.date) : dayjs();

    let startDateTime: string;
    let endDateTime: string;
    let recordDate: string;

    if (isManualLayout.value) {
      // Manual mode: combine selected date with time inputs
      const startDayjs = selectedDate.format('DD.MM.YYYY') + ' ' + formValues.startTime;
      const endDayjs = selectedDate.format('DD.MM.YYYY') + ' ' + formValues.endTime;
      startDateTime = startDayjs;
      endDateTime = endDayjs;
      recordDate = startDayjs;
    } else {
      // Timer mode - use same format as manual (no seconds in date, backend calculates from time field)
      const now = dayjs();
      const start = timerStartTime ? dayjs(timerStartTime) : now.subtract(elapsedTime.value, 'second');
      startDateTime = start.format(dateFormat);
      endDateTime = now.format(dateFormat);
      recordDate = start.format(dateFormat);
    }

    // Get or create task
    const task = formValues.taskName ? await getOrCreateTask(formValues.taskName) : undefined;

    // Calculate time for payload - backend expects format like "HH:mm:ss:00"
    const timeValue = isManualLayout.value
      ? (timeDifference.value ? timeDifference.value + ':00' : '00:00:00:00')
      : formatElapsedTimeForPayload(elapsedTime.value) + ':00';

    const payload = {
      Task: task,
      Project: formValues.project ? { ID: formValues.project.value, Name: formValues.project.name } : undefined,
      Tags: formValues.tags?.map((tag: ITagOption) => ({ ID: tag.value, Name: tag.name })) ?? [],
      Billable: isBillable.value,
      RecordDate: recordDate,
      RecordDateCustom: '',
      StartDate: startDateTime,
      EndDate: endDateTime,
      time: timeValue,
      Member: { ID: null, Name: '' },
      Clocks: [],
    };

    await TimesheetApiService.timesheetApiSaveTimeEntry(payload as unknown as TimeEntryModifyViewModel);
    await timeEntriesStore.fetchTimeEntries();

    showSuccessMessage(t('pages.timesheets.enterTime.messages.success'));

    if (activeLayout.value === ELayout.TIMER) {
      resetTimer();
    }
    resetForm();
  } catch (error: unknown) {
    showErrorMessage(error as Error);
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
  // Fetch options from store
  timeEntriesStore.fetchOptions();
  resetForm({
    values: {
      startTime: dayjs().subtract(10, 'minute').format('HH:mm'),
      endTime: dayjs().format('HH:mm'),
      date: dayjs().toDate(),
    },
  });
});

onUnmounted(() => {
  // Clean up timer on component unmount
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

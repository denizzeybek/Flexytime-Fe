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
              <TaskNameInput :task-options="taskOptions" :on-add-task="handleAddTask" />

              <!-- Timer/Manual Controls -->
              <TimerControls
                v-model:is-billable="isBillable"
                v-model:active-layout="activeLayoutString"
                :is-running="isRunning"
                :is-timer-layout="isTimerLayout"
                :is-manual-layout="isManualLayout"
                :display-time="displayTime"
                @start="handleStart"
                @stop="handleStop"
              >
                <template #manualInputs>
                  <ManualTimeInputs :visible="isManualLayout" />
                </template>
              </TimerControls>
            </div>

            <!-- Project & Tags Row -->
            <ProjectTagSelectors
              :project-options="projectOptions"
              :tag-options="tagOptions"
              @add-project="handleAddProject"
              @add-tag="handleAddTag"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import dayjs from 'dayjs';
import Card from 'primevue/card';
import { useForm } from 'vee-validate';
import { array, object, string } from 'yup';

import { TimesheetApiService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import { calculateTimeDifference } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import ManualTimeInputs from '@/views/timesheets/_components/timeEntries/_components/ManualTimeInputs.vue';
import ProjectTagSelectors from '@/views/timesheets/_components/timeEntries/_components/ProjectTagSelectors.vue';
import TaskNameInput from '@/views/timesheets/_components/timeEntries/_components/TaskNameInput.vue';
import TimerControls from '@/views/timesheets/_components/timeEntries/_components/TimerControls.vue';
import { useEnterTimeTimer } from '@/views/timesheets/_composables/useEnterTimeTimer';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';

import type { TimeClockViewModel, TimeEntryModifyViewModel } from '@/client';

interface ITagOption {
  name: string;
  value: string;
}

// Extended type for time entry payload - backend expects additional fields not in OpenAPI spec
// TODO: Update OpenAPI spec to include these fields
interface TimeEntryPayload extends TimeEntryModifyViewModel {
  RecordDate?: string;
  RecordDateCustom?: string;
  time?: string;
  Member?: { ID: string | null; Name: string };
  Clocks?: TimeClockViewModel[];
}

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

// Timer composable
const {
  elapsedTime,
  isRunning,
  formattedElapsedTime,
  startTimer,
  stopTimer,
  resetTimer,
  getTimerStartTime,
  formatElapsedTimeForPayload,
} = useEnterTimeTimer();

// Store computed options
const taskOptions = computed(() => timeEntriesStore.taskNames);
const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);

// Handle adding new task from input dropdown
const handleAddTask = async (taskName: string) => {
  await timeEntriesStore.saveTask(taskName);
};

// Handle adding new project
const handleAddProject = async (projectName: string) => {
  try {
    const newProject = await timeEntriesStore.saveProject(projectName);
    showSuccessMessage(t('pages.timesheets.enterTime.project.addSuccess'));
    // Select the newly added project
    if (newProject?.ID && newProject?.Name) {
      setFieldValue('project', { name: newProject.Name, value: newProject.ID });
    }
  } catch {
    showErrorMessage(t('pages.timesheets.enterTime.project.addError'));
  }
};

// Handle adding new tag
const handleAddTag = async (tagName: string) => {
  try {
    const newTag = await timeEntriesStore.saveTag(tagName);
    showSuccessMessage(t('pages.timesheets.enterTime.tags.addSuccess'));
    // Add the newly created tag to existing tags selection
    if (newTag?.ID && newTag?.Name) {
      const currentTags = (values.tags as ITagOption[]) || [];
      setFieldValue('tags', [...currentTags, { name: newTag.Name, value: newTag.ID }]);
    }
  } catch {
    showErrorMessage(t('pages.timesheets.enterTime.tags.addError'));
  }
};

// Form validation schema
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

const { handleSubmit, resetForm, defineField, values, setFieldValue } = useForm({
  validationSchema,
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

// Layout state
const activeLayout = ref(ELayout.TIMER);
const isBillable = ref(false);
const timeDifference = ref('');

// Computed for v-model binding (string version for component)
const activeLayoutString = computed({
  get: () => (activeLayout.value === ELayout.TIMER ? 'timer' : 'manual'),
  set: (val: 'timer' | 'manual') => {
    activeLayout.value = val === 'timer' ? ELayout.TIMER : ELayout.MANUAL;
  },
});

const isManualLayout = computed(() => activeLayout.value === ELayout.MANUAL);
const isTimerLayout = computed(() => activeLayout.value === ELayout.TIMER);

const displayTime = computed(() => {
  return isManualLayout.value ? timeDifference.value || '00:00' : formattedElapsedTime.value;
});

// Timer handlers
const handleStart = () => {
  startTimer();
};

const handleStop = async () => {
  stopTimer();
  // Auto-submit when stopping the timer
  if (elapsedTime.value > 0 && values.taskName) {
    await submitHandler();
  }
};

// Task helper
const getOrCreateTask = async (taskName: string): Promise<{ ID?: string; Name: string }> => {
  const existingTask = timeEntriesStore.getTaskByName(taskName);
  if (existingTask) {
    return { ID: existingTask.ID, Name: existingTask.Name ?? taskName };
  }

  const newTask = await timeEntriesStore.saveTask(taskName);
  if (newTask) {
    return { ID: newTask.ID, Name: newTask.Name ?? taskName };
  }

  return { Name: taskName };
};

// Submit handler
const submitHandler = handleSubmit(async (formValues) => {
  try {
    const dateFormat = 'DD.MM.YYYY HH:mm';
    const selectedDate = formValues.date ? dayjs(formValues.date) : dayjs();

    let startDateTime: string;
    let endDateTime: string;
    let recordDate: string;

    if (isManualLayout.value) {
      const startDayjs = selectedDate.format('DD.MM.YYYY') + ' ' + formValues.startTime;
      const endDayjs = selectedDate.format('DD.MM.YYYY') + ' ' + formValues.endTime;
      startDateTime = startDayjs;
      endDateTime = endDayjs;
      recordDate = startDayjs;
    } else {
      const now = dayjs();
      const timerStartTime = getTimerStartTime();
      const start = timerStartTime ? dayjs(timerStartTime) : now.subtract(elapsedTime.value, 'second');
      startDateTime = start.format(dateFormat);
      endDateTime = now.format(dateFormat);
      recordDate = start.format(dateFormat);
    }

    const task = formValues.taskName ? await getOrCreateTask(formValues.taskName) : undefined;

    const timeValue = isManualLayout.value
      ? (timeDifference.value ? timeDifference.value + ':00' : '00:00:00:00')
      : formatElapsedTimeForPayload(elapsedTime.value) + ':00';

    const payload: TimeEntryPayload = {
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

    await TimesheetApiService.timesheetApiSaveTimeEntry(payload);
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

// Watch time difference
watch(
  [startTime, endTime],
  ([newStartTime, newEndTime]) => {
    if (newStartTime && newEndTime) {
      timeDifference.value = calculateTimeDifference(newStartTime, newEndTime);
    }
  },
  { immediate: true },
);

// Initialize
onMounted(() => {
  timeEntriesStore.fetchOptions();
  resetForm({
    values: {
      startTime: dayjs().subtract(10, 'minute').format('HH:mm'),
      endTime: dayjs().format('HH:mm'),
      date: dayjs().toDate(),
    },
  });
});
</script>

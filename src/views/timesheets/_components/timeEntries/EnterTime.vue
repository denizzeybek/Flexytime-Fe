<template>
  <div
    class="rounded-2xl border transition-all duration-500"
    :class="cardBorderClass"
    :style="{ boxShadow: cardShadow }"
  >
    <Card
      class="rounded-2xl overflow-visible !shadow-none !border-0 !bg-surface-primary"
    >
      <template #content>
        <form @submit="submitHandler">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col lg:flex-row gap-3 items-stretch">
              <TaskNameInput :task-options="taskOptions" :on-add-task="handleAddTask" />
              <ManualTimeInputs :visible="isManualLayout" />
            </div>

            <ProjectTagSelectors
              :project-options="projectOptions"
              :tag-options="tagOptions"
              @add-project="handleAddProject"
              @add-tag="handleAddTag"
            />

            <TimerControls
              v-model:is-billable="isBillable"
              v-model:active-layout="activeLayoutString"
              :is-running="isRunning"
              :is-timer-layout="isTimerLayout"
              :is-manual-layout="isManualLayout"
              :display-time="displayTime"
              @start="handleStart"
              @stop="handleStop"
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
import { array, date, object, string } from 'yup';

import { TimesheetService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import { calculateTimeDifferenceFromDates } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import ManualTimeInputs from '@/views/timesheets/_components/timeEntries/_components/ManualTimeInputs.vue';
import ProjectTagSelectors from '@/views/timesheets/_components/timeEntries/_components/ProjectTagSelectors.vue';
import TaskNameInput from '@/views/timesheets/_components/timeEntries/_components/TaskNameInput.vue';
import TimerControls from '@/views/timesheets/_components/timeEntries/_components/TimerControls.vue';
import { useEnterTimeTimer } from '@/views/timesheets/_composables/useEnterTimeTimer';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';

import type { TimeClockViewModel, TimeEntryModifyDto } from '@/client';

interface ITagOption {
  name: string;
  value: string;
}

// TODO: Update OpenAPI spec to include these fields
interface TimeEntryPayload extends TimeEntryModifyDto {
  RecordDate?: string;
  RecordDateCustom?: string;
  time?: string;
  Member?: { ID: string | null; Name: string };
  Clocks?: TimeClockViewModel[];
}

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const {
  elapsedTime,
  isRunning,
  formattedElapsedTime,
  startTimer,
  stopTimer,
  resetTimer,
  getTimerStartTime,
} = useEnterTimeTimer();

const validationSchema = computed(() =>
  object({
    taskName: string()
      .required(t('common.validation.mixed.required', { field: t('common.validation.fields.task') }))
      .label(t('common.validation.fields.task')),
    date: date()
      .when([], {
        is: () => activeLayout.value === ELayout.MANUAL,
        then: (schema) => schema.required(t('common.validation.mixed.required', { field: t('common.validation.fields.date') })),
        otherwise: (schema) => schema.nullable(),
      })
      .label(t('common.validation.fields.date')),
    startTime: date()
      .when([], {
        is: () => activeLayout.value === ELayout.MANUAL,
        then: (schema) => schema.required(t('common.validation.mixed.required', { field: t('common.validation.fields.startTime') })),
        otherwise: (schema) => schema.nullable(),
      })
      .label(t('common.validation.fields.startTime')),
    endTime: date()
      .when([], {
        is: () => activeLayout.value === ELayout.MANUAL,
        then: (schema) => schema.required(t('common.validation.mixed.required', { field: t('common.validation.fields.endTime') })),
        otherwise: (schema) => schema.nullable(),
      })
      .label(t('common.validation.fields.endTime')),
    project: object()
      .shape({
        name: string().required(t('common.validation.mixed.required', { field: t('common.validation.fields.project') })),
        value: string().required(t('common.validation.mixed.required', { field: t('common.validation.fields.project') })),
      })
      .required(t('common.validation.mixed.required', { field: t('common.validation.fields.project') }))
      .label(t('common.validation.fields.project')),
    tags: array()
      .min(1, t('common.validation.array.min', { field: t('common.validation.fields.tags'), min: 1 }))
      .required(t('common.validation.mixed.required', { field: t('common.validation.fields.tags') }))
      .label(t('common.validation.fields.tags'))
      .of(
        object().shape({
          name: string().required(t('common.validation.mixed.required', { field: t('common.validation.fields.tags') })),
          value: string().required(t('common.validation.mixed.required', { field: t('common.validation.fields.tags') })),
        }),
      ),
  })
);

const { handleSubmit, resetForm, defineField, values, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    taskName: '' as string,
    startTime: dayjs().subtract(10, 'minute').toDate(),
    endTime: dayjs().toDate(),
    date: dayjs().toDate(),
    project: undefined as { name: string; value: string } | undefined,
    tags: [] as ITagOption[],
  },
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

const activeLayout = ref(ELayout.MANUAL);
const isBillable = ref(false);
const timeDifference = ref('');

const taskOptions = computed(() => timeEntriesStore.taskNames);
const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);

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

/**
 * Border tint tracks the active mode — violet for Manual, sky for Timer.
 * Border itself is subtle; the visual weight lives in the multi-layer
 * box-shadow glow below.
 */
const cardBorderClass = computed(() =>
  isTimerLayout.value
    ? 'border-sky-300/50 dark:border-sky-400/25'
    : 'border-violet-300/50 dark:border-violet-400/25',
);

/**
 * Multi-color scattered glow around the quick-add card. Composition:
 *
 *   - Mode color (violet for Manual / sky for Timer) drives the left side
 *   - When `isBillable=true`, emerald scatters from the right (two-tone
 *     "Get it now"-style halo); otherwise the mode color spreads from both
 *     sides for a single-tone bloom.
 *   - A close-in inner shadow ties the glow to the card so it doesn't read
 *     as a free-floating halo.
 *
 * `:style` instead of class arbitrary values so Tailwind's JIT doesn't
 * have to know every combo at build time; the strings concatenate cleanly.
 */
const cardShadow = computed(() => {
  const modeRgb = isTimerLayout.value ? '14, 165, 233' : '139, 92, 246';
  const billableRgb = '16, 185, 129';
  if (isBillable.value) {
    return [
      `-34px 0 68px -10px rgba(${modeRgb}, 0.32)`,
      `34px 0 68px -10px rgba(${billableRgb}, 0.32)`,
      `0 -17px 46px -10px rgba(${modeRgb}, 0.19)`,
      `0 17px 46px -10px rgba(${billableRgb}, 0.19)`,
      `0 0 17px -5px rgba(${modeRgb}, 0.21)`,
    ].join(', ');
  }
  return [
    `-34px 0 68px -10px rgba(${modeRgb}, 0.32)`,
    `34px 0 68px -10px rgba(${modeRgb}, 0.32)`,
    `0 0 21px -5px rgba(${modeRgb}, 0.25)`,
  ].join(', ');
});

const handleAddTask = async (taskName: string) => {
  await timeEntriesStore.saveTask(taskName);
};

const handleAddProject = async (projectName: string) => {
  try {
    const newProject = await timeEntriesStore.saveProject(projectName);
    showSuccessMessage(t('pages.timesheets.enterTime.project.addSuccess'));
    if (newProject?.ID && newProject?.Name) {
      setFieldValue('project', { name: newProject.Name, value: newProject.ID });
    }
  } catch {
    showErrorMessage(t('pages.timesheets.enterTime.project.addError'));
  }
};

const handleAddTag = async (tagName: string) => {
  try {
    const newTag = await timeEntriesStore.saveTag(tagName);
    showSuccessMessage(t('pages.timesheets.enterTime.tags.addSuccess'));
    if (newTag?.ID && newTag?.Name) {
      const currentTags = (values.tags as ITagOption[]) || [];
      setFieldValue('tags', [...currentTags, { name: newTag.Name, value: newTag.ID }]);
    }
  } catch {
    showErrorMessage(t('pages.timesheets.enterTime.tags.addError'));
  }
};

const handleStart = () => {
  startTimer();
};

const handleStop = async () => {
  stopTimer();
  if (elapsedTime.value > 0 && values.taskName) {
    await submitHandler();
  }
};

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

const submitHandler = handleSubmit(async (formValues) => {
  try {
    const selectedDate = formValues.date ? dayjs(formValues.date) : dayjs();

    let startIso: string;
    let endIso: string;

    if (isManualLayout.value) {
      const startTime = formValues.startTime ? dayjs(formValues.startTime) : dayjs().startOf('day');
      const endTime = formValues.endTime ? dayjs(formValues.endTime) : startTime;
      startIso = selectedDate.hour(startTime.hour()).minute(startTime.minute()).second(0).millisecond(0).toISOString();
      endIso = selectedDate.hour(endTime.hour()).minute(endTime.minute()).second(0).millisecond(0).toISOString();
    } else {
      const now = dayjs();
      const timerStartTime = getTimerStartTime();
      const start = timerStartTime ? dayjs(timerStartTime) : now.subtract(elapsedTime.value, 'second');
      startIso = start.toISOString();
      endIso = now.toISOString();
    }

    const task = formValues.taskName ? await getOrCreateTask(formValues.taskName) : undefined;

    await TimesheetService.timesheetControllerSaveTimeEntry({
      ...(task?.ID && { TaskId: task.ID }),
      ...(formValues.project?.value && { ProjectId: formValues.project.value }),
      TagIds: formValues.tags?.map((tag: ITagOption) => tag.value) ?? [],
      Billable: isBillable.value,
      StartDate: startIso,
      EndDate: endIso,
    });
    await timeEntriesStore.refreshLastEntries();

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
      timeDifference.value = calculateTimeDifferenceFromDates(newStartTime, newEndTime);
    }
  },
  { immediate: true },
);

onMounted(() => {
  timeEntriesStore.fetchOptions();
});
</script>

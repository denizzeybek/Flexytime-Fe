<template>
  <Dialog
    v-model:visible="open"
    :header="t('pages.timesheets.timeEntries.suggestions.modal.header')"
    position="bottom"
    :modal="false"
    class="lg:!w-3/5 !w-full suggestion-convert-dialog"
    :style="{ width: '40rem' }"
    :closeOnEscape="true"
    :draggable="false"
    :closable="true"
    :dismissableMask="false"
    :pt="{
      mask: {
        class: 'suggestion-convert-mask',
        style: 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important; background: transparent !important; pointer-events: none !important;',
      },
      root: { class: 'shadow-2xl border border-border-secondary dark:border-border-primary pointer-events-auto' },
      header: { style: 'padding-bottom: 4px;' },
    }"
    @hide="emit('cancel')"
  >
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <FAvatar class="flex-shrink-0">{{ selectedItems.length }}</FAvatar>
          <FText as="h6" class="flex-shrink-0 !font-semibold">{{ t('pages.timesheets.timeEntries.suggestions.modal.itemsSelected') }}</FText>
          <div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <Tag
              v-for="name in visibleNames"
              :key="name"
              :value="name"
              severity="secondary"
              class="!text-xs !px-2 !py-0.5 truncate max-w-[120px]"
            />
            <Tag
              v-if="remainingCount > 0"
              v-tooltip.bottom="remainingNames.join('\n')"
              :value="`+${remainingCount}`"
              severity="info"
              class="!text-xs !px-2 !py-0.5 cursor-help flex-shrink-0"
            />
          </div>
        </div>
        <div class="flex flex-col items-end flex-shrink-0">
          <span class="text-[10px] text-content-tertiary uppercase tracking-wider">{{ t('pages.timesheets.timeEntries.suggestions.totalLabel') }}</span>
          <span class="text-base font-bold text-content-primary">{{ totalTime }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FSelect
          name="task"
          :placeholder="t('pages.timesheets.timeEntries.suggestions.modal.taskPlaceholder')"
          :options="taskOptions"
          :headerAddBtn="true"
          :prime-props="{ filter: true }"
        />
        <FSelect
          name="project"
          :placeholder="t('pages.timesheets.updateTimeEntriesModal.project.placeholder')"
          :options="projectOptions"
          :headerAddBtn="true"
          :prime-props="{ filter: true }"
        />
        <FMultiSelect
          name="tags"
          :placeholder="t('pages.timesheets.updateTimeEntriesModal.tags.placeholder')"
          :options="tagOptions"
          :headerAddBtn="true"
          :prime-props="{ maxSelectedLabels: 2 }"
        />
      </div>

      <div class="flex items-center justify-between gap-3 pt-2 border-t border-border-secondary dark:border-border-primary">
        <button
          type="button"
          class="h-11 px-4 rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-300"
          :class="
            isBillable
              ? 'bg-emerald-500 text-white shadow-[0_0_24px_-2px_rgba(16,185,129,0.65)] dark:shadow-[0_0_24px_-2px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300/70 dark:ring-emerald-400/40'
              : 'bg-surface-tertiary dark:bg-surface-primary text-content-quaternary hover:bg-surface-secondary dark:hover:bg-surface-tertiary'
          "
          @click="isBillable = !isBillable"
        >
          <i class="pi pi-dollar text-base" />
          <span>{{ isBillable ? t('pages.timesheets.enterTime.billable.billable') : t('pages.timesheets.enterTime.billable.nonBillable') }}</span>
        </button>
        <div class="flex items-center gap-2">
          <Button
            type="button"
            severity="secondary"
            outlined
            :label="t('common.buttons.clearSelection')"
            @click="emit('clear')"
          />
          <Button
            type="submit"
            severity="success"
            icon="pi pi-check"
            :label="t('pages.timesheets.timeEntries.suggestions.convertCta')"
            :style="canSubmit ? { boxShadow: ctaShadow } : {}"
          />
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import { useForm } from 'vee-validate';
import { object } from 'yup';

import { type MessageSchema } from '@/plugins/i18n';

interface SuggestionItem {
  Name?: string;
  Spend?: number;
}

interface IProps {
  selectedItems: SuggestionItem[];
  totalTime: string;
  projectOptions: Array<{ name: string; value: string }>;
  tagOptions: Array<{ name: string; value: string }>;
  taskOptions: Array<{ name: string; value: string }>;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  convert: [{ taskId?: string; projectId?: string; tagIds: string[]; billable: boolean }];
  clear: [];
  cancel: [];
}>();
const open = defineModel<boolean>('open');

const { t } = useI18n<{ message: MessageSchema }>();

const isBillable = ref(false);

const MAX_VISIBLE = 2;

const allNames = computed(() =>
  props.selectedItems.map((i) => i.Name).filter((n): n is string => Boolean(n)),
);

const visibleNames = computed(() => allNames.value.slice(0, MAX_VISIBLE));
const remainingNames = computed(() => allNames.value.slice(MAX_VISIBLE));
const remainingCount = computed(() => Math.max(0, allNames.value.length - MAX_VISIBLE));

const ctaShadow = computed(() => {
  const emerald = '16, 185, 129';
  return [
    `0 0 12px -2px rgba(${emerald}, 0.5)`,
    `0 4px 14px -3px rgba(${emerald}, 0.35)`,
  ].join(', ');
});

interface ConvertForm {
  task?: { name: string; value: string };
  project?: { name: string; value: string };
  tags?: Array<{ name: string; value: string }>;
}

const validationSchema = object({
  task: object().required().label(t('pages.timesheets.timeEntries.suggestions.modal.taskPlaceholder')),
  project: object().required().label(t('pages.timesheets.updateTimeEntriesModal.project.placeholder')),
});

const { handleSubmit, resetForm, meta, values } = useForm<ConvertForm>({ validationSchema });

const canSubmit = computed(() => {
  return Boolean(values.task?.value) && Boolean(values.project?.value);
});

const submit = handleSubmit((vals) => {
  emit('convert', {
    taskId: vals.task?.value,
    projectId: vals.project?.value,
    tagIds: (vals.tags ?? []).map((t) => t.value),
    billable: isBillable.value,
  });
  resetForm();
  isBillable.value = false;
});

void meta;
</script>


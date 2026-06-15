<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.company.reports.modal.update.header') : t('pages.company.reports.modal.add.header')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          :label="t('pages.company.reports.modal.reportType.label')"
          name="reportType"
          :placeholder="t('pages.company.reports.modal.reportType.placeholder')"
          :options="reportTypeOptions"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          :label="t('pages.company.reports.modal.frequency.label')"
          name="frequency"
          :placeholder="t('pages.company.reports.modal.frequency.placeholder')"
          :options="frequencyOptions"
        />
      </div>
      <div class="flex flex-col gap-4 flex-1">
        <FEmailList name="to" :label="t('pages.company.reports.modal.emailTo.label')" />
      </div>
      <div class="flex flex-col gap-4 flex-1">
        <FEmailList name="cc" :label="t('pages.company.reports.modal.emailCc.label')" />
      </div>
      <div class="flex flex-col gap-4 flex-1">
        <FEmailList name="bcc" :label="t('pages.company.reports.modal.emailBcc.label')" />
      </div>
      <FModalFooter>
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          outlined
          @click="handleClose"
        />
        <Button
          type="submit"
          :label="t('common.buttons.save')"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        />
      </FModalFooter>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { array, number, object, string } from 'yup';

import { ReportService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import {
  type ReportPresetMeta,
  ReportsApiService,
} from '@/customClient/services/ReportsApiService';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { ReportFrequency } from '@/views/company/_etc/reportFrequency.enum';

import type {
  ReportModifyDto,
  ReportSavedFilterDto,
  ReportViewModel,
} from '@/client';

interface IProps {
  data?: ReportViewModel;
}

interface IEmits {
  (event: 'fetchDefaultReports'): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const reportsStore = useCompanyReportsStore();

const open = defineModel<boolean>('open');

const frequencyOptions = [
  { name: t('pages.company.reports.modal.frequency.everyday'), value: ReportFrequency.EVERY_DAY },
  { name: t('pages.company.reports.modal.frequency.everyWeek'), value: ReportFrequency.EVERY_WEEK },
  { name: t('pages.company.reports.modal.frequency.everyMonth'), value: ReportFrequency.EVERY_MONTH },
];

const validationSchema = object({
  reportType: object()
    .shape({
      name: string().label(t('common.validation.fields.reportType')),
      value: string().label(t('common.validation.fields.reportType')).required(),
    })
    .required()
    .label(t('common.validation.fields.reportType')),
  frequency: object()
    .shape({
      name: string().label(t('common.validation.fields.frequency')),
      value: number().label(t('common.validation.fields.frequency')).required(),
    })
    .required()
    .label(t('common.validation.fields.frequency')),
  to: array()
    .label(t('common.validation.fields.email'))
    .of(string().email(t('components.emailList.invalidEmail')).required(t('common.validation.mixed.required', { field: t('common.validation.fields.email') })))
    .required(t('common.validation.array.min', { field: t('common.validation.fields.emails'), min: 1 }))
    .min(1, t('common.validation.array.min', { field: t('common.validation.fields.emails'), min: 1 })),
  cc: array()
    .label(t('common.validation.fields.email'))
    .of(string().email(t('components.emailList.invalidEmail')).required(t('common.validation.mixed.required', { field: t('common.validation.fields.email') }))),
  bcc: array()
    .label(t('common.validation.fields.email'))
    .of(string().email(t('components.emailList.invalidEmail')).required(t('common.validation.mixed.required', { field: t('common.validation.fields.email') }))),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const isEditing = computed(() => !!props.data);

const presets = ref<ReportPresetMeta[]>([]);
const savedFilters = ref<ReportSavedFilterDto[]>([]);

type DataWithV22 = ReportViewModel & {
  PresetId?: string;
  SavedFilterId?: string;
};

const reportTypeOptions = computed(() => {
  const options: Array<{ name: string; value: string }> = [];
  for (const p of presets.value) options.push({ name: `★ ${p.name}`, value: p.id });
  for (const f of savedFilters.value) {
    options.push({ name: `🔖 ${f.Name}`, value: `__saved_filter_${f.ID}__` });
  }
  const data = props.data as DataWithV22;
  if (data?.PresetId && !presets.value.some((p) => p.id === data.PresetId)) {
    options.unshift({ name: data.PresetId, value: data.PresetId });
  }
  if (data?.SavedFilterId && !savedFilters.value.some((f) => f.ID === data.SavedFilterId)) {
    options.unshift({
      name: data.SavedFilterId,
      value: `__saved_filter_${data.SavedFilterId}__`,
    });
  }
  if (data && !data.PresetId && !data.SavedFilterId && data.Type !== undefined && data.Type !== null) {
    options.push({
      name: `Legacy type ${data.Type}`,
      value: `__legacy_type_${data.Type}__`,
    });
  }
  return options;
});

const getInitialFormData = computed(() => {
  const report = props.data;
  const defaultFrequency = frequencyOptions[0];

  if (!report) {
    return {
      reportType: undefined,
      frequency: defaultFrequency,
      to: [],
      cc: [],
      bcc: [],
    };
  }

  const frequencyOption = frequencyOptions.find((f) => f.value === report.Schedule?.Period);
  const data = report as DataWithV22;
  let reportType: { name: string; value: string } | undefined;
  if (data.PresetId) {
    const match = presets.value.find((p) => p.id === data.PresetId);
    reportType = { name: match?.name ?? data.PresetId, value: data.PresetId };
  } else if (data.SavedFilterId) {
    const match = savedFilters.value.find((f) => f.ID === data.SavedFilterId);
    reportType = {
      name: match?.Name ?? data.SavedFilterId,
      value: `__saved_filter_${data.SavedFilterId}__`,
    };
  } else if (data.Type !== undefined && data.Type !== null) {
    reportType = {
      name: `Legacy type ${data.Type}`,
      value: `__legacy_type_${data.Type}__`,
    };
  }

  return {
    reportType,
    frequency: frequencyOption ?? defaultFrequency,
    to: report.To?.split(',').filter(Boolean) ?? [],
    cc: report.Cc?.split(',').filter(Boolean) ?? [],
    bcc: report.Bcc?.split(',').filter(Boolean) ?? [],
  };
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    const rtValue = String(values.reportType.value);
    const legacyMatch = /^__legacy_type_(\d+)__$/.exec(rtValue);
    const savedMatch = /^__saved_filter_(.+)__$/.exec(rtValue);
    const payload: Record<string, unknown> = {
      ID: props.data?.ID,
      To: values.to?.join(','),
      Cc: values.cc?.join(','),
      Bcc: values.bcc?.join(','),
      Schedule: { Period: values.frequency.value },
    };
    if (legacyMatch) {
      payload['Type'] = Number(legacyMatch[1]);
    } else if (savedMatch) {
      payload['SavedFilterId'] = savedMatch[1];
    } else {
      payload['PresetId'] = rtValue;
    }
    await reportsStore.saveReport(payload as ReportModifyDto);

    if (isEditing.value) {
      showSuccessMessage(t('pages.company.reports.modal.messages.updated'));
    } else {
      showSuccessMessage(t('pages.company.reports.modal.messages.created'));
    }

    emit('fetchDefaultReports');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

onMounted(async () => {
  try {
    const [presetList, filterList] = await Promise.all([
      ReportsApiService.listPresets(),
      ReportService.reportControllerListSavedFilters(),
    ]);
    presets.value = presetList;
    savedFilters.value = filterList;
  } catch (err) {
    showErrorMessage(err as Error);
  }
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

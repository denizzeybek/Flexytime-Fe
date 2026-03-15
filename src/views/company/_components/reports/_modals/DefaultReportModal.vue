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
      <div class="flex gap-4 flex-1">
        <FMultiSelect
          class="grow"
          name="teams"
          :label="t('pages.company.reports.modal.team.label')"
          :placeholder="t('pages.company.reports.modal.team.placeholder')"
          :options="teamOptions"
          :prime-props="{
            maxSelectedLabels: 3,
          }"
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
      <div class="flex flex-col gap-4 flex-1">
        <Button class="w-1/2 mx-auto" :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('common.buttons.save')" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { array, number, object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { ReportFrequency } from '@/views/company/_etc/reportFrequency.enum';

import type { ReportViewModel } from '@/client';

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
  teams: array()
    .required()
    .label(t('common.validation.fields.team'))
    .of(
      object().shape({
        name: string().required().label(t('common.validation.fields.name')),
        value: string().required().label(t('common.validation.fields.value')),
      }),
    ),
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

const reportTypeOptions = computed(() =>
  reportsStore.reportTypes.map((item) => ({ name: item.Name ?? '', value: item.ID ?? '' })),
);

const teamOptions = computed(() =>
  reportsStore.sectionList.map((item) => ({ name: item.Name ?? '', value: item.ID ?? '' })),
);

const getInitialFormData = computed(() => {
  const report = props.data;
  const defaultFrequency = frequencyOptions[0];

  if (!report) {
    return {
      reportType: undefined,
      frequency: defaultFrequency,
      teams: [],
      to: [],
      cc: [],
      bcc: [],
    };
  }

  const frequencyOption = frequencyOptions.find((f) => f.value === report.Schedule?.Period);

  return {
    reportType: { name: report.TypeDisplay ?? '', value: String(report.Type ?? '') },
    frequency: frequencyOption ?? defaultFrequency,
    teams: report.SectionId?.map((id) => {
      const section = reportsStore.sectionList.find((s) => s.ID === id);
      return { name: section?.Name ?? '', value: id };
    }) ?? [],
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
    await reportsStore.saveReport({
      ID: props.data?.ID,
      Type: Number(values.reportType.value),
      SectionId: values.teams?.map((t: { value: string }) => t.value),
      To: values.to?.join(','),
      Cc: values.cc?.join(','),
      Bcc: values.bcc?.join(','),
      Schedule: {
        Period: values.frequency.value,
      },
    });

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

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

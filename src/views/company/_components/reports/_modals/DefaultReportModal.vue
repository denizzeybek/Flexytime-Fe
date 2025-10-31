<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.company.reports.modal.update.header') : t('pages.company.reports.modal.add.header')"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
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
      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('common.buttons.save')" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { string, object, array } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import type { IReportItem } from '@/interfaces/company/report';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { ReportFrequency } from '@/views/company/_etc/reportFrequency.enum';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  data?: IReportItem;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchDefaultReports'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const reportsStore = useCompanyReportsStore();

const open = defineModel<boolean>('open');

const frequencyOptions = [
  { name: 'Everyday', value: ReportFrequency.EveryDay },
  { name: 'Every week', value: ReportFrequency.EveryWeek },
  { name: 'Every month', value: ReportFrequency.EveryMonth },
];

const isEditing = computed(() => !!props.data);

const reportTypeOptions = computed(() =>
  reportsStore?.ReportTypes.map((item) => ({ name: item.Name, value: item.ID })),
);
const teamOptions = computed(() =>
  reportsStore?.SectionList.map((item) => ({ name: item.Name, value: item.ID })),
);

const validationSchema = object({
  reportType: object()
    .shape({
      name: string().label('Report type'),
      value: string().label('Report type').required(),
    })
    .required()
    .label('Report type'),
  frequency: object()
    .shape({
      name: string().label('Frequency'),
      value: string().label('Frequency').required(),
    })
    .required()
    .label('Frequency'),
  teams: array()
    .required()
    .label('Team')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
  to: array()
    .label('Email')
    .of(string().email('Please enter a valid email address.').required('Email is required.'))
    .required('Please add at least one email.')
    .min(1, 'Please add at least one email.'),
  cc: array()
    .label('Email')
    .of(string().email('Please enter a valid email address.').required('Email is required.')),

  bcc: array()
    .label('Email')
    .of(string().email('Please enter a valid email address.').required('Email is required.')),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    if (isEditing.value) {
      showSuccessMessage('Report updated!');
    } else {
      showSuccessMessage('Report created!');
    }

    emit('fetchDefaultReports');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const report = props.data;
  return {
    ...(report && {
      reportType: { name: report.TypeDisplay, value: report.ID },
      frequency: { name: report.ScheduleDisplay, value: report.ID },
      teams: [{ name: report.SectionNameDisplay, value: '629176fc57a0318a082d516b' }],
      to: report.To,
      cc: report.Cc,
      bcc: report.Bcc,
    }),
  };
});
// TODO: reportType, frequency, teams dataları gelirken id'leri de dönmeli. Team, to, cc, bcc ise array olarak dönmeli.

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

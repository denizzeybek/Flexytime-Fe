<template>
  <div class="flex flex-col gap-6">
    <ElasticForm
      :is-submitting="isSubmitting"
      :reset-form="resetForm"
      :submit-handler="submitHandler"
    />
    <ElasticBarChart />
    <ElasticPieChart :group1-title="group1?.name" :group2-title="group2?.name" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { array,object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import ElasticBarChart from '@/views/company/_components/reports/elasticReports/ElasticBarChart.vue';
import ElasticForm from '@/views/company/_components/reports/elasticReports/ElasticForm.vue';
import ElasticPieChart from '@/views/company/_components/reports/elasticReports/ElasticPieChart.vue';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const reportsStore = useCompanyReportsStore();

const validationSchema = object({
  teams: array()
    .required()
    .label('Team')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
  employees: array()
    .required()
    .label('Employee')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
  projects: array()
    .required()
    .label('Project')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
  billible: object()
    .shape({
      name: string(),
      value: string().required('Billible is required field').label('Billible'),
    })
    .required()
    .label('Billible'),
  group1: object()
    .shape({
      name: string(),
      value: string().required('Group is required field').label('Group'),
    })
    .required()
    .label('Group'),
  group2: object()
    .shape({
      name: string(),
      value: string().required('Group is required field').label('Group'),
    })
    .required()
    .label('Group'),
  date: array().required().label('Date').of(string().required().label('Date')),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    showSuccessMessage(t('pages.company.reports.elasticReports.messages.created'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const fetchInitialData = async () => {
  reportsStore.fetchFilters();
};

const [teams] = defineField('teams');
const [employees] = defineField('employees');
const [projects] = defineField('projects');
const [billible] = defineField('billible');
const [date] = defineField('date');
const [group1] = defineField('group1');
const [group2] = defineField('group2');

watch(
  () => [
    teams.value,
    employees.value,
    projects.value,
    billible.value,
    date.value,
    group1.value,
    group2.value,
  ],
  () => {
    submitHandler();
  },
  { immediate: false },
);

onMounted(async () => {
  await fetchInitialData();
  resetForm({
    values: {
      group1: { value: EGroupOptions.PROJECTS, name: 'Projects' },
      group2: { value: EGroupOptions.EMPLOYEES, name: 'Employees' },
    },
  });
});
</script>

<style scoped></style>

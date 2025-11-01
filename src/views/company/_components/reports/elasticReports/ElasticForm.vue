<template>
  <Card class="shadow-md border border-gray-100 rounded-xl">
    <template #content>
      <form class="flex flex-col gap-5" @submit="submitHandler">
        <div class="flex items-center gap-4 flex-wrap lg:flex-nowrap">
      <FMultiSelect
        class="flex-1"
        name="teams"
        :placeholder="t('pages.company.elasticForm.teams.placeholder')"
        :options="teamOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FMultiSelect
        class="flex-1"
        name="employees"
        :placeholder="t('pages.company.elasticForm.employees.placeholder')"
        :options="employeeOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FMultiSelect
        class="flex-1"
        name="projects"
        :placeholder="t('pages.company.elasticForm.projects.placeholder')"
        :options="projectOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FSelect
        class="flex-1"
        name="billible"
        :placeholder="t('pages.company.elasticForm.billable.placeholder')"
        :options="billibleOptions"
      />
      <FDateTimePicker
        class="flex-1"
        name="date"
        :placeholder="t('pages.company.elasticForm.date.placeholder')"
        :prime-props="{
          showTime: false,
          hourFormat: '24',
          fluid: true,
          selectionMode: 'range',
          incrementIcon: true,
          manuelInput: true,
        }"
      />
      <Button @click="resetForm()" type="button" :label="t('pages.company.elasticForm.clear.label')" severity="info" outlined class="shadow-sm" />
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useReport } from '@/views/company/_composables/useReport';
import Card from 'primevue/card';

const { t } = useI18n<{ message: MessageSchema }>();

const { teamOptions, employeeOptions, projectOptions, billibleOptions } = useReport();

interface IProps {
  isSubmitting: boolean;
  resetForm: () => void;
  submitHandler: () => void;
}

defineProps<IProps>();
</script>

<style scoped></style>

<template>
  <form class="flex flex-col gap-4" @submit="submitHandler">
    <div class="flex items-center gap-4 flex-wrap lg:flex-nowrap">
      <FMultiSelect
        class="flex-1"
        name="teams"
        placeholder="Select team(s)"
        :options="teamOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FMultiSelect
        class="flex-1"
        name="employees"
        placeholder="Select employee(s)"
        :options="employeeOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FMultiSelect
        class="flex-1"
        name="projects"
        placeholder="Select project(s)"
        :options="projectOptions"
        :prime-props="{
          maxSelectedLabels: 1,
        }"
      />
      <FSelect
        class="flex-1"
        name="billible"
        placeholder="Select billible"
        :options="billibleOptions"
      />
      <FDateTimePicker
        class="flex-1"
        name="date"
        placeholder="Enter date"
        :prime-props="{
          showTime: false,
          hourFormat: '24',
          fluid: true,
        }"
      />
      <Button @click="resetForm()" type="button" label="Clear" severity="info" outlined />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useReport } from '@/views/company/_composables/useReport';

const { teamOptions, employeeOptions, projectOptions, billibleOptions } = useReport();


interface IProps {
  isSubmitting: boolean;
  resetForm: () => void;
  submitHandler: () => void;

}

defineProps<IProps>();
</script>

<style scoped></style>

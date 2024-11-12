<template>
  <div>
    <Card>
      <template #content>
        <div class="w-full flex items-center gap-4">
          <FInput
            name="timeEntry"
            class="flex-1"
            customClass="unstyled"
            list="timeEntryOptions"
            unstyled
            :datalistOptions="talents"
            @updateList="talents.push($event)"
          />
          <Button
            @click="isBillable = !isBillable"
            icon="pi pi-dollar"
            severity="success"
            :outlined="isBillable"
          />
          <div class="flex items-center gap-1">
            <FInput
              name="timeEntry"
              customClass="unstyled time-input"
              :transformValue="transformValue"
              unstyled
            />
            <span>-</span>
            <FInput
              name="timeEntry"
              customClass="unstyled time-input"
              :transformValue="transformValue"
              unstyled
            />
          </div>

          <FDateTimePicker
            name="date"
            :prime-props="{
              hourFormat: '24',
              fluid: true,
            }"
          />
          <FText as="h5" innerText="01:00:00" />
          <Button severity="info" label="ADD" />
        </div>
        <div class="flex items-center gap-4">
          <FSelect
            name="reportType"
            placeholder="Select report type"
            :options="reportTypeOptions"
          />
          <FMultiSelect
            name="teams"
            placeholder="Select team(s)"
            :options="reportTypeOptions"
            :prime-props="{
              maxSelectedLabels: 3,
            }"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const talents = ['asdasd', 'fffff', 'ccccc'];
const reportTypeOptions = [
  {
    name: 'Eclone',
    value: 'eclone',
  },
  {
    name: 'Ruuul',
    value: 'ruul',
  },
  {
    name: 'Flexytime',
    value: 'flexytime',
  },
];
const isBillable = ref(false);

const transformValue = (event: InputEvent): string | null => {
  const input = (event.target as HTMLInputElement).value.trim();

  // Check if input is a valid 4-digit number
  if (/^\d{4}$/.test(input)) {
    const hours = input.slice(0, 2);
    const minutes = input.slice(2, 4);

    // Ensure valid time format
    if (parseInt(hours, 10) < 24 && parseInt(minutes, 10) < 60) {
      return `${hours}:${minutes}`;
    }
  }
  return null; // Return null if the input is not valid
};
</script>

<style scoped></style>

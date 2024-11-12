<template>
  <div>
    <Card>
      <template #content>
        <form @submit="submitHandler">
          <div class="w-full flex items-center gap-4">
            <FInput
              name="timeEntry"
              class="flex-1"
              customClass="unstyled"
              placeholder="What are you working on?"
              list="timeEntryOptions"
              unstyled
              :datalistOptions="timeEntryOptions"
              @updateList="timeEntryOptions.push($event)"
            />
            <Button
              @click="isBillable = !isBillable"
              type="button"
              icon="pi pi-dollar"
              severity="success"
              :outlined="isBillable"
            />
            <template v-if="activeLayout === ELayout.MANUAL">
              <div class="flex items-center gap-1">
                <FInput
                  name="startTime"
                  customClass="unstyled time-input"
                  placeholder="00:00"
                  :transformValue="transformValue"
                  unstyled
                />
                <span>-</span>
                <FInput
                  name="endTime"
                  customClass="unstyled time-input"
                  placeholder="00:00"
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
            </template>
            <FText as="h5" innerText="01:00:00" />
            <Button
              v-if="activeLayout === ELayout.TIME"
              :severity="!isStarted ? 'info' : 'danger'"
              @click.stop="isStarted = true"
              :label="!isStarted ? 'START' : 'STOP'"
              :type="!isStarted ? 'button' : 'submit'"
            />
            <Button
              v-if="activeLayout === ELayout.MANUAL"
              severity="info"
              label="ADD"
              type="submit"
            />
            <div class="flex flex-col gap-2">
              <Button
                @click="activeLayout = ELayout.TIME"
                icon="pi pi-clock"
                :class="activeLayout === ELayout.TIME ? 'text-f-success' : 'text-f-black'"
                outlined
                unstyled
                type="button"
              />
              <Button
                @click="activeLayout = ELayout.MANUAL"
                icon="pi pi-list"
                :class="activeLayout === ELayout.MANUAL ? 'text-f-success' : 'text-f-black'"
                outlined
                unstyled
                type="button"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <FSelect name="project" placeholder="Select project" :options="projectOptions" />
            <FMultiSelect
              name="tags"
              placeholder="Select tag(s)"
              :options="tagOptions"
              :prime-props="{
                maxSelectedLabels: 3,
              }"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';

enum ELayout {
  TIME = 'time',
  MANUAL = 'manual',
}

const { showSuccessMessage, showErrorMessage } = useFToast();

const timeEntryOptions = ['asdasd', 'fffff', 'ccccc'];
const projectOptions = [
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
const tagOptions = [
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

const activeLayout = ref(ELayout.TIME);
const isBillable = ref(false);
const isStarted = ref(false);

const validationSchema = object({
  timeEntry: string().required().label('Time entry'),
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
    .label('Project'),
  teams: array()
    .label('Team')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
});

const { handleSubmit, isSubmitting, values, resetForm, defineField } = useForm({
  validationSchema,
});

const [startTime] = defineField('startTime');
const [endTime] = defineField('endTime');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Time entry entered!');
    if (activeLayout.value === ELayout.TIME) {
      isStarted.value = false;
    }
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

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
onMounted(() => {
  resetForm({
    values: {},
  });
});
</script>

<style scoped></style>

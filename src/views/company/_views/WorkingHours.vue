<template>
  <Card>
    <template #content>
      <form @submit="submitHandler" class="flex flex-col gap-12">
        <div class="flex flex-col lg:flex-row items-start w-full gap-12">
          <div class="flex flex-col flex-1">
            <template v-for="(field, idx) in fields" :key="field.key">
              <div class="flex items-center justify-start gap-2 lg:gap-8">
                <FCheckbox
                  :name="`workingDays[${idx}].IsWorkday`"
                  :label="field.value?.Name"
                  class="w-[200px] truncate lg:text-clip "
                />
                <FDateTimePicker
                  class="grow"
                  :name="`workingDays[${idx}].StartTime`"
                  placeholder="Enter Time"
                  :prime-props="{
                    timeOnly: true,
                    hourFormat: '24',
                    fluid: true,
                  }"
                />
                <span class="pi pi-arrow-right"></span>
                <FDateTimePicker
                  class="grow"
                  :name="`workingDays[${idx}].EndTime`"
                  placeholder="Enter Time"
                  :prime-props="{
                    timeOnly: true,
                    hourFormat: '24',
                    fluid: true,
                  }"
                />
              </div>
            </template>
          </div>
          <div class="flex flex-col flex-1 w-full gap-4 lg:gap-12">
            <div class="grow flex flex-col lg:flex-row justify-between gap-4">
              <FDateTimePicker
                class="grow"
                name="minimumRestTime"
                label="Minimum Rest Time"
                placeholder="Enter min rest time"
                :prime-props="{
                  timeOnly: true,
                  hourFormat: '24',
                  fluid: true,
                }"
              />
              <FDateTimePicker
                class="grow"
                name="workingInterval"
                label="Working Interval Duration"
                placeholder="Enter min working interval"
                :prime-props="{
                  timeOnly: true,
                  hourFormat: '24',
                  fluid: true,
                }"
              />
            </div>
            <div class="grow">
              <FSelect
                class="grow"
                label="Timezone"
                name="timeZone"
                placeholder="Select employee"
                :options="timeZoneList"
              />
            </div>
          </div>
        </div>
        <div class="flex w-50 justify-center">
          <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate';
import { computed, onMounted } from 'vue';
import { boolean, string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';
import type { IWorkingHourDay } from '@/interfaces/company/workingHour';
import { useCompanyWorkingHoursStore } from '@/stores/company/workingHours';
import { useProfileStore } from '@/stores/profile/profile';

const { showSuccessMessage, showErrorMessage } = useFToast();
const workingHoursStore = useCompanyWorkingHoursStore();
const profileStore = useProfileStore();

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const timeZoneName = computed(
  () => profileStore?.TimeZoneList?.find((item) => item.ID === workingHoursStore.TimeZone)?.Name,
);

const validationSchema = object({
  workingDays: array()
    .of(
      object().shape({
        Name: string().required(),
        StartTime: string().required(),
        EndTime: string().required(),
        IsWorkday: boolean().optional(),
      }),
    )
    .strict()
    .required(),
  minimumRestTime: string().required(),
  workingInterval: string().required(),
  timeZone: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .required()
    .label('Country'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<IWorkingHourDay>('workingDays');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('working hours updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

onMounted(async () => {
  await workingHoursStore.filter();

  resetForm({
    values: {
      workingDays: workingHoursStore.Days,
      minimumRestTime: workingHoursStore.MaxIdleTime,
      workingInterval: workingHoursStore.ShiftRangeTime,
      timeZone: { name: timeZoneName.value, value: workingHoursStore.TimeZone },
    },
  });
});
</script>
<style scoped></style>

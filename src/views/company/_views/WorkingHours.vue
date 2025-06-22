<template>
  <Card>
    <template #content>
      <form @submit="submitHandler" class="flex flex-col gap-12">
        <div class="flex flex-col lg:flex-row items-start w-full gap-12">
          <div class="flex flex-col flex-1">
            <template v-for="(field, idx) in fields" :key="field.key">
              <div class="flex items-center justify-start gap-2 lg:gap-8">
                <FCheckbox
                  :name="`days[${idx}].IsWorkday`"
                  :label="field.value?.Name"
                  class="w-[200px] truncate lg:text-clip"
                />
                <!-- day: {{ values.days[${idx}].StartTime }} -->
                <FDateTimePicker
                  class="grow"
                  :name="`days[${idx}].StartTime`"
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
                  :name="`days[${idx}].EndTime`"
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
                name="maxIdleTime"
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
                name="shiftRangeTime"
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
import { computed, onMounted, watch } from 'vue';
import { boolean, string, object, array, date, mixed } from 'yup';
import { useFToast } from '@/composables/useFToast';
import type { IWorkingHourDay } from '@/interfaces/company/workingHour';
import { useCompanyWorkingHoursStore } from '@/stores/company/workingHours';
import { useProfileStore } from '@/stores/profile/profile';
import dayjs from 'dayjs';
import { convertTimeToDate } from '@/helpers/utils';

const { showSuccessMessage, showErrorMessage } = useFToast();
const workingHoursStore = useCompanyWorkingHoursStore();
const profileStore = useProfileStore();

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const timeZoneName = computed(
  () => profileStore?.TimeZoneList?.find((item) => item.ID === workingHoursStore.timeZone)?.Name,
);

const validationSchema = object({
  days: array()
    .of(
      object().shape({
        Name: string().required(),
        StartTime: mixed().required(),
        EndTime: mixed().required(),
        IsWorkday: boolean().optional(),
      }),
    )
    .strict()
    .required(),
  maxIdleTime: mixed().required(),
  shiftRangeTime: mixed().required(),
  timeZone: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .required()
    .label('Country'),
});

const { handleSubmit, isSubmitting, resetForm, } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<IWorkingHourDay>('days');

const submitHandler = handleSubmit(async (values) => {
  try {
    const formattedDays = values.days.map((day) => ({
      ...day,
      StartTime: dayjs(day.StartTime).format('HH:mm'),
      EndTime: dayjs(day.EndTime).format('HH:mm'),
    }));
    const payload = {
      ...values,
      days: formattedDays,
      maxIdleTime: dayjs(values.maxIdleTime).format('HH:mm'),
      shiftRangeTime: dayjs(values.shiftRangeTime).format('HH:mm'),
      unclassified: false,
      isShowContent: true,
      title: 'Working Hours',
      timeZone: values.timeZone.value,
    };
    await workingHoursStore.save(payload);
    console.log('values ', payload);
    showSuccessMessage('working hours updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

onMounted(async () => {
  await workingHoursStore.filter();
  const days = workingHoursStore.days.map((day) => {
    return {
      ...day,
      StartTime: convertTimeToDate(day.StartTime),
      EndTime: convertTimeToDate(day.EndTime),
    }
  })

  resetForm({
    values: {
      days,
      maxIdleTime: convertTimeToDate(workingHoursStore.maxIdleTime),
      shiftRangeTime: convertTimeToDate(workingHoursStore.shiftRangeTime),
      timeZone: { name: timeZoneName.value, value: workingHoursStore.timeZone },
    },
  });
});
</script>
<style scoped></style>

<template>
  <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
    <template #content>
      <form class="flex flex-col gap-12" @submit="submitHandler">
        <Skeleton v-if="isLoading" height="30rem" width="w-full" />
        <template v-else>
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
                    :placeholder="t('pages.company.workingHours.form.enterTime')"
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
                    :placeholder="t('pages.company.workingHours.form.enterTime')"
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
                  :label="t('pages.company.workingHours.form.minRestTime')"
                  :placeholder="t('pages.company.workingHours.form.enterMinRestTime')"
                  :prime-props="{
                    timeOnly: true,
                    hourFormat: '24',
                    fluid: true,
                  }"
                />
                <FDateTimePicker
                  class="grow"
                  name="shiftRangeTime"
                  :label="t('pages.company.workingHours.form.workingIntervalDuration')"
                  :placeholder="t('pages.company.workingHours.form.enterMinWorkingInterval')"
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
                  :label="t('pages.company.workingHours.form.timezone')"
                  name="timeZone"
                  :placeholder="t('pages.company.workingHours.form.selectEmployee')"
                  :options="timeZoneList"
                />
              </div>
            </div>
          </div>
          <div class="flex w-50 justify-center">
            <Button
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="submit"
              :label="t('pages.company.workingHours.form.save')"
              class="shadow-sm"
            />
          </div>
        </template>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Skeleton from 'primevue/skeleton';
import { useFieldArray, useForm } from 'vee-validate';
import { array, boolean, mixed,object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { convertDateToTime,convertTimeToDate } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyWorkingHoursStore } from '@/stores/company/workingHours';
import { useProfileStore } from '@/stores/profile/profile';

import type { WorkDayViewModel } from '@/client';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const workingHoursStore = useCompanyWorkingHoursStore();
const profileStore = useProfileStore();

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

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<WorkDayViewModel>('days');

const isLoading = ref(false);

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const timeZoneName = computed(
  () => profileStore?.TimeZoneList?.find((item) => item.ID === workingHoursStore.timeZone)?.Name,
);

const submitHandler = handleSubmit(async (values) => {
  try {
    const formattedDays = values.days.map((day) => ({
      ...day,
      StartTime: convertDateToTime(day.StartTime),
      EndTime: convertDateToTime(day.EndTime),
    }));
    const payload = {
      Days: formattedDays,
      MaxIdleTime: convertDateToTime(values.maxIdleTime),
      ShiftRangeTime: convertDateToTime(values.shiftRangeTime),
      Unclassified: false,
      TimeZone: values.timeZone.value,
    };
    await workingHoursStore.save(payload);
    showSuccessMessage(t('pages.company.workingHours.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

onMounted(async () => {
  try {
    isLoading.value = true;
    await workingHoursStore.filter();
    const days = workingHoursStore.days.map((day) => {
      return {
        ...day,
        StartTime: convertTimeToDate(day.StartTime),
        EndTime: convertTimeToDate(day.EndTime),
      };
    });

    resetForm({
      values: {
        days,
        maxIdleTime: convertTimeToDate(workingHoursStore.maxIdleTime),
        shiftRangeTime: convertTimeToDate(workingHoursStore.shiftRangeTime),
        timeZone: { name: timeZoneName.value, value: workingHoursStore.timeZone },
      },
    });
    isLoading.value = false;
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});
</script>
<style scoped></style>

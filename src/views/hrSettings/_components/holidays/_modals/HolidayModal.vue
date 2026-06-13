<template>
  <Dialog
    v-model:visible="open"
    modal
    class="lg:!w-[700px] !w-full"
    :header="isEditing ? t('pages.hrSettings.holidays.modal.updateTitle') : t('pages.hrSettings.holidays.modal.addTitle')"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput class="grow" :label="t('pages.hrSettings.holidays.modal.nameLabel')" name="name" :placeholder="t('pages.hrSettings.holidays.modal.enterName')" />
      </div>

      <div class="flex gap-4">
        <div class="flex flex-col lg:flex-row items-start gap-4 lg:gap-12 flex-1">
          <FCheckbox name="startFullDay" labelTop :label="t('pages.hrSettings.holidays.modal.allDay')" />
          <FDateTimePicker
            :label="t('pages.hrSettings.holidays.modal.startDateLabel')"
            :placeholder="t('pages.hrSettings.holidays.modal.startDatePlaceholder')"
            class="grow"
            name="startDate"
            :prime-props="{
              showTime: startFullDay ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-col lg:flex-row items-start gap-4 lg:gap-12 flex-1">
          <FCheckbox name="endFullDay" labelTop labelLeft :label="t('pages.hrSettings.holidays.modal.allDay')" />
          <FDateTimePicker
            :label="t('pages.hrSettings.holidays.modal.endDateLabel')"
            :placeholder="t('pages.hrSettings.holidays.modal.endDatePlaceholder')"
            class="grow"
            name="endDate"
            :prime-props="{
              showTime: endFullDay ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
        </div>
      </div>
      <div class="flex items-center justify-center flex-1">
        <FCheckbox name="repeat" :label="t('pages.hrSettings.holidays.modal.repeatYearly')" />
      </div>

      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('pages.hrSettings.holidays.modal.save')" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { boolean, object, string } from 'yup';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { useModalForm } from '@/composables/useModalFormInit';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

dayjs.extend(utc);

// RESHAPED-v2: BE expects Start/End as UTC ISO 8601 instants (Rule 13).
// Full-day holidays: UTC-midnight of the picked calendar day (Rule 13 bucket #3).
// Half-day holidays: the picked instant as UTC.
const toIsoInstant = (date: Date, fullDay: boolean): string => {
  if (fullDay) {
    return dayjs(date).utc().startOf('day').toISOString();
  }
  return dayjs(date).toISOString();
};

import type { HolidayDto } from '@/client';

interface IProps {
  data?: HolidayDto;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const holidaysStore = useHRSettingsHolidaysStore();

const open = defineModel<boolean>('open');

const validationSchema = object({
  name: string().required().label(t('pages.hrSettings.holidays.modal.nameLabel')),
  startFullDay: boolean().label(t('pages.hrSettings.holidays.modal.allDay')),
  startDate: string().required().label(t('pages.hrSettings.holidays.modal.startDateLabel')),
  endFullDay: boolean().label(t('pages.hrSettings.holidays.modal.allDay')),
  endDate: string().required().label(t('pages.hrSettings.holidays.modal.endDateLabel')),
  repeat: boolean().label(t('pages.hrSettings.holidays.modal.repeatYearly')),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const [startFullDay] = defineField('startFullDay');
const [endFullDay] = defineField('endFullDay');

const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);

const getInitialFormData = computed(() => {
  const holiday = props.data;
  if (holiday) {
    // RESHAPED-v2: BE returns Start/End as UTC ISO 8601 instants.
    return {
      ID: holiday.ID,
      name: holiday.Name,
      startFullDay: holiday.StartFullDay,
      startDate: holiday.Start ? dayjs(holiday.Start).toDate() : undefined,
      endFullDay: holiday.EndFullDay,
      endDate: holiday.End ? dayjs(holiday.End).toDate() : undefined,
      repeat: holiday.Repeat,
    };
  }
  return {
    startFullDay: false,
    endFullDay: false,
    repeat: false,
  };
});

const submitHandler = handleSubmit(async (values) => {
  const payload: HolidayDto = {
    // RESHAPED-v2 (Rule 13): BE expects UTC ISO 8601 instants on Start/End.
    Start: toIsoInstant(values.startDate, values.startFullDay === true),
    End: toIsoInstant(values.endDate, values.endFullDay === true),
    Name: values.name,
    StartFullDay: values.startFullDay,
    EndFullDay: values.endFullDay,
    Repeat: values.repeat,
    ...(isEditing.value ? { ID: values.ID } : {}),
  };

  await executeWithFeedback(
    () => holidaysStore.save(payload),
    t('pages.hrSettings.holidays.modal.messages.updated'),
  );

  handleClose();
});

onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
</script>

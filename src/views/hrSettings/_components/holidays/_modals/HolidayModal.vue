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
import { boolean, object,string } from 'yup';

import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { convertDateToString, convertStringToDate } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

import type { HolidayViewModel } from '@/client';
import type { IHoliday } from '@/interfaces/hrSettings/holiday';

interface IProps {
  data?: IHoliday;
}

interface IEmits {
  (event: 'fetchHolidays'): void;
  (event: 'hide', val: any): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const holidaysStore = useHRSettingsHolidaysStore();

const open = defineModel<boolean>('open');

const validationSchema = object({
  name: string().required().label('Holiday Name'),
  startFullDay: boolean().label('Start time all day'),
  startDate: string().required().label('Start date'),
  endFullDay: boolean().label('End time all day'),
  endDate: string().required().label('End date'),
  repeat: boolean().label('Repeat every year'),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const [startFullDay] = defineField('startFullDay');
const [endFullDay] = defineField('endFullDay');

const isEditing = computed(() => !!props.data);

const getInitialFormData = computed(() => {
  const holiday = props.data;

  if (holiday) {
    return {
      ID: holiday.ID,
      name: holiday.Name,
      startFullDay: holiday.StartFullDay,
      startDate: convertStringToDate(holiday.StartDate, holiday.StartTime),
      endFullDay: holiday.EndFullDay,
      endDate: convertStringToDate(holiday.EndDate, holiday.EndTime),
      repeat: holiday.Repeat,
    };
  } else {
    return {
      startFullDay: false,
      endFullDay: false,
      repeat: false,
    };
  }
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  let payload = {
    StartDate: convertDateToString(values.startDate),
    StartTime: values.startFullDay
      ? '00:00'
      : (convertDateToString(values.startDate, true) as unknown as any).time,
    EndDate: convertDateToString(values.endDate),
    EndTime: values.endFullDay
      ? '00:00'
      : (convertDateToString(values.endDate, true) as unknown as any).time,
    Name: values.name,
    StartFullDay: values.startFullDay,
    EndFullDay: values.endFullDay,
    Repeat: values.repeat,
  } as HolidayViewModel;

  if (isEditing.value) {
    payload = { ...payload, ID: values.ID } as HolidayViewModel;
  }

  await executeWithFeedback(
    () => holidaysStore.save(payload),
    t('pages.hrSettings.holidays.modal.messages.updated'),
  );

  emit('fetchHolidays');
  handleClose();
});

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

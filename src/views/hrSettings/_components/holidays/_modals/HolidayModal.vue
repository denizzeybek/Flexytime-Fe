<template>
  <Dialog
    v-model:visible="open"
    modal
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
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
import { useForm } from 'vee-validate';
import { boolean, string, object } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import type { IHoliday } from '@/interfaces/hrSettings/holiday';
import { convertDateToString, convertStringToDate } from '@/helpers/utils';
import { useHRSettingsHolidaysStore } from '@/stores/hrSettings/holidays';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  data?: IHoliday;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchHolidays'): void;
  (event: 'hide', val: any): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const holidaysStore = useHRSettingsHolidaysStore();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

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

const handleClose = () => {
  resetForm();
  console.log('handle close');
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
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
    };
    if (isEditing.value) {
      payload = {
        ...payload,
        ID: values.ID,
      } as any;
    }
    console.log('payload ', payload);
    await holidaysStore.save(payload);
    emit('fetchHolidays');
    showSuccessMessage('Holiday updated!');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

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

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

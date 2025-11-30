<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.hrSettings.annuals.modal.update.header') : t('pages.hrSettings.annuals.modal.add.header')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          :label="t('pages.hrSettings.annuals.modal.employeeName.label')"
          name="employeeName"
          :placeholder="t('pages.hrSettings.annuals.modal.employeeName.placeholder')"
          :options="employees"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput class="grow" :label="t('pages.hrSettings.annuals.modal.leaveType.label')" name="leaveType" :placeholder="t('pages.hrSettings.annuals.modal.leaveType.placeholder')" />
      </div>

      <div class="flex gap-4">
        <div class="flex flex-col lg:flex-row items-start gap-4 lg:gap-12 flex-1">
          <FCheckbox name="startFullDay" labelTop :label="t('pages.hrSettings.annuals.modal.allDay.label')" />
          <FDateTimePicker
            :label="t('pages.hrSettings.annuals.modal.startDate.label')"
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
          <FCheckbox name="endFullDay" labelTop :label="t('pages.hrSettings.annuals.modal.allDay.label')" />
          <FDateTimePicker
            :label="t('pages.hrSettings.annuals.modal.endDate.label')"
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

      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('common.buttons.save')" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { boolean, object, string } from 'yup';

import { useModalForm } from '@/composables/useModalFormInit';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { convertDateToString, convertStringToDate } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

import type { AnnualViewModel } from '@/client';

interface IProps {
  data?: AnnualViewModel;
}

interface IEmits {
  (event: 'fetchAnnuals'): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const annualsStore = useHRSettingsAnnualsStore();

const open = defineModel<boolean>('open');

const validationSchema = object({
  employeeName: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .required()
    .label('Employee Name'),
  leaveType: string().required().label('Employee name'),
  startFullDay: boolean().label('Start time all day'),
  startDate: string().required().label('Start date'),
  endFullDay: boolean().label('End time all day'),
  endDate: string().required().label('End date'),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const [startFullDay] = defineField('startFullDay');
const [endFullDay] = defineField('endFullDay');

const employees = computed(() => {
  return annualsStore.members.map((member) => {
    return {
      name: member.Name,
      value: member.ID,
    };
  });
});

const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);

const getInitialFormData = computed(() => {
  const annual = props.data;
  if (annual) {
    return {
      ID: annual.ID,
      employeeName: { name: annual.MemberName, value: annual.MemberId },
      leaveType: annual.LeaveType,
      startFullDay: annual.StartFullDay,
      startDate: annual.StartFullDay
        ? convertStringToDate(annual.StartDate)
        : convertStringToDate(`${annual.StartDate} ${annual.StartTime}`),
      endFullDay: annual.EndFullDay,
      endDate: annual.EndFullDay
        ? convertStringToDate(annual.EndDate)
        : convertStringToDate(`${annual.EndDate} ${annual.EndTime}`),
    };
  }
  return {};
});

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
    MemberId: values.employeeName.value,
    LeaveType: values.leaveType,
  } as AnnualViewModel;

  if (isEditing.value) {
    payload = { ...payload, ID: values.ID } as AnnualViewModel;
  }

  await executeWithFeedback(
    () => annualsStore.save(payload),
    t('pages.hrSettings.annuals.modal.messages.updated'),
  );

  emit('fetchAnnuals');
  handleClose();
});

onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
</script>

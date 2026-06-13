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
        <div class="flex flex-col items-stretch gap-3 flex-1">
          <FDateTimePicker
            :label="t('pages.hrSettings.annuals.modal.startDate.label')"
            :placeholder="t('pages.hrSettings.annuals.modal.startDate.placeholder')"
            name="startDate"
            :prime-props="{
              showTime: startFullDay ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
          <FCheckbox name="startFullDay" :label="t('pages.hrSettings.annuals.modal.allDay.label')" />
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-col items-stretch gap-3 flex-1">
          <FDateTimePicker
            :label="t('pages.hrSettings.annuals.modal.endDate.label')"
            :placeholder="t('pages.hrSettings.annuals.modal.endDate.placeholder')"
            name="endDate"
            :prime-props="{
              showTime: endFullDay ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
          <FCheckbox name="endFullDay" :label="t('pages.hrSettings.annuals.modal.allDay.label')" />
        </div>
      </div>

    </form>

    <template #footer>
      <FModalFooter>
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          outlined
          @click.stop="handleClose"
        />
        <Button
          type="submit"
          :label="t('common.buttons.save')"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click.stop="submitHandler"
        />
      </FModalFooter>
    </template>
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
import { useHRSettingsAnnualsStore } from '@/stores/hrSettings/annuals';

dayjs.extend(utc);

const toIsoInstant = (date: Date, fullDay: boolean): string => {
  if (fullDay) {
    return dayjs(date).utc().startOf('day').toISOString();
  }
  return dayjs(date).toISOString();
};

import type { AnnualDto } from '@/client';

interface IProps {
  data?: AnnualDto;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const annualsStore = useHRSettingsAnnualsStore();

const open = defineModel<boolean>('open');

const validationSchema = object({
  employeeName: object()
    .shape({
      name: string().label(t('common.validation.fields.name')),
      value: string().label(t('common.validation.fields.value')),
    })
    .required()
    .label(t('pages.hrSettings.annuals.modal.employeeName.label')),
  leaveType: string().required().label(t('pages.hrSettings.annuals.modal.leaveType.label')),
  startFullDay: boolean().label(t('pages.hrSettings.annuals.modal.allDay.label')),
  startDate: string().required().label(t('pages.hrSettings.annuals.modal.startDate.label')),
  endFullDay: boolean().label(t('pages.hrSettings.annuals.modal.allDay.label')),
  endDate: string().required().label(t('pages.hrSettings.annuals.modal.endDate.label')),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const [startFullDay] = defineField('startFullDay');
const [endFullDay] = defineField('endFullDay');

const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);

const employees = computed(() => {
  return annualsStore.members.map((member) => {
    return {
      name: member.Name,
      value: member.ID,
    };
  });
});

const getInitialFormData = computed(() => {
  const annual = props.data;
  if (annual) {
    return {
      ID: annual.ID,
      employeeName: { name: annual.MemberName, value: annual.MemberId },
      leaveType: annual.LeaveType,
      startFullDay: annual.StartFullDay,
      startDate: annual.Start ? dayjs(annual.Start).toDate() : undefined,
      endFullDay: annual.EndFullDay,
      endDate: annual.End ? dayjs(annual.End).toDate() : undefined,
    };
  }
  return {};
});

const submitHandler = handleSubmit(async (values) => {
  const payload: AnnualDto = {
    Start: toIsoInstant(values.startDate, values.startFullDay === true),
    End: toIsoInstant(values.endDate, values.endFullDay === true),
    StartFullDay: values.startFullDay,
    EndFullDay: values.endFullDay,
    MemberId: values.employeeName.value,
    LeaveType: values.leaveType,
    ...(isEditing.value ? { ID: values.ID } : {}),
  };

  await executeWithFeedback(
    () => annualsStore.save(payload),
    t('pages.hrSettings.annuals.modal.messages.updated'),
  );

  handleClose();
});

onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
</script>

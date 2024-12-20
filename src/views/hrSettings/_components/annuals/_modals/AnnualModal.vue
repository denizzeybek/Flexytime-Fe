<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? 'Update Annual' : 'Add Annual'"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          label="Employee Name"
          name="employeeName"
          placeholder="Select employee"
          :options="employees"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput class="grow" label="Leave Type" name="leaveType" placeholder="Enter leave type" />
      </div>

      <div class="flex gap-4">
        <div class="flex flex-col lg:flex-row items-start  gap-4 lg:gap-12 flex-1">
          <FCheckbox name="startAllday" labelTop label="All Day" />
          <FDateTimePicker
            label="Start Date"
            class="grow"
            name="startDate"
            :prime-props="{
              showTime: startAllday ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
        </div>
        <Divider layout="vertical" />
        <div class="flex flex-col lg:flex-row items-start  gap-4 lg:gap-12 flex-1">
          <FCheckbox name="endAllday" labelTop label="All Day" />
          <FDateTimePicker
            label="End Date"
            class="grow"
            name="endDate"
            :prime-props="{
              showTime: endAllday ? false : true,
              hourFormat: '24',
              fluid: true,
            }"
          />
        </div>
      </div>

      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';
import type { IAnnual } from '@/interfaces/hrSettings/annual';

interface IProps {
  data?: IAnnual;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchAnnuals'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');
const employees = ref([
  { name: 'Agnes Owens', value: '64015c5ee435600a443e8c32' },
  { name: 'Danielle Hurst', value: '64015c5ee435600a443e8dc4' },
  { name: 'Erik Johnson', value: '5g015c5ee435600dfr5e8c32' },
  { name: 'Dani Ricciardo', value: '1d4f5c5ee435600a443e8c32' },
]);

const isEditing = computed(() => !!props.data);

const validationSchema = object({
  employeeName: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .required()
    .label('Employee Name'),
  leaveType: string().required().label('Employee name'),
  startAllday: boolean().label('Start time all day'),
  startDate: string().required().label('Start date'),
  endAllday: boolean().label('End time all day'),
  endDate: string().required().label('End date'),

  //   check: boolean().required().isTrue('You must agree to terms and conditions').label('Check'),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const [startAllday] = defineField('startAllday');
const [endAllday] = defineField('endAllday');

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    emit('fetchAnnuals');
    showSuccessMessage('Annual updated!');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const annual = props.data;

  return {
    ...(annual && {
      employeeName: { name: annual.MemberName, value: annual.MemberId },
      leaveType: annual.LeaveType,
      startAllday: annual.StartFullDay,
      startDate: annual.StartDate,
      endAllday: annual.EndFullDay,
      endDate: annual.EndDate,
    }),
  };
});
// TODO: start date ve end date bilgileri date olarak dönmeli, fe date'i convert etmeli

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

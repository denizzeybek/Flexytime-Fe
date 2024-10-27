<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? 'Update Holiday' : 'Add Holiday'"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput class="grow" label="Name" name="name" placeholder="Enter name" />
      </div>

      <div class="flex gap-4">
        <div class="flex items-start gap-12 flex-1">
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
        <div class="flex items-start gap-12 flex-1">
          <FCheckbox name="endAllday" labelTop labelLeft label="All Day" />
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
      <div class="flex items-center justify-center flex-1">
        <FCheckbox name="repeat" label="Repeat every year" />
      </div>

      <div class="flex w-50 justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { defineModel, computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array, number, ref as yupRef } from 'yup';
import { useFToast } from '@/composables/useFToast';
import type { IHoliday } from '@/interfaces/hrSettings/holiday';

interface IProps {
  data?: IHoliday;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchHolidays'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const validationSchema = object({
  name: string().required().label('Holiday Name'),
  startAllday: boolean().label('Start time all day'),
  startDate: string().required().label('Start date'),
  endAllday: boolean().label('End time all day'),
  endDate: string().required().label('End date'),
  repeat: boolean().label('Repeat every year'),
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

    emit('fetchHolidays');
    showSuccessMessage('Holiday updated!');
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = () => {
  const holiday = props.data;

  return {
    ...(holiday && {
      name: holiday.Name,
      startAllday: holiday.StartFullDay,
      startDate: holiday.StartDate,
      endAllday: holiday.EndFullDay,
      endDate: holiday.EndDate,
      repeat: holiday.Repeat,
    }),
  };
};

// TODO: start date ve end date bilgileri date olarak dönmeli, fe date'i convert etmeli

onMounted(() => {
  resetForm({
    values: getInitialFormData(),
  });
});
</script>

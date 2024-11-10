<template>
  <div class="flex gap-2 items-center">
    <Button
      v-tooltip.top="'Download Report'"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      outlined
    />
    <FDateTimePicker
      class="flex-1"
      name="date"
      placeholder="Enter date"
      :prime-props="{
        showTime: false,
        hourFormat: '24',
        fluid: true,
        selectionMode: 'range',
        incrementIcon: true,
        manuelInput: true,
        variant: 'filled',
      }"
    />
    <FSelect
      name="perspective"
      placeholder="Select perspective"
      :options="perspectiveOptions"
      :primeProps="{
        variant: 'filled',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';
import dayjs from 'dayjs';

enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const { showSuccessMessage, showErrorMessage } = useFToast();

const perspectiveOptions = ref([
  { name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: 'Rate', value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: 'In Shift', value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
]);

const validationSchema = object({
  perspective: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
      icon: string().label('Icon'),
    })
    .label('Perspective'),
  date: array().required().label('Date').of(string().required().label('Date')),
});

const { handleSubmit, resetForm, defineField } = useForm({
  validationSchema,
});

const [date] = defineField('date');
const [perspective] = defineField('perspective');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const worktimeData = {
    perspective: { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
    date: [dayjs().toDate(), dayjs().add(7, 'day').toDate()],
  };

  return {
    ...(worktimeData && {
      perspective: {
        name: worktimeData.perspective.name,
        value: worktimeData.perspective.value,
        icon: worktimeData.perspective.icon,
      },
      date: worktimeData.date,
    }),
  };
});

watch(
  () => [date.value, perspective.value],
  () => {
    submitHandler();
  },
  { immediate: false },
);

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

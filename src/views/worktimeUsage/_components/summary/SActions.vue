<template>
  <div class="flex gap-2 items-center w-full lg:w-fit">
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
import { computed, onMounted, ref, watch, inject, callWithErrorHandling } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';
import dayjs from 'dayjs';
import { convertDateToString } from '@/helpers/utils';
import { useRoute } from 'vue-router';

const handlePerspective = inject('handlePerspective') as (event: any) => void;

enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const { showSuccessMessage, showErrorMessage } = useFToast();
const route = useRoute();

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

const { handleSubmit, resetForm, defineField, setFieldValue } = useForm({
  validationSchema,
});

const [date] = defineField('date');
const [perspective] = defineField('perspective');

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = {
      perspective: values.perspective.value,
      interval: [convertDateToString(values.date[0]), convertDateToString(values.date[1])],
      teamId: route.query?.teamId,
    };
    handlePerspective(payload);
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const worktimeData = {
    date: [dayjs().toDate(), dayjs().add(7, 'day').toDate()],
  };
  let perspective = perspectiveOptions.value[0];
  if (route?.query?.perspective) {
    const currentPerspective = Number(route?.query.perspective);
    perspective = perspectiveOptions.value.find((option) => option.value === currentPerspective)!;
  }

  return {
    perspective,
    ...(worktimeData && {
      date: worktimeData.date,
    }),
  };
});

watch(
  () => route.fullPath,
  () => {
    submitHandler();
  },
);

watch(
  () => [date.value, perspective.value],
  ([date, perspective]) => {
    // submitHandler();
    console.log('perspective ', perspective);
    const payload = {
      perspective: perspective.value,
      interval: [convertDateToString(date[0]), convertDateToString(date[1])],
      teamId: route.query?.teamId,
    };
    handlePerspective(payload);
  },
  { deep: true },
);

// TODO: burda bir de date'i ilgili format'a göre query'ye kaydedip watch etmen gerekir.

onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

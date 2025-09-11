import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { object, array, string } from 'yup';
import dayjs from 'dayjs';
import { convertDateToString } from '@/helpers/utils';
import { PERSPECTIVE_OPTIONS } from '../_utils/constants';
import type { FilterPayload, PerspectiveOption } from '../_types';

export function useWorktimeFilters(onFilterChange: (payload: FilterPayload) => void) {
  const route = useRoute();

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
    const payload: FilterPayload = {
      perspective: values.perspective.value,
      interval: '', // Send empty string for now
      ...(route.query?.teamId
        ? { teamId: route.query.teamId as string }
        : { memberId: route.query.memberId as string }),
    };
    
    onFilterChange(payload);
  });

  const getInitialFormData = computed(() => {
    const defaultData = {
      date: [dayjs().toDate(), dayjs().add(7, 'day').toDate()],
    };

    let selectedPerspective = PERSPECTIVE_OPTIONS[0];
    if (route?.query?.perspective) {
      const currentPerspective = Number(route?.query.perspective);
      selectedPerspective = PERSPECTIVE_OPTIONS.find((option) => option.value === currentPerspective) || PERSPECTIVE_OPTIONS[0];
    }

    return {
      perspective: selectedPerspective,
      ...defaultData,
    };
  });

  // Auto-submit when form values change
  watch(
    () => [date.value, perspective.value],
    ([dateValue, perspectiveValue]) => {
      if (!dateValue || !perspectiveValue) return;
      
      const payload: FilterPayload = {
        perspective: perspectiveValue.value,
        interval: '', // Send empty string for now
        ...(route.query?.teamId
          ? { teamId: route.query.teamId as string }
          : { memberId: route.query.memberId as string }),
      };
      
      onFilterChange(payload);
    },
    { deep: true }
  );

  // Watch route changes
  watch(
    () => route.fullPath,
    () => {
      submitHandler();
    }
  );

  const triggerInitialLoad = () => {
    const initialData = getInitialFormData.value;
    const payload: FilterPayload = {
      perspective: initialData.perspective.value,
      interval: '', // Send empty string for now
      ...(route.query?.teamId
        ? { teamId: route.query.teamId as string }
        : { memberId: route.query.memberId as string }),
    };
    
    onFilterChange(payload);
  };

  return {
    date,
    perspective,
    submitHandler,
    resetForm,
    getInitialFormData,
    perspectiveOptions: PERSPECTIVE_OPTIONS,
    triggerInitialLoad,
  };
}
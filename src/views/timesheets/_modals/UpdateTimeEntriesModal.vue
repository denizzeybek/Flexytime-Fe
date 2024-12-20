<template>
  <Dialog
    v-model:visible="open"
    header="Categorize Time Entries"
    position="bottom"
    class="lg:!w-[1200px] !w-full"
    :style="{ width: '50rem' }"
    :closeOnEscape="false"
    :draggable="false"
    :closable="false"
  >
    <form @submit="submitHandler" class="pr-2">
      <div class="w-full flex items-center gap-4 flex-col lg:flex-row">
        <div class="flex items-center gap-2 w-full">
          <FAvatar>{{ selectedItemCount }}</FAvatar>
          <FText as="h5">item(s) selected</FText>
        </div>
        <div class="flex items-center gap-4 w-full justify-between lg:justify-end">
          <Button
            @click="isBillable = !isBillable"
            type="button"
            icon="pi pi-dollar"
            severity="success"
            :outlined="isBillable"
          />

          <Button severity="info" label="ADD" class="w-[150px]" icon="pi pi-plus" type="submit" />
          <div class="flex flex-col gap-2 justify-center items-center">
            <Button
              icon="pi pi-list"
              outlined
              unstyled
              type="button"
              class="w-fit text-f-success"
              v-tooltip.top="'Manual'"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 w-full">
        <FSelect
          name="project"
          placeholder="Select project"
          :options="projectOptions"
          :headerAddBtn="true"
          :prime-props="{
            filter: true,
          }"
          @addList="console.log('addList')"
        />
        <FMultiSelect
          name="tags"
          class="w-full lg:w-fit"
          placeholder="Select tag(s)"
          :options="tagOptions"
          :headerAddBtn="true"
          :prime-props="{
            maxSelectedLabels: 3,
          }"
          @addList="console.log('addList')"
        />
      </div>
    </form>

  </Dialog>
</template>

<script setup lang="ts">
import { useFToast } from '@/composables/useFToast';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch, computed } from 'vue';
import { array, object, string } from 'yup';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';

interface IProps {
  data?: any;
}

const props = defineProps<IProps>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');

const timeEntryOptions = ['Lansman projesi', 'Reconcilliation', 'Settlement'];
const projectOptions = [
  {
    name: 'Clearing',
    value: 'Clearing',
  },
  {
    name: 'Productivity',
    value: 'Productivity',
  },
  {
    name: 'SAP',
    value: 'SAP',
  },
];
const tagOptions = [
  {
    name: 'Lansman',
    value: 'Lansman',
  },
  {
    name: 'Reporting',
    value: 'Reporting',
  },
  {
    name: 'Seller',
    value: 'Seller',
  },
];

const activeLayout = ref(ELayout.MANUAL);
const isBillable = ref(false);

const validationSchema = object({
  timeEntry: string().required().label('Time entry'),
  date: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('Date'),
  startTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('Start Time'),
  endTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('End Time'),
  project: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .label('Project'),
  tags: array()
    .label('Tags')
    .of(
      object().shape({
        name: string().required().label('Name'),
        value: string().required().label('Value'),
      }),
    ),
});

const selectedItemCount = computed(() => {
  const data = props.data;
  let count = 0;

  for (const item of data) {
    // Ana nesne için Selected kontrolü
    if (item.Selected) count++;

    // Clocks dizisindeki her bir öğe için Selected kontrolü
    if (item.Clocks) {
      for (const clock of item.Clocks) {
        if (clock.Selected) count++;

        // Details dizisindeki her bir öğe için Selected kontrolü
        if (clock.Details) {
          for (const detail of clock.Details) {
            if (detail.Selected) count++;
          }
        }
      }
    }
  }

  return count;
});

const { handleSubmit, resetForm, defineField } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Time entry entered!');

    resetForm();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

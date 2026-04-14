<template>
  <Dialog
    v-model:visible="open"
    :header="t('pages.timesheets.updateTimeEntriesModal.header')"
    position="bottom"
    class="lg:!w-4/5 !w-full"
    :style="{ width: '50rem' }"
    :closeOnEscape="false"
    :draggable="false"
    :closable="true"
  >
    <form class="pr-2" @submit="submitHandler">
      <div class="w-full flex items-center gap-4 flex-col lg:flex-row">
        <div class="flex items-center gap-2 w-full min-w-0">
          <div
            class="flex items-center gap-2"
          >
            <FAvatar class="flex-shrink-0">{{ selectedItemCount }}</FAvatar>
            <FText as="h5" class="flex-shrink-0">{{ t('pages.timesheets.updateTimeEntriesModal.itemsSelected') }}</FText>
          </div>
          <!-- Visible item chips -->
          <div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <Tag
              v-for="name in visibleSelectedNames"
              :key="name"
              :value="name"
              severity="secondary"
              class="!text-xs !px-2 !py-0.5 truncate max-w-[120px]"
            />
            <Tag
              v-if="remainingCount > 0"
              v-tooltip.bottom="remainingNames.join('\n')"
              :value="`+${remainingCount}`"
              severity="info"
              class="!text-xs !px-2 !py-0.5 cursor-help flex-shrink-0"
            />
          </div>
        </div>
        <div class="flex items-center gap-4 w-full justify-between lg:justify-end">
          <Button
            type="button"
            icon="pi pi-dollar"
            severity="success"
            :outlined="isBillable"
            @click="isBillable = !isBillable"
          />

          <Button severity="info" :label="t('common.buttons.add')" class="w-[150px]" icon="pi pi-plus" type="submit" />
          <div class="flex flex-col gap-2 justify-center items-center">
            <Button
              icon="pi pi-list"
              outlined
              unstyled
              type="button"
              class="w-fit text-f-success"
              :v-tooltip.top="t('pages.timesheets.updateTimeEntriesModal.layoutButton.manual')"
            />
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 w-full">
        <FSelect
          name="project"
          :placeholder="t('pages.timesheets.updateTimeEntriesModal.project.placeholder')"
          :options="projectOptions"
          :headerAddBtn="true"
          :prime-props="{
            filter: true,
          }"
        />
        <FMultiSelect
          name="tags"
          class="w-full lg:w-fit"
          :placeholder="t('pages.timesheets.updateTimeEntriesModal.tags.placeholder')"
          :options="tagOptions"
          :headerAddBtn="true"
          :prime-props="{
            maxSelectedLabels: 3,
          }"
        />
      </div>
    </form>

  </Dialog>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tag from 'primevue/tag';
import { useForm } from 'vee-validate';
import { array, object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { ELayout } from '@/views/timesheets/_etc/layout.enum';

interface IProps {
  data?: any;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const timeEntriesStore = useTimesheetsTimeEntriesStore();

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  timeEntry: string().required().label(t('common.validation.fields.task')),
  date: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label(t('common.validation.fields.date')),
  startTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label(t('common.validation.fields.startTime')),
  endTime: string()
    .when([], {
      is: () => activeLayout.value === ELayout.MANUAL,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label(t('common.validation.fields.endTime')),
  project: object()
    .shape({
      name: string().label(t('common.validation.fields.name')),
      value: string().label(t('common.validation.fields.value')),
    })
    .label(t('common.validation.fields.project')),
  tags: array()
    .label(t('common.validation.fields.tags'))
    .of(
      object().shape({
        name: string().required().label(t('common.validation.fields.name')),
        value: string().required().label(t('common.validation.fields.value')),
      }),
    ),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema,
});

const open = defineModel<boolean>('open');

const projectOptions = computed(() => timeEntriesStore.projectOptions);
const tagOptions = computed(() => timeEntriesStore.tagOptions);

const activeLayout = ref(ELayout.MANUAL);
const isBillable = ref(false);

const MAX_VISIBLE_ITEMS = 2;

const allSelectedNames = computed(() => {
  const data = props.data;
  const names: string[] = [];

  for (const item of data) {
    if (item.Selected && item.Name) {
      names.push(item.Name);
    }

    if (item.Clocks) {
      for (const clock of item.Clocks) {
        if (clock.Selected && clock.Name) {
          names.push(clock.Name);
        }

        if (clock.Details) {
          for (const detail of clock.Details) {
            if (detail.Selected && detail.Name) {
              names.push(detail.Name);
            }
          }
        }
      }
    }
  }

  return names;
});

const selectedItemCount = computed(() => allSelectedNames.value.length);

const visibleSelectedNames = computed(() => allSelectedNames.value.slice(0, MAX_VISIBLE_ITEMS));

const remainingNames = computed(() => allSelectedNames.value.slice(MAX_VISIBLE_ITEMS));

const remainingCount = computed(() => Math.max(0, allSelectedNames.value.length - MAX_VISIBLE_ITEMS));

const submitHandler = handleSubmit(async (values) => {
  try {
    showSuccessMessage(t('pages.timesheets.updateTimeEntriesModal.messages.success'));

    resetForm();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

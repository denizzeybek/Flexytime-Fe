<template>
  <div class="flex flex-col gap-6">
    <template v-for="(field, idx) in fields" :key="field.key">
      <div class="flex items-center justify-between">
        <FCheckbox :name="`unclassifiedtimeEntries[${idx}].select`" />
        <div class="flex items-center flex-col gap-2">
          <FText as="h1" :innerText="field.value.recordDate" />
          <FText as="h5" :innerText="field.value.recordTime" />
        </div>
        <FText />
      </div>
      <template v-for="(timeEntry, tIdx) in field.value.timeEntry">
        <div class="flex items-center gap-4">
          <FCheckbox :name="`unclassifiedtimeEntries[${idx}].timeEntry[${tIdx}].select`" />
          <Card class="flex-1" :class="timeEntry.select ? 'border-2 border-f-primary' : ''">
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex justify-between items-start">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <FAvatar v-if="timeEntry.details?.length">
                        {{ timeEntry.details?.length }}
                      </FAvatar>
                      <FText v-if="timeEntry.name" as="h3" :innerText="timeEntry.name" />
                    </div>
                    <FText
                      v-if="!timeEntry.details?.length && timeEntry.title"
                      :innerText="timeEntry.title"
                    />
                  </div>
                  <div>
                    <FText
                      as="h6"
                      :innerText="calculateMinuteDifference(timeEntry.startDate, timeEntry.endDate)"
                    />
                  </div>
                </div>
                <div v-if="timeEntry.details.length" class="flex flex-col gap-2">
                  <template v-for="(detail, dIdx) in timeEntry.details">
                    <div v-if="detail" class="flex items-center gap-4">
                      <FCheckbox
                        :name="`unclassifiedtimeEntries[${idx}].timeEntry[${tIdx}].details[${dIdx}].select`"
                      />
                      <div class="px-4 py-3 bg-slate-100 rounded-md w-full flex justify-between">
                        <div class="flex flex-col gap-2">
                          <FText as="h6" :innerText="detail.name" />
                          <FText as="p" :innerText="detail.title" />
                        </div>
                        <FText
                          :innerText="calculateMinuteDifference(detail.startDate, detail.endDate)"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </template>
    </template>
  </div>
  <UpdateTimeEntriesModal v-if="modalOpen" v-model:open="modalOpen" :data="selectedItems" />
</template>

<script setup lang="ts">
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
import { useFToast } from '@/composables/useFToast';
import { onMounted, ref, watch, computed } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { array, boolean, object, string } from 'yup';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import UpdateTimeEntriesModal from '../_modals/UpdateTimeEntriesModal.vue';

dayjs.extend(customParseFormat);

const timeEntriesStore = useTimesheetsTimeEntriesStore();
const { showSuccessMessage, showErrorMessage } = useFToast();

const entriesData = ref();
const modalOpen = ref(false);
const selectedItems = ref([]);

const validationSchema = object({
  selectAll: boolean().nullable().label('Select All'),
  unclassifiedtimeEntries: array().of(
    object().shape({
      select: boolean().nullable().label('Selected'),
      timeEntry: object()
        .shape({
          select: boolean().nullable().label('Selected'),
          details: array()
            .label('Tag')
            .of(
              object().shape({
                select: boolean().nullable().label('Selected'),
              }),
            ),
        })
        .label('Project'),
    }),
  ),
});

const { handleSubmit, resetForm, defineField } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<any>('unclassifiedtimeEntries');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Time entry entered!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const setEntriesData = () => {
  entriesData.value = getInitialFormData.value;
};

const getInitialFormData = computed(() => {
  return timeEntriesStore.unclassifiedTimeEntries?.map((entry) => {
    return {
      recordDate: entry.RecordDate,
      recordTime: entry.RecordTime,
      select: entry.Selected,
      timeEntry: entry.Clocks.map((clock) => ({
        select: clock.Selected,
        title: clock.Title,
        name: clock.Name,
        domain: clock.Domain,
        startDate: clock.StartDate,
        endDate: clock.EndDate,
        details: clock.Details?.map((detail) => ({
          select: detail.Selected,
          title: detail.Title,
          name: detail.Name,
          domain: detail.Domain,
          startDate: detail.StartDate,
          endDate: detail.EndDate,
        })),
      })),
    };
  });
});

const calculateMinuteDifference = (startDate, endDate) => {
  const start = dayjs(startDate, 'DD.MM.YYYY HH:mm');
  const end = dayjs(endDate, 'DD.MM.YYYY HH:mm');
  return `${end.diff(start, 'minute')} min`;
};

const hasSelectedTrue = (data) => {
  for (const item of data) {
    if (item.Selected) return true;

    for (const clock of item.Clocks) {
      if (clock.Selected) return true;

      for (const detail of clock.Details) {
        if (detail.Selected) return true;
      }
    }
  }
  return false;
};


const getSelectedTrueObjects = (data) => {
  // TODO:: burda nasıl bir yapı izleneceği backend'e bağlı
  // sadece id'ler mi yollanacak, plain object mi yollanacak yoksa detay ile birlikte mi yollanacak
  const selectedItems = [] as any;

  data.forEach(element => {
    if (element.Selected) {
      selectedItems.push(element);
    }
    element.Clocks.forEach((clock) => {
      if (clock.Selected) {
        selectedItems.push(clock);
      } else {
        clock.Details.forEach((detail) => {
          if (detail.Selected) {
            selectedItems.push(detail);
          }
        });
      }
    })
  });

  return selectedItems;
};

const setModalState = () => {
  const data = timeEntriesStore.unclassifiedTimeEntries;
  if (hasSelectedTrue(data)) {
    modalOpen.value = true;
    selectedItems.value = getSelectedTrueObjects(data);
  } else {
    modalOpen.value = false;
  }
};

watch(
  () => timeEntriesStore.unclassifiedTimeEntries,
  () => {
    setEntriesData();
    setModalState();
    resetForm({
      values: {
        unclassifiedtimeEntries: entriesData.value,
        selectAll: false,
      },
    });
  },
  {
    immediate: true,
  },
);
</script>

<style scoped></style>

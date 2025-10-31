<template>
  <div class="flex flex-col gap-6" :class="selectedItems.length ? 'mb-60 lg:mb-40' : ''">
    <template v-for="(field, idx) in fields" :key="field.key">
      <div class="flex items-center justify-between">
        <FText />
        <!-- <FCheckbox :name="`unclassifiedtimeEntries[${idx}].Selected`" /> -->
        <div class="flex items-center flex-col gap-2">
          <FText as="h1" :innerText="field.value.RecordDate" />
          <FText as="h5" :innerText="field.value.RecordTime" />
        </div>
        <FText />
      </div>
      <template v-for="(clock, tIdx) in field.value.Clocks" :key="tIdx">
        <div class="flex items-center gap-4">
          <FCheckbox :name="`unclassifiedtimeEntries[${idx}].Clocks[${tIdx}].Selected`" />
          <Card class="flex-1" :class="clock.Selected ? 'border-2 border-f-primary' : ''">
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex justify-between items-start">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <FAvatar v-if="clock.Details?.length">
                        {{ clock.Details?.length }}
                      </FAvatar>
                      <FText v-if="clock.Name" as="h3" :innerText="clock.Name" />
                    </div>
                    <FText v-if="!clock.Details?.length && clock.Title" :innerText="clock.Title" />
                  </div>
                  <div>
                    <FText
                      as="h6"
                      :innerText="calculateMinuteDifference(clock.StartDate, clock.EndDate)"
                    />
                  </div>
                </div>
                <div v-if="clock.Details.length" class="flex flex-col gap-2">
                  <template v-for="(detail, dIdx) in clock.Details" :key="dIdx">
                    <div v-if="detail" class="flex items-center gap-4">
                      <FCheckbox
                        :name="`unclassifiedtimeEntries[${idx}].Clocks[${tIdx}].Details[${dIdx}].Selected`"
                      />
                      <div class="px-4 py-3 bg-slate-100 rounded-md w-full flex justify-between">
                        <div class="flex flex-col gap-2">
                          <FText as="h6" :innerText="detail.Name" />
                          <FText as="p" :innerText="detail.Title" />
                        </div>
                        <FText
                          :innerText="calculateMinuteDifference(detail.StartDate, detail.EndDate)"
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
  <UpdateTimeEntriesModal
    v-if="modalOpen && selectedItems.length"
    v-model:open="modalOpen"
    :data="selectedItems"
  />
</template>

<script setup lang="ts">
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries';
// import { useFToast } from '@/composables/useFToast';
import { ref, watch } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { array, boolean, object } from 'yup';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import UpdateTimeEntriesModal from '../_modals/UpdateTimeEntriesModal.vue';

dayjs.extend(customParseFormat);

const timeEntriesStore = useTimesheetsTimeEntriesStore();
// const { showSuccessMessage, showErrorMessage } = useFToast();

const modalOpen = ref(false);
const selectedItems = ref([]);

const validationSchema = object({
  selectAll: boolean().nullable().label('Select All'),
  unclassifiedtimeEntries: array().of(
    object().shape({
      Selected: boolean().nullable().label('Selected'),
      Clocks: object()
        .shape({
          Selected: boolean().nullable().label('Selected'),
          Details: array()
            .label('Tag')
            .of(
              object().shape({
                Selected: boolean().nullable().label('Selected'),
              }),
            ),
        })
        .label('Project'),
    }),
  ),
});

const { resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<any>('unclassifiedtimeEntries');

// const submitHandler = handleSubmit(async (values) => {
//   try {
//     console.log('values ', values);
//     showSuccessMessage('Time entry entered!');
//   } catch (error: any) {
//     showErrorMessage(error as any);
//   }
// });

const calculateMinuteDifference = (startDate, endDate) => {
  const start = dayjs(startDate, 'DD.MM.YYYY HH:mm');
  const end = dayjs(endDate, 'DD.MM.YYYY HH:mm');
  return `${end.diff(start, 'minute')} min`;
};

const setInitialFormData = (data) => {
  return data?.map((entry) => {
    return {
      ID: entry.ID,
      RecordDate: entry.RecordDate,
      RecordTime: entry.RecordTime,
      Selected: entry.Selected,
      Clocks: entry.Clocks?.map((clock) => ({
        ID: clock.ID,
        Selected: clock.Selected,
        Title: clock.Title,
        Name: clock.Name,
        Domain: clock.Domain,
        StartDate: clock.StartDate,
        EndDate: clock.EndDate,
        Details: clock.Details?.map((detail) => ({
          ID: detail.ID,
          Selected: detail.Selected,
          Title: detail.Title,
          Name: detail.Name,
          Domain: detail.Domain,
          StartDate: detail.StartDate,
          EndDate: detail.EndDate,
        })),
      })),
    };
  });
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

  data?.forEach((element) => {
    element.Clocks?.forEach((clock) => {
      if (!clock.Details.length) {
        if (clock.Selected) {
          selectedItems.push(clock);
        }
      } else {
        clock.Details?.forEach((detail) => {
          if (detail.Selected) {
            selectedItems.push(detail);
          }
        });
        const isEveryChildSelected = clock.Details.every((detail) => detail.Selected);
        if (!isEveryChildSelected) {
          clock.Selected = false;
        }
        if (clock.Selected) {
          clock.Details.map((detail) => (detail.Selected = true));
        }
      }
    });
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
  () => fields.value,
  (newValue, oldValue) => {
    const oldData = oldValue.map((element) => element.value);
    console.log(oldData);
    const newData = newValue.map((element) => element.value);

    // TODO:: burda eski ve yeni datayı kıyaslayıp hangi elemanın değiştiğini bulup ona göre işlem yapılacak

    const convertedData = setInitialFormData(newData);
    selectedItems.value = getSelectedTrueObjects(convertedData);
  },
  { deep: true },
);

watch(
  () => timeEntriesStore.unclassifiedTimeEntries,
  () => {
    setModalState();
    resetForm({
      values: {
        unclassifiedtimeEntries: setInitialFormData(timeEntriesStore.unclassifiedTimeEntries),
        selectAll: false,
      },
    });
  },
  {
    immediate: true,
  },
);
</script>
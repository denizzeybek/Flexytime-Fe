<template>
  <Card class="w-full">
    <template #content>
      <form class="flex flex-col gap-8">
        <Skeleton v-if="isLoading" height="100rem" width="w-full" />
        <template v-else>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <template v-for="(field, idx) in fields" :key="field.key">
              <div class="flex flex-col gap-3">
                <FText class="font-medium">{{ field.value.TypeName }}</FText>
                <div class="flex items-center">
                  <FSwitch
                    v-if="field.value.DataType === 2"
                    :name="`advanceds[${idx}].Value`"
                    @change="handleSwitchChange(field, field.value.SettingType, $event.target.value)"
                  />
                  <FDateTimePicker
                    v-else
                    class="w-full"
                    :name="`advanceds[${idx}].Value`"
                    :placeholder="t('pages.settings.advanced.time.placeholder')"
                    :prime-props="{
                      timeOnly: true,
                      hourFormat: '24',
                      fluid: true,
                    }"
                    @change="handleDateChange(field, field.value.SettingType, $event)"
                  />
                </div>
              </div>
            </template>
          </div>
        </template>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Skeleton from 'primevue/skeleton';
import { useFieldArray, useForm } from 'vee-validate';
import { array, mixed,object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { convertDateToTime,convertTimeToDate } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsAdvancedsStore } from '@/stores/settings/advanced';

import type { IAdvanced } from '@/interfaces/settings/advanced';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const advancedsStore = useSettingsAdvancedsStore();

const validationSchema = object({
  advanceds: array()
    .of(
      object().shape({
        TypeName: string().required(),
        Value: mixed().required(),
      }),
    )
    .strict()
    .required(),
});

const { resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<IAdvanced>('advanceds');

const isLoading = ref(false);

const getInitialFormData = computed(() => {
  return advancedsStore.list?.map((advanced) => ({
    TypeName: advanced.TypeName,
    Value: advanced.DataType === 2 ? advanced.Value === 'true' : convertTimeToDate(advanced.Value),
    // Value: advanced.Value,
    DataType: advanced.DataType,
    SettingType: advanced.SettingType,
  }));
});

const submit = async (settingType: number, value: any) => {
  try {
    let payload = [
      {
        SettingType: settingType,
        Value: value === 'true',
      } as {
        SettingType: number;
        Value: string | boolean;
      },
    ];
    console.log('settingType ', settingType);
    if (settingType === 0 || settingType === 1) {
      // date formatını saat'e çevir
      payload = [
        {
          SettingType: settingType,
          Value: convertDateToTime(value),
        },
      ];
    }
    advancedsStore.save(payload);
    showSuccessMessage(t('pages.settings.advanced.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
};

const handleDateChange = (field: any, settingType: number, newValue: any) => {
  field.Value = newValue;
  submit(settingType, field.Value);
};

const handleSwitchChange = (field: any, settingType: number, newValue: any) => {
  console.log('field ', field);
  field.Value = newValue ? 'true' : 'false';
  submit(settingType, field.Value);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await advancedsStore.filter();
    resetForm({
      values: {
        advanceds: getInitialFormData.value,
      },
    });
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped></style>

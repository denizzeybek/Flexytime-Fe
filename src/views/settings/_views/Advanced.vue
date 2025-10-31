<template>
  <Card class="lg:w-[700px]">
    <template #content>
      <form class="flex flex-col gap-12">
        <Skeleton v-if="isLoading" height="100rem" width="w-full" />
        <template v-else>
          <template v-for="(field, idx) in fields" :key="field.key">
            <div class="flex justify-between items-center">
              <div>
                <FText class="w-[250px] lg:max-w-[350px]">{{ field.value.TypeName }}</FText>
              </div>
              <div class="flex items-center gap-12">
                <FSwitch
                  v-if="field.value.DataType === 2"
                  :name="`advanceds[${idx}].Value`"
                  class="w-[120x]"
                  @change="handleSwitchChange(field, field.value.SettingType, $event.target.value)"
                />
                <FDateTimePicker
                  v-else
                  class="grow w-[60px]"
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
        </template>
        <!-- <div class="flex w-50 justify-center">
          <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
        </div> -->
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { string, object, array, mixed } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import { computed, onMounted, ref } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { useSettingsAdvancedsStore } from '@/stores/settings/advanced';
import type { IAdvanced } from '@/interfaces/settings/advanced';
import { convertTimeToDate, convertDateToTime } from '@/helpers/utils';
import Skeleton from 'primevue/skeleton';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const advancedsStore = useSettingsAdvancedsStore();

const isLoading = ref(false);

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

const getInitialFormData = computed(() => {
  return advancedsStore.list?.map((advanced) => ({
    TypeName: advanced.TypeName,
    Value: advanced.DataType === 2 ? advanced.Value === 'true' : convertTimeToDate(advanced.Value),
    // Value: advanced.Value,
    DataType: advanced.DataType,
    SettingType: advanced.SettingType,
  }));
});

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

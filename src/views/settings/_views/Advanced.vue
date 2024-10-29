<template>
  <Card class="w-[700px]">
    <template #content>
      <form @submit="submitHandler" class="flex flex-col gap-12">
        <template v-for="(field, idx) in fields" :key="field.key">
          <div class="flex justify-between items-center">
            <div>
              <FText class="max-w-[350px]">{{ field.value.TypeName }}</FText>
            </div>
            <div class="flex items-center gap-12">
              <FCheckbox
                v-if="field.value.DataType === 2"
                :name="`advanceds[${idx}].Value`"
                class="w-[120x]"
              />
              <FDateTimePicker
                v-else
                class="grow w-[60px]"
                :name="`advanceds[${idx}].Value`"
                placeholder="Enter Time"
                :prime-props="{
                  timeOnly: true,
                  hourFormat: '24',
                  fluid: true,
                }"
              />
            </div>
          </div>
        </template>
        <div class="flex w-50 justify-center">
          <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" label="Save" />
        </div>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { string, object, array, mixed } from 'yup';
import { useFToast } from '@/composables/useFToast';
import { computed, onMounted } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { useSettingsAdvancedsStore } from '@/stores/settings/advanced';
import type { IAdvanced } from '@/interfaces/settings/advanced';

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

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<IAdvanced>('advanceds');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Permissions updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  return advancedsStore.list?.map((advanced) => ({
    TypeName: advanced.TypeName,
    Value: advanced.DataType === 2 ? advanced.Value === 'true' : advanced.Value,
    DataType: advanced.DataType,
    SettingType: advanced.SettingType,
  }));
});

onMounted(async () => {
  await advancedsStore.filter();

  resetForm({
    values: {
      advanceds: getInitialFormData.value,
    },
  });
});
</script>

<style scoped></style>

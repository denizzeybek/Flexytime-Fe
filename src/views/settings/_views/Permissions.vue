<template>
  <Card class="lg:w-[700px]">
    <template #content>
      <form @submit="submitHandler" class="flex flex-col gap-12">
        <template v-for="(field, idx) in fields" :key="field.key">
          <div
            class="flex w-fit flex-col lg:flex-row lg:justify-between items-start gap-4 lg:items-center"
          >
            <div>
              <FText>{{ field.value.Name }}</FText>
            </div>
            <div class="flex items-center gap-12">
              <FCheckbox :name="`permissions[${idx}].Enabled`" />
              <FSelectSwitchButton
                :name="`permissions[${idx}].VisibleOnlyByAdmin`"
                :options="options"
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
import { boolean, string, object, array } from 'yup';
import { useFToast } from '@/composables/useFToast';
import { computed, onMounted } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { useSettingsPermissionsStore } from '@/stores/settings/permissions';
import type { IPermission } from '@/interfaces/settings/permission';

const { showSuccessMessage, showErrorMessage } = useFToast();
const permissionsStore = useSettingsPermissionsStore();

const options = [
  { label: 'Everyone', value: false },
  { label: 'Admin', value: true },
];

const validationSchema = object({
  permissions: array()
    .of(
      object().shape({
        Name: string().required(),
        Enabled: boolean().optional(),
        VisibleOnlyByAdmin: object().shape({
          label: string(),
          value: boolean(),
        }),
      }),
    )
    .strict()
    .required(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const { fields } = useFieldArray<IPermission>('permissions');

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Permissions updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  return permissionsStore.list.map((permission) => ({
    Name: permission.Name,
    Enabled: permission.Enabled,
    VisibleOnlyByAdmin: {
      label: permission.VisibleOnlyByAdmin ? 'Admin' : 'Everyone',
      value: permission.VisibleOnlyByAdmin,
    },
    Id: permission.Id,
    Key: permission.Key,
  }));
});

onMounted(async () => {
  await permissionsStore.filter();

  resetForm({
    values: {
      permissions: getInitialFormData.value,
    },
  });
});
</script>

<style scoped></style>

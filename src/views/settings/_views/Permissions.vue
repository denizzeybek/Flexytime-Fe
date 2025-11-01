<template>
  <Card class="w-full">
    <template #content>
      <form @submit="submitHandler" class="flex flex-col gap-8">
        <Skeleton v-if="isLoading" height="100rem" width="w-full" />
        <template v-else>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <template v-for="(field, idx) in fields" :key="field.key">
              <div class="flex flex-col gap-3">
                <FText class="font-medium">{{ field.value.Name }}</FText>
                <div class="flex items-center gap-4">
                  <FSwitch :name="`permissions[${idx}].Enabled`" />
                  <FSelectSwitchButton
                    :name="`permissions[${idx}].VisibleOnlyByAdmin`"
                    :options="options"
                  />
                </div>
              </div>
            </template>
          </div>
          <div class="flex justify-center mt-6">
            <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('pages.settings.permissions.save.label')" />
          </div>
        </template>
      </form>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { boolean, string, object, array } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import { computed, onMounted, ref } from 'vue';
import { useFieldArray, useForm } from 'vee-validate';
import { useSettingsPermissionsStore } from '@/stores/settings/permissions';
import type { IPermission } from '@/interfaces/settings/permission';
import Skeleton from 'primevue/skeleton';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const permissionsStore = useSettingsPermissionsStore();

const options = computed(() => [
  { label: t('pages.settings.permissions.options.everyone'), value: false },
  { label: t('pages.settings.permissions.options.admin'), value: true },
]);
const isLoading = ref(false);

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

const transformPermissions = (permissions) => {
  const EnabledIdList = permissions
    .filter((permission) => permission.Enabled)
    .map((permission) => permission.Id);
  const AdminIdList = permissions
    .filter((permission) => permission.VisibleOnlyByAdmin.value)
    .map((permission) => permission.Id);

  return {
    EnabledIdList,
    AdminIdList,
  };
};

const submitHandler = handleSubmit(async (values) => {
  try {
    // console.log('values ', values);
    const payload = transformPermissions(values.permissions);
    console.log('payload ', payload);
    await permissionsStore.save(payload);
    showSuccessMessage(t('pages.settings.permissions.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  return permissionsStore.list.map((permission) => ({
    Name: permission.Name,
    Enabled: permission.Enabled,
    VisibleOnlyByAdmin: {
      label: permission.VisibleOnlyByAdmin
        ? t('pages.settings.permissions.options.admin')
        : t('pages.settings.permissions.options.everyone'),
      value: permission.VisibleOnlyByAdmin,
    },
    Id: permission.Id,
    Key: permission.Key,
  }));
});

onMounted(async () => {
  try {
    isLoading.value = true;
    await permissionsStore.filter();
    resetForm({
      values: {
        permissions: getInitialFormData.value,
      },
    });
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped></style>

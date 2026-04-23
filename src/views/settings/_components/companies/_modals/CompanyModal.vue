<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.settings.companies.modal.updateTitle') : t('pages.settings.companies.modal.addTitle')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FInput class="flex-1" :label="t('pages.settings.companies.modal.companyName.label')" name="name" :placeholder="t('pages.settings.companies.modal.companyName.placeholder')" />
        <FInput
          class="flex-1"
          :label="t('pages.settings.companies.modal.authorizedName.label')"
          name="fullname"
          :placeholder="t('pages.settings.companies.modal.authorizedName.placeholder')"
        />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput
          class="flex-1"
          :label="t('pages.settings.companies.modal.authorizedEmail.label')"
          name="email"
          :placeholder="t('pages.settings.companies.modal.authorizedEmail.placeholder')"
        />
        <FPassword id="password" class="flex-1" :label="t('pages.settings.companies.modal.password.label')" name="password" />
      </div>

      <div class="flex gap-4 flex-1">
        <FInput class="flex-1" :label="t('pages.settings.companies.modal.userCount.label')" name="userCount" :placeholder="t('pages.settings.companies.modal.userCount.placeholder')" />
        <FInput
          class="flex-1"
          :label="t('pages.settings.companies.modal.userPeriod.label')"
          name="userPeriod"
          :placeholder="t('pages.settings.companies.modal.userPeriod.placeholder')"
        />
      </div>

      <div class="flex flex-col flex-1 gap-4">
        <FInput
          class="grow"
          :label="t('pages.settings.companies.modal.license.label')"
          name="license"
          disabled
          :placeholder="t('pages.settings.companies.modal.license.placeholder')"
        />
      </div>

      <div class="flex w-full justify-center">
        <Button :disabled="isSubmitting" :loading="isSubmitting" type="submit" :label="t('common.buttons.save')" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { number, object, string } from 'yup';

import { useModalForm } from '@/composables/useModalFormInit';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { parseLicense } from '@/helpers/license';
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';

import type { CompanyViewModel } from '@/client';

interface IProps {
  data?: CompanyViewModel;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const companiesStore = useSettingsCompaniesStore();

const validationSchema = object({
  name: string().required().label(t('pages.settings.companies.modal.companyName.label')),
  fullname: string()
    .required()
    .matches(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/, t('pages.settings.companies.modal.validation.authorizedNameLettersOnly'))
    .label(t('pages.settings.companies.modal.authorizedName.label')),
  email: string().email().required().label(t('pages.settings.companies.modal.authorizedEmail.label')),
  password: string()
    .label(t('pages.settings.companies.modal.password.label'))
    .optional(),
  userCount: number().required().label(t('pages.settings.companies.modal.userCount.label')),
  userPeriod: number().required().label(t('pages.settings.companies.modal.userPeriod.label')),
  license: string().optional().label(t('pages.settings.companies.modal.license.label')),
});

const open = defineModel<boolean>('open');

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const { isEditing, handleClose } = useModalForm(open, props.data, resetForm);

const submitHandler = handleSubmit(async (values) => {
  const payload: CompanyViewModel = {
    Name: values.name,
    Fullname: values.fullname,
    Email: values.email,
    Password: values.password,
    UserCount: values.userCount,
    Month: values.userPeriod,
    License: values.license,
  };

  if (isEditing.value && props.data?.ID) {
    payload.ID = props.data.ID;
  }

  const successMessage = isEditing.value
    ? t('pages.settings.companies.modal.messages.updated')
    : t('pages.settings.companies.modal.messages.added');

  await executeWithFeedback(() => companiesStore.save(payload), successMessage);

  handleClose();
});

const getInitialFormData = () => {
  const company = props.data;

  if (!company) return {};

  const parsed = parseLicense(company.License);

  return {
    name: company.Name,
    fullname: company.Fullname,
    email: company.Email,
    password: company.Password || '',
    userCount: parsed.userCount ?? company.UserCount,
    userPeriod: parsed.month ?? company.Month,
    license: company.License || '',
  };
};

// Reset form whenever modal opens or data changes
watch(
  [open, () => props.data],
  ([isOpen]) => {
    if (isOpen) {
      if (isEditing.value) {
        // Edit mode: populate form with existing data
        resetForm({
          values: getInitialFormData(),
        });
      } else {
        // Add mode: clear form completely
        resetForm();
      }
    }
  },
  { immediate: true },
);
</script>

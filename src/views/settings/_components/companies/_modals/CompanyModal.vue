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

      <FModalFooter>
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          outlined
          @click="handleClose"
        />
        <Button
          type="submit"
          :label="t('common.buttons.save')"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        />
      </FModalFooter>
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

/**
 * Compose the legacy summary string "{active}/{cap} kullanıcı {dd.mm.yyyy}"
 * from the v2 structured license fields (ActiveUserCount + UserCount +
 * LicenseExpireDate). BE no longer ships a pre-composed `License` string —
 * the FE composes for display only. Returns an empty string when the
 * company has no valid license blob.
 */
const formatLicense = (company: CompanyViewModel): string => {
  const active = company.ActiveUserCount ?? 0;
  const cap = company.UserCount ?? 0;
  if (!company.LicenseExpireDate) return '';
  const d = new Date(company.LicenseExpireDate);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${active}/${cap} kullanıcı ${dd}.${mm}.${yyyy}`;
};

const getInitialFormData = () => {
  const company = props.data;

  if (!company) return {};

  return {
    name: company.Name,
    fullname: company.Fullname,
    email: company.Email,
    password: company.Password || '',
    userCount: company.UserCount,
    userPeriod: company.Month,
    license: formatLicense(company),
  };
};

watch(
  [open, () => props.data],
  ([isOpen]) => {
    if (isOpen) {
      if (isEditing.value) {
        resetForm({
          values: getInitialFormData(),
        });
      } else {
        resetForm();
      }
    }
  },
  { immediate: true },
);
</script>

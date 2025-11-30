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

      <div class="flex w-50 justify-center">
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
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsCompaniesStore } from '@/stores/settings/companies';

import type { CompanyViewModel } from '@/client';

interface IProps {
  data?: CompanyViewModel;
}

interface IEmits {
  (event: 'fetchCompanies'): void;
}

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const companiesStore = useSettingsCompaniesStore();

const validationSchema = object({
  name: string().required().label('Company name'),
  fullname: string().required().label('Authorized Name'),
  email: string().email().required().label('Authorized Email'),
  password: string().required().min(6).label('Password'),
  userCount: number().required().label('User Count'),
  userPeriod: number().required().label('User Period'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const open = defineModel<boolean>('open');

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

  emit('fetchCompanies');
  handleClose();
});

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
);
</script>

<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.settings.companies.modal.updateTitle') : t('pages.settings.companies.modal.addTitle')"
    class="!bg-f-secondary-purple lg:!w-[700px] !w-full"
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
        <FPassword class="flex-1" id="password" :label="t('pages.settings.companies.modal.password.label')" name="password" />
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
import { computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { string, object, number } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';
import type { ICompany } from '@/interfaces/settings/company';

const { t } = useI18n<{ message: MessageSchema }>();

interface IProps {
  data?: ICompany;
}

const props = defineProps<IProps>();

interface IEmits {
  (event: 'fetchCompanies'): void;
}
const emit = defineEmits<IEmits>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

const validationSchema = object({
  name: string().required().label('Company name'),
  fullname: string().required().label('Authorized Name'),
  email: string().required().label('Authorized Email'),
  password: string().required().min(6).label('Password'),
  userCount: number().required().label('User Count'),
  userPeriod: number().required().label('User Period'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const handleClose = () => {
  resetForm();
  open.value = false;
};

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    emit('fetchCompanies');
    showSuccessMessage(isEditing.value ? t('pages.settings.companies.modal.messages.updated') : t('pages.settings.companies.modal.messages.added'));
    handleClose();
  } catch (error: any) {
    showErrorMessage(error as any);
  }
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

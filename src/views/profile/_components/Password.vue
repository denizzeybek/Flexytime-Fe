<template>
    <h3 class="text-lg font-semibold mb-6">{{ t('pages.profile.password.title') }}</h3>
    <form class="flex flex-col gap-6" @submit.prevent="submitHandler">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <FPassword
          id="password"
          class="flex-1"
          :label="t('pages.profile.password.password.label')"
          name="password"
        />
        <FPassword
          id="repeatPassword"
          class="flex-1"
          :label="t('pages.profile.password.repeatPassword.label')"
          name="repeatPassword"
        />
      </div>
      <div class="flex justify-end">
        <Button
          type="submit"
          :label="t('pages.profile.password.save.label')"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        />
      </div>
    </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, ref as yupRef, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const profileStore = useProfileStore();

const validationSchema = object({
  password: string().required().min(6).label('Password'),
  repeatPassword: string()
    .oneOf([yupRef('password')], t('pages.profile.password.validation.passwordsMustMatch'))
    .required()
    .min(6)
    .label('Repeat Password'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    await profileStore.changePassword(values.password);
    showSuccessMessage(t('pages.profile.password.messages.updated'));
    resetForm();
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});
</script>

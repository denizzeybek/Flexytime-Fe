<template>
  <AuthLayout adName="forgot-password">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center"> {{ $t('pages.auth.forgotPassword.title') }} </FText>

      <form class="flex flex-col gap-5" @submit="submitHandler">
        <div class="relative">
          <FPassword id="password" :label="$t('pages.auth.forgotPassword.form.password.label')" name="password" :placeholder="$t('pages.auth.forgotPassword.form.password.placeholder')" />
        </div>

        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="$t('pages.auth.forgotPassword.form.button')"
          class="w-full"
        />
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object,string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  password: string().required().label('Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.auth.forgotPassword.messages.success'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

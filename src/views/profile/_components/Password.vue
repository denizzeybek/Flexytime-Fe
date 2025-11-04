<template>
  <div>
    <form class="flex flex-col gap-12" @submit="submitHandler">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <FPassword id="password" class="flex-1" :label="t('pages.profile.password.password.label')" name="password" />
        <FPassword
          id="repeatPassword"
          class="flex-1"
          :label="t('pages.profile.password.repeatPassword.label')"
          name="repeatPassword"
        />
      </div>
      <div class="flex justify-center">
        <Button
          type="submit"
          :label="t('pages.profile.password.save.label')"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click.stop="submitHandler"
        ></Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, ref as yupRef,string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  password: string().required().min(6).label('Password'),
  repeatPassword: string()
    .oneOf([yupRef('password')], 'Repeat Passwords must match with password')
    .required()
    .min(6)
    .label('Repeat Password'),
});

const { handleSubmit,  isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    showSuccessMessage(t('pages.profile.password.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

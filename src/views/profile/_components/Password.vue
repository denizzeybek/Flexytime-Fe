<template>
  <div>
    <form @submit="submitHandler" class="flex flex-col gap-12">
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
        <FPassword class="flex-1" id="password" :label="t('pages.profile.password.password.label')" name="password" />
        <FPassword
          class="flex-1"
          id="repeatPassword"
          :label="t('pages.profile.password.repeatPassword.label')"
          name="repeatPassword"
        />
      </div>
      <div class="flex justify-center">
        <Button
          type="submit"
          :label="t('pages.profile.password.save.label')"
          :disabled="isSubmitting"
          @click.stop="submitHandler"
          :loading="isSubmitting"
        ></Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object, ref as yupRef } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useFToast } from '@/composables/useFToast';

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

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);

    showSuccessMessage('Holiday updated!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

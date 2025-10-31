<template>
  <AuthLayout adName="register">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center"> {{ $t('pages.auth.register.title') }} </FText>

      <Button
        unstyled
        icon="pi pi-google"
        :label="$t('pages.auth.register.googleLogin')"
        class="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 px-4 text-f-black"
      />

      <div class="relative bg-f-black/40 max-w-full h-[1px] my-8 mx-3">
        <FText
          class="absolute text-center px-2.5 -translate-x-1/2 -translate-y-1/2 text-f-black bg-r-db-bg left-1/2 top-1/2 bg-f-tertiary-purple"
        >
          {{ $t('pages.auth.register.orRegister') }}
        </FText>
      </div>

      <form class="flex flex-col gap-5" @submit="submitHandler">
        <FInput id="companyName" :label="$t('pages.auth.register.form.companyName.label')" name="companyName" :placeholder="$t('pages.auth.register.form.companyName.placeholder')" />

        <FInput id="fullName" :label="$t('pages.auth.register.form.fullName.label')" name="fullName" :placeholder="$t('pages.auth.register.form.fullName.placeholder')" />

        <FInput type="email" id="email" :label="$t('pages.auth.register.form.email.label')" name="email" :placeholder="$t('pages.auth.register.form.email.placeholder')" />

        <FPassword id="password" :label="$t('pages.auth.register.form.password.label')" name="password" :placeholder="$t('pages.auth.register.form.password.placeholder')" />

        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="$t('pages.auth.register.form.button')"
          class="w-full"
        />
      </form>

      <div class="flex gap-2 justify-center mt-8">
        <span>{{ $t('pages.auth.register.haveAccount') }}</span
        ><RouterLink class="underline" :to="{ name: ERouteNames.Login }"> {{ $t('pages.auth.register.signIn') }} </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  companyName: string().required().label('Company Name'),
  fullName: string().required().label('Full Name'),
  email: string().email().required().label('Email'),
  password: string().required().label('Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.auth.register.messages.success'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

<template>
  <AuthLayout adName="register">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center"> Create a Free Account </FText>

      <Button
        unstyled
        icon="pi pi-google"
        label="Login with Google"
        class="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 px-4 text-f-black"
      />

      <div class="relative bg-f-black/40 max-w-full h-[1px] my-8 mx-3">
        <FText
          class="absolute text-center px-2.5 -translate-x-1/2 -translate-y-1/2 text-f-black bg-r-db-bg left-1/2 top-1/2 bg-f-tertiary-purple"
        >
          or register with your email
        </FText>
      </div>

      <form class="flex flex-col gap-5" @submit="submitHandler">
        <FInput id="companyName" label="Company Name" name="companyName" />

        <FInput id="fullName" label="Full Name" name="fullName" />

        <FInput type="email" id="email" label="Email" name="email" />

        <FPassword id="password" label="Password" name="password" />

        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          label="Let's Get Started"
          class="w-full"
        />
      </form>

      <div class="flex gap-2 justify-center mt-8">
        <span>Already have an account</span
        ><RouterLink class="underline" :to="{ name: ERouteNames.Login }"> Sign in </RouterLink>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useFToast } from '@/composables/useFToast';

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
    showSuccessMessage('Registered!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

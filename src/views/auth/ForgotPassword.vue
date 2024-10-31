<template>
  <AuthLayout adName="forgot-password">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center"> Reset Password </FText>

      <form class="flex flex-col gap-5" @submit="submitHandler">
        <div class="relative">
          <FPassword id="password" label="Password" name="password" />
        </div>

        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          label="Reset Password"
          class="w-full"
        />
      </form>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ERouteNames } from '@/router/routeNames.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { defineModel, computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { boolean, string, object, array, number, ref as yupRef } from 'yup';
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  password: string().required().label('Password'),
});

const { handleSubmit, isSubmitting, resetForm, defineField } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('Logged in!');
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

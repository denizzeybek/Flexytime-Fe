<template>
  <AuthLayout adName="forgot-password">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Forgot Password Card -->
      <div class="w-full max-w-md my-auto">
        <!-- Card Container -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <img
              class="h-14 w-auto"
              src="@/components/images/login-logo.png"
              alt="Logo"
            />
          </div>

          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-slate-900 mb-1">
              {{ t('pages.auth.forgotPassword.title') }}
            </h1>
            <p class="text-sm text-slate-600">
              {{ t('pages.auth.forgotPassword.description') }}
            </p>
          </div>

          <!-- Forgot Password Form -->
          <form class="space-y-4" @submit="submitHandler">
            <!-- Email Input -->
            <div>
              <FInput
                id="email"
                :label="t('pages.auth.forgotPassword.form.email.label')"
                name="email"
                type="email"
                :placeholder="t('pages.auth.forgotPassword.form.email.placeholder')"
              />
            </div>

            <!-- Submit Button -->
            <Button
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="submit"
              :label="t('pages.auth.forgotPassword.form.button')"
              icon="pi pi-send"
              iconPos="right"
              class="w-full !py-2.5 !font-semibold mt-2"
            />
          </form>

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <RouterLink
              class="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              :to="{ name: ERouteNames.Login }"
            >
              ← {{ t('pages.auth.forgotPassword.backToLogin') }}
            </RouterLink>
          </div>
        </div>

        <!-- Footer Text -->
        <p class="mt-4 text-center text-xs text-slate-500">
          {{ t('pages.auth.forgotPassword.footer') }}
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { AccountApiService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();

const validationSchema = object({
  email: string().required().email().label('Email'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    await AccountApiService.accountApiForgot({
      Email: values.email,
    });

    showSuccessMessage(t('pages.auth.forgotPassword.messages.success'));
    resetForm();
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});
</script>

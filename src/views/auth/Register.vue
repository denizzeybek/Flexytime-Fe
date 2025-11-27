<template>
  <AuthLayout adName="register">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Register Card -->
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
              {{ $t('pages.auth.register.title') }}
            </h1>
            <p class="text-sm text-slate-600">
              Create your account to get started
            </p>
          </div>

          <!-- Google Register -->
          <Button
            unstyled
            icon="pi pi-google"
            :label="$t('pages.auth.register.googleLogin')"
            class="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg py-2.5 px-4 text-slate-700 font-medium transition-all duration-200"
          />

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-slate-500 font-medium">
                {{ $t('pages.auth.register.orRegister') }}
              </span>
            </div>
          </div>

          <!-- Register Form -->
          <form class="space-y-4" @submit="submitHandler">
            <!-- Company Name -->
            <div>
              <FInput
                id="companyName"
                :label="$t('pages.auth.register.form.companyName.label')"
                name="companyName"
                :placeholder="$t('pages.auth.register.form.companyName.placeholder')"
              />
            </div>

            <!-- Full Name -->
            <div>
              <FInput
                id="fullName"
                :label="$t('pages.auth.register.form.fullName.label')"
                name="fullName"
                :placeholder="$t('pages.auth.register.form.fullName.placeholder')"
              />
            </div>

            <!-- Email -->
            <div>
              <FInput
                id="email"
                type="email"
                :label="$t('pages.auth.register.form.email.label')"
                name="email"
                :placeholder="$t('pages.auth.register.form.email.placeholder')"
              />
            </div>

            <!-- Password -->
            <div>
              <FPassword
                id="password"
                :label="$t('pages.auth.register.form.password.label')"
                name="password"
                :placeholder="$t('pages.auth.register.form.password.placeholder')"
              />
            </div>

            <!-- Submit Button -->
            <Button
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="submit"
              :label="$t('pages.auth.register.form.button')"
              icon="pi pi-user-plus"
              iconPos="right"
              class="w-full !py-2.5 !font-semibold mt-2"
            />
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-slate-600">
              {{ $t('pages.auth.register.haveAccount') }}
              <RouterLink
                class="font-semibold text-purple-600 hover:text-purple-700 transition-colors ml-1"
                :to="{ name: ERouteNames.Login }"
              >
                {{ $t('pages.auth.register.signIn') }}
              </RouterLink>
            </p>
          </div>
        </div>

        <!-- Footer Text -->
        <p class="mt-4 text-center text-xs text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useAuthStore } from '@/stores/auth';

import type { AccountRegisterViewModel } from '@/client';

const router = useRouter();
const { t } = useI18n<{ message: MessageSchema }>();
const authStore = useAuthStore();

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
    const registerPayload: AccountRegisterViewModel = {
      FullName: values.fullName,
      CompanyName: values.companyName,
      Email: values.email,
      Password: values.password,
    };

    await authStore.register(registerPayload);
    showSuccessMessage(t('pages.auth.register.messages.success'));

    // Navigate to login page after successful registration
    router.push({ name: ERouteNames.WorktimeUsage });
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

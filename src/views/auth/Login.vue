<template>
  <AuthLayout adName="login">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Login Card -->
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
              {{ $t('pages.auth.login.title') }}
            </h1>
            <p class="text-sm text-slate-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <!-- Login Form -->
          <form class="space-y-4" @submit="submitHandler">
            <!-- Email Input -->
            <div>
              <FInput
                id="email"
                type="email"
                :label="$t('pages.auth.login.form.email.label')"
                name="email"
                :placeholder="$t('pages.auth.login.form.email.placeholder')"
              />
            </div>

            <!-- Password Input -->
            <div>
              <FPassword
                id="password"
                :label="$t('pages.auth.login.form.password.label')"
                name="password"
                :placeholder="$t('pages.auth.login.form.password.placeholder')"
              />
              <div class="mt-2 text-right">
                <RouterLink
                  class="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  :to="{ name: ERouteNames.ForgotPassword }"
                >
                  {{ $t('pages.auth.login.forgotPassword') }}
                </RouterLink>
              </div>
            </div>

            <!-- Submit Button -->
            <Button
              :disabled="isSubmitting"
              :loading="isSubmitting"
              type="submit"
              :label="$t('pages.auth.login.form.submit')"
              icon="pi pi-sign-in"
              iconPos="right"
              class="w-full !py-2.5 !font-semibold mt-2"
            />
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-slate-500 font-medium">
                {{ $t('common.or') }}
              </span>
            </div>
          </div>

          <!-- Google Login -->
          <Button
            unstyled
            icon="pi pi-google"
            :label="$t('pages.auth.login.googleLogin')"
            :disabled="googleLogin.isProcessing.value"
            :loading="googleLogin.isProcessing.value"
            class="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg py-2.5 px-4 text-slate-700 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="googleLogin.initiateGoogleLogin"
          />

          <!-- Sign Up Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-slate-600">
              {{ $t('pages.auth.login.newHereText') }}
              <RouterLink
                class="font-semibold text-purple-600 hover:text-purple-700 transition-colors ml-1"
                :to="{ name: ERouteNames.Register }"
              >
                {{ $t('pages.auth.login.createAccount') }}
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
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { object,string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { useGoogleLogin } from '@/composables/useGoogleLogin';
import { EGrantType } from '@/enums/grantType.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile/profile';
// import { useCommonUsersStore } from '@/stores/common/users';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
// const commonUsersStore = useCommonUsersStore();
const { showErrorMessage } = useFToast();
const googleLogin = useGoogleLogin();

const validationSchema = object({
  email: string().email().required().label('Email'),
  password: string().required().label('Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = {
      username: values.email,
      password: values.password,
      grant_type: EGrantType.PASSWORD,
    };
    await authStore.login(payload);

    // Load user profile to check role
    await profileStore.filter();

    // Redirect based on role
    if (profileStore.isAdmin) {
      router.push({
        name: ERouteNames.SettingsCompanies,
      });
    } else {
      router.push({
        name: ERouteNames.WorktimeUsage,
      });
    }
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

// Handle Google OAuth callback
onMounted(async () => {
  const { status, key } = route.query;

  // Check if this is a Google OAuth callback
  if (status && key) {
    const success = await googleLogin.handleGoogleCallback(
      status as string,
      key as string,
    );

    if (!success && googleLogin.errorMessage.value) {
      showErrorMessage(googleLogin.errorMessage.value);
    }

    // Clear query parameters from URL
    router.replace({ name: ERouteNames.Login });
  }
});
</script>

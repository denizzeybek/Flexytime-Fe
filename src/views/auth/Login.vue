<template>
  <AuthLayout adName="login">
    <!-- Google OAuth Callback Loading Overlay -->
    <GoogleCallbackLoader v-if="isGoogleCallback" />

    <div v-else class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Login Card -->
      <div class="w-full max-w-md my-auto">
        <!-- Card Container -->
        <div class="rounded-2xl shadow-xl border p-6 sm:p-8 transition-colors duration-300
                    bg-surface-primary dark:bg-surface-elevated
                    border-border-secondary dark:border-border-primary">
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <img
              class="h-14 w-auto dark:brightness-0 dark:invert"
              src="@/components/images/login-logo.png"
              alt="Logo"
            />
          </div>

          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-content-primary mb-1">
              {{ $t('pages.auth.login.title') }}
            </h1>
            <p class="text-sm text-content-secondary">
              {{ $t('pages.auth.login.subtitle') }}
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
              <div class="w-full border-t border-border-primary"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-surface-primary dark:bg-surface-elevated text-content-tertiary font-medium transition-colors">
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
            class="w-full flex items-center justify-center gap-3 rounded-lg py-2.5 px-4 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   bg-surface-primary dark:bg-surface-secondary
                   border-2 border-border-primary hover:border-border-focus
                   hover:bg-interactive-hover dark:hover:bg-interactive-hover
                   text-content-primary"
            @click="googleLogin.initiateGoogleLogin"
          />

          <!-- Sign Up Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-content-secondary">
              {{ $t('pages.auth.login.newHereText') }}
              <RouterLink
                class="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors ml-1"
                :to="{ name: ERouteNames.Register }"
              >
                {{ $t('pages.auth.login.createAccount') }}
              </RouterLink>
            </p>
          </div>
        </div>

        <!-- Footer Text -->
        <p class="mt-4 text-center text-xs text-content-tertiary">
          {{ $t('pages.auth.login.termsAndPrivacy') }}
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { useGoogleLogin } from '@/composables/useGoogleLogin';
import { EGrantType } from '@/enums/grantType.enum';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile/profile';
import GoogleCallbackLoader from '@/views/auth/_components/GoogleCallbackLoader.vue';
// import { useCommonUsersStore } from '@/stores/common/users';

const route = useRoute();
const router = useRouter();
const { t } = useI18n<{ message: MessageSchema }>();
const authStore = useAuthStore();
const profileStore = useProfileStore();
// const commonUsersStore = useCommonUsersStore();
const { showErrorMessage } = useFToast();
const googleLogin = useGoogleLogin();

const validationSchema = object({
  email: string().email().required().label(t('pages.auth.login.form.email.label')),
  password: string().required().label(t('pages.auth.login.form.password.label')),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

// Check if this is a Google OAuth callback (show loading screen instead of login form)
const isGoogleCallback = computed(() => {
  const { status, key } = route.query;
  return !!(status && key);
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
      router.replace({ name: ERouteNames.Login });
    }
  }
});
</script>

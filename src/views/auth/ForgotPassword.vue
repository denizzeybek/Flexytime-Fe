<template>
  <AuthLayout adName="forgot-password">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Forgot Password Card -->
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

          <!-- Success State - Email Sent -->
          <template v-if="emailSent">
            <div class="text-center mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                          bg-state-success-bg dark:bg-state-success-bg">
                <i class="pi pi-envelope text-2xl text-state-success"></i>
              </div>
              <h1 class="text-2xl font-bold text-content-primary mb-2">
                {{ t('pages.auth.forgotPassword.emailSent.title') }}
              </h1>
              <p class="text-sm text-content-secondary">
                {{ t('pages.auth.forgotPassword.emailSent.description') }}
              </p>
            </div>

            <!-- Info Box -->
            <div class="rounded-xl p-4 mb-6 transition-colors
                        bg-state-info-bg border border-state-info-border">
              <div class="flex gap-3">
                <i class="pi pi-info-circle text-state-info mt-0.5"></i>
                <div class="text-sm text-content-primary">
                  <p class="font-medium mb-1">{{ t('pages.auth.forgotPassword.emailSent.infoTitle') }}</p>
                  <ul class="list-disc list-inside space-y-1 text-content-secondary">
                    <li>{{ t('pages.auth.forgotPassword.emailSent.checkInbox') }}</li>
                    <li>{{ t('pages.auth.forgotPassword.emailSent.checkSpam') }}</li>
                    <li>{{ t('pages.auth.forgotPassword.emailSent.linkExpiry') }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Resend / Back Actions -->
            <div class="space-y-3">
              <Button
                :label="resendButtonLabel"
                severity="secondary"
                outlined
                class="w-full"
                :icon="canResend ? 'pi pi-refresh' : undefined"
                :disabled="!canResend"
                @click="handleResend"
              />
              <RouterLink
                class="block text-center text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                :to="{ name: ERouteNames.Login }"
              >
                ← {{ t('pages.auth.forgotPassword.backToLogin') }}
              </RouterLink>
            </div>
          </template>

          <!-- Initial State - Form -->
          <template v-else>
            <!-- Header -->
            <div class="text-center mb-6">
              <h1 class="text-2xl font-bold text-content-primary mb-1">
                {{ t('pages.auth.forgotPassword.title') }}
              </h1>
              <p class="text-sm text-content-secondary">
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
                class="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                :to="{ name: ERouteNames.Login }"
              >
                ← {{ t('pages.auth.forgotPassword.backToLogin') }}
              </RouterLink>
            </div>
          </template>
        </div>

        <!-- Footer Text -->
        <p class="mt-4 text-center text-xs text-content-tertiary">
          {{ t('pages.auth.forgotPassword.footer') }}
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { AccountApiService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

const RESEND_COOLDOWN_SECONDS = 60;

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage, showSuccessMessage } = useFToast();

const validationSchema = object({
  email: string().required().email().label(t('pages.auth.forgotPassword.form.email.label')),
});

const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema,
});

const emailSent = ref(false);
const lastEmail = ref('');
const resendCountdown = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const canResend = computed(() => resendCountdown.value === 0);

const resendButtonLabel = computed(() => {
  if (resendCountdown.value > 0) {
    return t('pages.auth.forgotPassword.emailSent.resendIn', { seconds: resendCountdown.value });
  }
  return t('pages.auth.forgotPassword.emailSent.resend');
});

const startResendCooldown = () => {
  resendCountdown.value = RESEND_COOLDOWN_SECONDS;

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
    }
  }, 1000);
};

const submitHandler = handleSubmit(async (formValues) => {
  try {
    await AccountApiService.accountApiForgot({
      Email: formValues.email,
    });

    lastEmail.value = formValues.email;
    emailSent.value = true;
    startResendCooldown();
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});

const handleResend = async () => {
  if (!canResend.value) return;

  try {
    await AccountApiService.accountApiForgot({
      Email: lastEmail.value || values.email,
    });
    showSuccessMessage(t('pages.auth.forgotPassword.emailSent.resendSuccess'));
    startResendCooldown();
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
};

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

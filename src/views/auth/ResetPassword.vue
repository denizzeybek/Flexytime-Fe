<template>
  <AuthLayout adName="reset-password">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <!-- Reset Password Card -->
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
              {{ t('pages.auth.resetPassword.title') }}
            </h1>
            <p class="text-sm text-slate-600">
              {{ t('pages.auth.resetPassword.description') }}
            </p>
          </div>

          <!-- Reset Password Form -->
          <form class="space-y-4" @submit="submitHandler">
            <!-- Email Input (Disabled) -->
            <div>
              <FInput
                id="email"
                :label="t('pages.auth.resetPassword.form.email.label')"
                name="email"
                type="email"
                disabled
                :model-value="email"
              />
            </div>

            <!-- Password Input -->
            <div>
              <FPassword
                id="password"
                :label="t('pages.auth.resetPassword.form.password.label')"
                name="password"
                :placeholder="t('pages.auth.resetPassword.form.password.placeholder')"
              />
            </div>

            <!-- Confirm Password Input -->
            <div>
              <FPassword
                id="confirmPassword"
                :label="t('pages.auth.resetPassword.form.confirmPassword.label')"
                name="confirmPassword"
                :placeholder="t('pages.auth.resetPassword.form.confirmPassword.placeholder')"
              />
            </div>

            <!-- Submit Button -->
            <Button
              :disabled="isSubmitting || !isValidLink"
              :loading="isSubmitting"
              type="submit"
              :label="t('pages.auth.resetPassword.form.button')"
              icon="pi pi-check"
              iconPos="right"
              class="w-full !py-2.5 !font-semibold mt-2"
            />
          </form>

          <!-- Invalid Link Message -->
          <div v-if="!isValidLink" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600 text-center">
              {{ t('pages.auth.resetPassword.messages.invalidLink') }}
            </p>
          </div>

          <!-- Back to Login -->
          <div class="mt-6 text-center">
            <RouterLink
              class="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              :to="{ name: ERouteNames.Login }"
            >
              ← {{ t('pages.auth.resetPassword.backToLogin') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { object, ref as yupRef, string } from 'yup';

import { AccountApiService } from '@/client';
import { useFToast } from '@/composables/useFToast';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';

const { t } = useI18n<{ message: MessageSchema }>();
const route = useRoute();
const router = useRouter();

const { showSuccessMessage, showErrorMessage } = useFToast();

const email = ref('');
const code = ref('');

const isValidLink = computed(() => {
  return !!email.value && !!code.value;
});

const validationSchema = object({
  password: string().required().min(6).label('Password'),
  confirmPassword: string()
    .required()
    .oneOf([yupRef('password')], 'Passwords must match')
    .label('Confirm Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    if (!isValidLink.value) {
      showErrorMessage(t('pages.auth.resetPassword.messages.invalidLink'));
      return;
    }

    await AccountApiService.accountApiReset({
      Email: email.value,
      Password: values.password,
      ConfirmPassword: values.confirmPassword,
      Code: code.value,
    });

    showSuccessMessage(t('pages.auth.resetPassword.messages.success'));
    router.push({ name: ERouteNames.Login });
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});

onMounted(() => {
  email.value = (route.query.email as string) || '';
  // URL'deki + karakterleri space olarak gelir, geri çeviriyoruz
  const rawCode = (route.query.code as string) || '';
  code.value = rawCode.replace(/\s/g, '+');
});
</script>

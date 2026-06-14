<template>
  <AuthLayout adName="register">
    <div class="flex items-center justify-center flex-1 w-full px-4">
      <div class="w-full max-w-md my-auto">
        <div
          class="rounded-2xl shadow-xl border p-6 sm:p-8 transition-colors duration-300
                 bg-surface-primary dark:bg-surface-elevated
                 border-border-secondary dark:border-border-primary"
        >
          <!-- Logo -->
          <div class="flex justify-center mb-6">
            <img
              class="h-14 w-auto dark:brightness-0 dark:invert"
              src="@/components/images/login-logo.png"
              alt="Logo"
            />
          </div>

          <!-- Loading -->
          <div v-if="phase === 'loading'" class="flex flex-col items-center gap-3 py-8">
            <ProgressSpinner style="width: 2rem; height: 2rem" />
            <span class="text-content-secondary text-sm">
              {{ $t('pages.auth.invite.loading') }}
            </span>
          </div>

          <!-- Bad / expired token -->
          <div v-else-if="phase === 'invalid'" class="flex flex-col items-center gap-3 py-6 text-center">
            <i class="pi pi-times-circle text-4xl text-red-500"></i>
            <h1 class="text-xl font-bold text-content-primary">
              {{ $t('pages.auth.invite.invalid.title') }}
            </h1>
            <p class="text-sm text-content-secondary">
              {{ $t('pages.auth.invite.invalid.body') }}
            </p>
            <RouterLink :to="{ name: ERouteNames.Login }">
              <Button
                :label="$t('pages.auth.invite.invalid.goToLogin')"
                severity="secondary"
                size="small"
              />
            </RouterLink>
          </div>

          <!-- Welcome form -->
          <template v-else-if="phase === 'welcome'">
            <div class="text-center mb-6">
              <h1 class="text-2xl font-bold text-content-primary mb-1">
                {{ $t('pages.auth.invite.welcome.title', { company: ctx?.CompanyName ?? '' }) }}
              </h1>
              <p class="text-sm text-content-secondary">
                {{ $t('pages.auth.invite.welcome.subtitle', { email: ctx?.Email ?? '' }) }}
              </p>
            </div>

            <form class="space-y-4" @submit="submitHandler">
              <FInput
                id="fullname"
                type="text"
                :label="$t('pages.auth.invite.form.fullname.label')"
                :placeholder="$t('pages.auth.invite.form.fullname.placeholder')"
                name="fullname"
              />
              <FPassword
                id="password"
                :label="$t('pages.auth.invite.form.password.label')"
                :placeholder="$t('pages.auth.invite.form.password.placeholder')"
                name="password"
              />

              <Button
                :disabled="isSubmitting"
                :loading="isSubmitting"
                type="submit"
                :label="$t('pages.auth.invite.form.submit')"
                icon="pi pi-check"
                iconPos="right"
                class="w-full !py-2.5 !font-semibold mt-2"
              />
            </form>
          </template>

          <!-- Success — show agent download buttons -->
          <div v-else-if="phase === 'done'" class="flex flex-col items-center gap-4 py-2 text-center">
            <i class="pi pi-check-circle text-4xl text-green-500"></i>
            <h1 class="text-xl font-bold text-content-primary">
              {{ $t('pages.auth.invite.done.title') }}
            </h1>
            <p class="text-sm text-content-secondary">
              {{ $t('pages.auth.invite.done.body') }}
            </p>

            <div class="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <Button
                as="a"
                :href="MAC_DOWNLOAD"
                :label="$t('pages.auth.invite.done.downloadMac')"
                icon="pi pi-apple"
                iconPos="left"
                class="flex-1 !py-2.5"
              />
              <Button
                as="a"
                :href="WINDOWS_DOWNLOAD"
                :label="$t('pages.auth.invite.done.downloadWindows')"
                icon="pi pi-microsoft"
                iconPos="left"
                severity="secondary"
                class="flex-1 !py-2.5"
              />
            </div>

            <RouterLink :to="{ name: ERouteNames.Login }" class="mt-3">
              <Button
                :label="$t('pages.auth.invite.done.goToLogin')"
                text
                size="small"
                icon="pi pi-sign-in"
              />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import { ERouteNames } from '@/router/routeNames.enum';
import { acceptInvite, type InviteLookup,lookupInvite } from '@/services/invite';

type Phase = 'loading' | 'invalid' | 'welcome' | 'done';

const MAC_DOWNLOAD = 'https://download.flexytime.com/flexyagent-mac.dmg';
const WINDOWS_DOWNLOAD = 'https://download.flexytime.com/flexyagent-win.exe';

const route = useRoute();
const phase = ref<Phase>('loading');
const ctx = ref<InviteLookup | null>(null);

const id = String(route.params.id ?? '');
const token = String(route.query.token ?? '');

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: object({
    fullname: string().required().min(1).max(200).label('Fullname'),
    password: string().required().min(6).max(128).label('Password'),
  }),
});

onMounted(async () => {
  if (!id || !token) {
    phase.value = 'invalid';
    return;
  }
  try {
    const result = await lookupInvite(id, token);
    ctx.value = result;
    phase.value = result.AlreadyAccepted ? 'done' : 'welcome';
  } catch {
    phase.value = 'invalid';
  }
});

const submitHandler = handleSubmit(async (values) => {
  try {
    const result = await acceptInvite(id, {
      Token: token,
      Password: values.password as string,
      Fullname: values.fullname as string,
    });
    ctx.value = result;
    phase.value = 'done';
  } catch {
    phase.value = 'invalid';
  }
});
</script>

<template>
  <AuthLayout adName="login">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center"> {{ $t('pages.auth.login.title') }} </FText>

      <form class="flex flex-col gap-5" @submit="submitHandler">
        <FInput type="email" id="email" :label="$t('pages.auth.login.form.email.label')" name="email" :placeholder="$t('pages.auth.login.form.email.placeholder')" />

        <div class="relative">
          <FPassword id="password" :label="$t('pages.auth.login.form.password.label')" name="password" :placeholder="$t('pages.auth.login.form.password.placeholder')" />
          <RouterLink
            class="underline text-f-black flex justify-center"
            :to="{ name: ERouteNames.ForgotPassword }"
          >
            {{ $t('pages.auth.login.forgotPassword') }}
          </RouterLink>
        </div>

        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="$t('pages.auth.login.form.submit')"
          icon="pi pi-user"
          class="w-full"
        />
      </form>
      <div class="relative bg-f-black/40 max-w-full h-[1px] my-8 mx-3">
        <FText
          class="absolute px-2.5 -translate-x-1/2 -translate-y-1/2 text-f-black bg-r-db-bg left-1/2 top-1/2 bg-f-tertiary-purple"
        >
          {{ $t('common.or') }}
        </FText>
      </div>
      <Button
        unstyled
        icon="pi pi-google"
        :label="$t('pages.auth.login.googleLogin')"
        class="flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 px-4 text-f-black"
      />

      <div class="flex gap-2 justify-center mt-8">
        <span>{{ $t('pages.auth.login.newHereText') }}</span
        ><RouterLink class="underline" :to="{ name: ERouteNames.Register }">
          {{ $t('pages.auth.login.createAccount') }}
        </RouterLink>
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
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { EGrantType } from '@/enums/grantType.enum';
// import { useProfileStore } from '@/stores/profile/profile';
// import { useCommonUsersStore } from '@/stores/common/users';

const router = useRouter();
const authStore = useAuthStore();
// const profileStore = useProfileStore();
// const commonUsersStore = useCommonUsersStore();
const { showErrorMessage } = useFToast();

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
    // const user = await profileStore.filter();
    // commonUsersStore.setUser(user as any);
    router.push({
      name: ERouteNames.WorktimeUsage,
    });
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
</script>

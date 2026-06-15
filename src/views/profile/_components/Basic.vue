<template>
  <div class="flex flex-col gap-8">
    <div class="bg-surface-primary rounded-xl border border-border-secondary dark:border-border-primary p-6 transition-colors">
      <h3 class="text-lg font-semibold text-content-primary mb-6">{{ t('pages.profile.basic.sections.personalInfo') }}</h3>
      <form class="flex flex-col gap-6" @submit.prevent="submitHandler">
        <div class="flex items-center flex-col lg:flex-row gap-8">
          <div class="flex items-center justify-center flex-col gap-4">
            <div class="relative w-[120px] h-[120px]">
              <template v-if="hasProfileImage">
                <FAvatar
                  custom-class="!w-[120px] !h-[120px]"
                  :prime-props="{
                    image: profileStore?.GeneralProfile.imageUrl,
                    shape: 'circle',
                  }"
                />
              </template>
              <template v-else>
                <img
                  v-if="src"
                  :src="src"
                  :alt="t('pages.profile.basic.profileImage.alt')"
                  class="shadow-md rounded-full w-[120px] h-[120px] object-cover"
                />
                <div
                  v-else
                  class="w-[120px] h-[120px] flex items-center justify-center border-2 rounded-full border-border-secondary dark:border-border-primary bg-surface-tertiary dark:bg-surface-secondary transition-colors"
                >
                  <span class="pi pi-user !text-5xl text-content-quaternary"></span>
                </div>
              </template>
              <button
                v-if="hasProfileImage || src"
                type="button"
                :disabled="isImageUploading"
                :aria-label="t('pages.profile.basic.removeImage.label')"
                :title="t('pages.profile.basic.removeImage.label')"
                class="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                @click="onRemoveImage"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <FileUpload
              mode="basic"
              customUpload
              auto
              severity="secondary"
              class="p-button-outlined"
              :disabled="isImageUploading"
              @select="onFileSelect"
            />
          </div>

          <div class="flex flex-col flex-1 gap-4 w-full">
            <FInput
              id="fullName"
              :label="t('pages.profile.basic.fullName.label')"
              :placeholder="t('pages.profile.basic.fullName.placeholder')"
              name="fullName"
            />
            <div class="flex flex-col gap-1">
              <FInput
                id="email"
                type="email"
                :label="t('pages.profile.basic.email.label')"
                :placeholder="t('pages.profile.basic.email.placeholder')"
                name="email"
                disabled
              />
              <a
                v-if="!isEmailConfirmed"
                href="#"
                class="text-sm text-primary-500 underline hover:text-primary-600"
                @click.prevent="onResendConfirmation"
              >
                {{ t('pages.profile.basic.resendConfirmation') }}
              </a>
            </div>
          </div>
        </div>

        <FInput
          id="role"
          :label="t('pages.profile.basic.role.label')"
          name="role"
          disabled
        />

        <div class="flex justify-end">
          <Button
            type="submit"
            :label="t('pages.profile.basic.save.label')"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          />
        </div>
      </form>
    </div>

    <BasicPreferencesCard />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

import BasicPreferencesCard from './BasicPreferencesCard.vue';

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const profileStore = useProfileStore();

const validationSchema = object({
  fullName: string().required().label(t('pages.profile.basic.fullName.label')),
  email: string().required().email().label(t('pages.profile.basic.email.label')),
  role: string().label(t('pages.profile.basic.role.label')),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

const src = ref<string | null>(null);
const isImageUploading = ref(false);

const hasProfileImage = computed(() => !!profileStore?.GeneralProfile.imageUrl);
const isEmailConfirmed = computed(() => profileStore?.GeneralProfile?.EmailConfirmed ?? true);

const getInitialFormData = computed(() => {
  const profile = profileStore?.GeneralProfile;
  const roles = profile?.Wizard?.Roles ?? [];
  const roleLabel = roles.length > 0 ? roles.map((r) => r[0]?.toUpperCase() + r.slice(1)).join(', ') : '';
  return {
    fullName: profile?.fullname || '',
    email: profile?.email || '',
    role: roleLabel,
  };
});

const submitHandler = handleSubmit(async (values) => {
  try {
    await profileStore.updateProfile({ fullname: values.fullName });
    showSuccessMessage(t('pages.profile.basic.messages.updated'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});

// reason: PrimeVue FileUpload's @select event payload type isn't exported on v4; using any here mirrors the original.
const onFileSelect = async (event: any) => {
  const file = event.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e?.target?.result;
    src.value = typeof result === 'string' ? result : null;
  };
  reader.readAsDataURL(file);
  isImageUploading.value = true;
  try {
    await profileStore.uploadProfileImage(file);
    showSuccessMessage(t('pages.profile.basic.messages.imageUpdated'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
    src.value = null;
  } finally {
    isImageUploading.value = false;
  }
};

const onRemoveImage = async () => {
  isImageUploading.value = true;
  try {
    await profileStore.removeProfileImage();
    src.value = null;
    showSuccessMessage(t('pages.profile.basic.messages.imageRemoved'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  } finally {
    isImageUploading.value = false;
  }
};

const onResendConfirmation = async () => {
  try {
    await profileStore.resendConfirmation();
    showSuccessMessage(t('pages.profile.basic.messages.confirmationSent'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
};

onMounted(async () => {
  await profileStore.filter();
  resetForm({ values: getInitialFormData.value });
});
</script>

<style scoped></style>

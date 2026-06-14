<template>
  <div class="flex flex-col gap-8">
    <!-- Personal Info Section (saved with button) -->
    <div class="bg-surface-primary rounded-xl border border-border-secondary dark:border-border-primary p-6 transition-colors">
      <h3 class="text-lg font-semibold text-content-primary mb-6">{{ t('pages.profile.basic.sections.personalInfo') }}</h3>
      <form class="flex flex-col gap-6" @submit.prevent="submitHandler">
        <div class="flex items-center flex-col lg:flex-row gap-8">
          <!-- Avatar -->
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

          <!-- Name & Email -->
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

        <!-- Role (read-only) -->
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

    <!-- Preferences Section (auto-save on change) -->
    <div class="bg-surface-primary rounded-xl border border-border-secondary dark:border-border-primary p-6 transition-colors">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-content-primary">{{ t('pages.profile.basic.sections.preferences') }}</h3>
        <span class="text-xs text-content-quaternary">{{ t('pages.profile.basic.sections.autoSave') }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Language -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">{{ t('pages.profile.basic.language.label') }}</label>
          <Select
            v-model="selectedLanguageModel"
            :options="languageOptions"
            optionLabel="name"
            :placeholder="t('pages.profile.basic.language.placeholder')"
            class="w-full"
            :loading="isLanguageLoading"
            @update:model-value="handleLanguageChange"
          />
        </div>

        <!-- Timezone -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">{{ t('pages.profile.basic.timezone.label') }}</label>
          <Select
            v-model="selectedTimezoneModel"
            :options="timeZoneList"
            optionLabel="name"
            :placeholder="t('pages.profile.basic.timezone.placeholder')"
            class="w-full"
            filter
            :loading="isTimezoneLoading"
            @update:model-value="handleTimezoneChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Select from 'primevue/select';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { useLanguage } from '@/composables/useLanguage';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const profileStore = useProfileStore();
const { currentLanguage, changeLanguage, getLanguageOptions } = useLanguage();

const validationSchema = object({
  fullName: string().required().label(t('pages.profile.basic.fullName.label')),
  email: string().required().email().label(t('pages.profile.basic.email.label')),
  role: string().label(t('pages.profile.basic.role.label')),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const src = ref();
const isLanguageLoading = ref(false);
const isTimezoneLoading = ref(false);
const isImageUploading = ref(false);

const languageOptions = getLanguageOptions();
const selectedLanguageModel = ref<{ name: string; value: 'en' | 'tr' } | undefined>(
  languageOptions.find((lang) => lang.value === currentLanguage.value),
);

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const selectedTimezoneModel = ref<{ name: string | undefined; value: string | undefined } | undefined>();

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
    await profileStore.updateProfile({
      fullname: values.fullName,
    });
    showSuccessMessage(t('pages.profile.basic.messages.updated'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});

const onFileSelect = async (event: any) => {
  const file = event.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    src.value = e?.target?.result;
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

const handleLanguageChange = async (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    isLanguageLoading.value = true;
    try {
      await profileStore.updateLanguageCode(option.value);
      await changeLanguage(option.value);
      showSuccessMessage(t('pages.profile.basic.messages.languageUpdated'));
    } catch {
      showErrorMessage(t('common.errors.generic'));
    } finally {
      isLanguageLoading.value = false;
    }
  }
};

const handleTimezoneChange = async (option: { name: string; value: string }) => {
  if (option && option.value) {
    isTimezoneLoading.value = true;
    try {
      await profileStore.updateTimezone(option.value);
      showSuccessMessage(t('pages.profile.basic.messages.timezoneUpdated'));
    } catch {
      showErrorMessage(t('common.errors.generic'));
    } finally {
      isTimezoneLoading.value = false;
    }
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

watch(currentLanguage, (newLang) => {
  selectedLanguageModel.value = languageOptions.find((lang) => lang.value === newLang);
});

onMounted(async () => {
  await Promise.all([profileStore.filter(), profileStore.fetchTimezones()]);

  selectedLanguageModel.value = languageOptions.find(
    (lang) => lang.value === currentLanguage.value,
  );

  const timeZone = profileStore?.TimeZone;
  selectedTimezoneModel.value = timeZoneList.value?.find((item) => item.value === timeZone);

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

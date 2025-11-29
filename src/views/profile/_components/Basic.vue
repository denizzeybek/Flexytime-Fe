<template>
  <div class="flex flex-col gap-8">
    <!-- Personal Info Section (saved with button) -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold mb-6">{{ t('pages.profile.basic.sections.personalInfo') }}</h3>
      <form class="flex flex-col gap-6" @submit.prevent="submitHandler">
        <div class="flex items-center flex-col lg:flex-row gap-8">
          <!-- Avatar -->
          <div class="flex items-center justify-center flex-col gap-4">
            <template v-if="hasProfileImage">
              <FAvatar
                custom-class="!w-[120px] !h-[120px]"
                :prime-props="{
                  image: profileStore?.GeneralProfile.ImagePath,
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
                class="w-[120px] h-[120px] flex items-center justify-center border-2 rounded-full border-gray-300 bg-gray-50"
              >
                <span class="pi pi-user !text-5xl text-gray-400"></span>
              </div>
            </template>
            <FileUpload
              mode="basic"
              customUpload
              auto
              severity="secondary"
              class="p-button-outlined"
              @select="onFileSelect"
            />
          </div>

          <!-- Name & Email -->
          <div class="flex flex-col flex-1 gap-4 w-full">
            <FInput
              id="fullName"
              :label="t('pages.profile.basic.fullName.label')"
              name="fullName"
            />
            <div class="flex flex-col gap-1">
              <FInput
                id="email"
                type="email"
                :label="t('pages.profile.basic.email.label')"
                name="email"
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
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">{{ t('pages.profile.basic.sections.preferences') }}</h3>
        <span class="text-xs text-gray-400">{{ t('pages.profile.basic.sections.autoSave') }}</span>
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
  fullName: string().required().label('Full Name'),
  email: string().required().email().label('Email'),
  role: string().label('Role'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const src = ref();
const isLanguageLoading = ref(false);
const isTimezoneLoading = ref(false);

// Language options and model (independent from form)
const languageOptions = getLanguageOptions();
const selectedLanguageModel = ref<{ name: string; value: 'en' | 'tr' } | undefined>(
  languageOptions.find((lang) => lang.value === currentLanguage.value),
);

// Timezone options and model
const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const selectedTimezoneModel = ref<{ name: string | undefined; value: string | undefined } | undefined>();

const hasProfileImage = computed(() => !!profileStore?.GeneralProfile.ImagePath);
const isEmailConfirmed = computed(() => profileStore?.GeneralProfile?.EmailConfirmed ?? true);

const getInitialFormData = computed(() => {
  const user = profileStore?.User;

  return {
    fullName: user?.fullname || '',
    email: user?.Email || '',
    role: user?.title || '',
  };
});

const submitHandler = handleSubmit(async (values) => {
  try {
    await profileStore.updateProfile({
      Fullname: values.fullName,
      EmailAddress: values.email,
    });
    showSuccessMessage(t('pages.profile.basic.messages.updated'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
});

const onFileSelect = (event: any) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e?.target?.result;
    // TODO: Implement image upload API call
  };

  reader.readAsDataURL(file);
};

// Handle language change - saves to backend and updates UI
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

// Handle timezone change - saves to backend immediately
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

// Resend email confirmation
const onResendConfirmation = async () => {
  try {
    await profileStore.resendConfirmation();
    showSuccessMessage(t('pages.profile.basic.messages.confirmationSent'));
  } catch {
    showErrorMessage(t('common.errors.generic'));
  }
};

// Watch currentLanguage changes and update model
watch(currentLanguage, (newLang) => {
  selectedLanguageModel.value = languageOptions.find((lang) => lang.value === newLang);
});

onMounted(async () => {
  await profileStore.filter();

  // Set initial language model
  selectedLanguageModel.value = languageOptions.find(
    (lang) => lang.value === currentLanguage.value,
  );

  // Set initial timezone model
  const timeZone = profileStore?.TimeZone;
  selectedTimezoneModel.value = timeZoneList.value?.find((item) => item.value === timeZone);

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

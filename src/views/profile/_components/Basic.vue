<template>
  <form class="flex flex-col gap-8">
    <div class="flex items-center flex-col lg:flex-row gap-12">
      <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
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
            class="shadow-md rounded-xl w-full sm:w-64"
            style="filter: grayscale(100%)"
          />
          <div
            v-else
            class="w-[120px] h-[120px] flex items-center justify-center border-2 rounded-full border-f-black"
          >
            <span class="pi pi-user !text-6xl"></span>
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
      <div class="flex lg:flex-col flex-1 gap-4">
        <FInput id="fullName" class="grow" :label="t('pages.profile.basic.fullName.label')" name="fullName" />
        <FInput id="email" class="grow" type="email" :label="t('pages.profile.basic.email.label')" name="email" />
      </div>
    </div>
    <div class="flex gap-4 flex-1">
      <FInput id="role" class="grow" :label="t('pages.profile.basic.role.label')" name="role" />
      <div class="flex flex-col gap-2 grow">
        <label class="text-sm font-medium">{{ t('pages.profile.basic.language.label') }}</label>
        <Select
          v-model="selectedLanguageModel"
          :options="languageOptions"
          optionLabel="name"
          :placeholder="t('pages.profile.basic.language.placeholder')"
          class="w-full"
          @update:model-value="handleLanguageChange"
        />
      </div>
    </div>

    <div class="grow">
      <FSelect
        class="grow"
        :label="t('pages.profile.basic.timezone.label')"
        name="timeZone"
        :placeholder="t('pages.profile.basic.timezone.placeholder')"
        :options="timeZoneList"
      />
    </div>

    <div class="flex justify-center gap-2">
      <Button
        type="submit"
        :label="t('pages.profile.basic.save.label')"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click.stop="submitHandler"
      ></Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Select from 'primevue/select';
import { useForm } from 'vee-validate';
import { object,string } from 'yup';

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
  role: string().required().label('Role'),
  timeZone: object().shape({
    name: string().label('Name'),
    value: string().label('Time zone').required(),
  }),
});

const { handleSubmit,  isSubmitting, resetForm } = useForm({
  validationSchema,
});

const src = ref();

// Language options and model (independent from form)
const languageOptions = getLanguageOptions();
const selectedLanguageModel = ref<{ name: string; value: 'en' | 'tr' } | undefined>(
  languageOptions.find((lang) => lang.value === currentLanguage.value),
);

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const hasProfileImage = computed(() => !!profileStore?.GeneralProfile.ImagePath);

const getInitialFormData = computed(() => {
  const user = profileStore?.User;
  const timeZone = profileStore?.TimeZone;
  const timeZoneName = timeZoneList.value.find((item) => item.value === timeZone)?.name;

  return {
    fullName: user.fullname,
    email: user.Email,
    role: user.title,
    timeZone: { name: timeZoneName, value: timeZone },
  };
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.profile.basic.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const onFileSelect = (event) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e?.target?.result;
  };

  reader.readAsDataURL(file);
};

// Handle language change - independent from form
const handleLanguageChange = async (option: { name: string; value: 'en' | 'tr' }) => {
  if (option && option.value) {
    await changeLanguage(option.value);
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

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

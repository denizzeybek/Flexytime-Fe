<template>
  <form class="flex flex-col gap-8">
    <div class="flex items-center flex-col lg:flex-row gap-12">
      <div class="flex items-center justify-center flex-col gap-4 w-[282px]">
        <img
          v-if="src"
          :src="src"
          alt="Image"
          class="shadow-md rounded-xl w-full sm:w-64"
          style="filter: grayscale(100%)"
        />
        <div
          v-else
          class="w-[100px] h-[100px] flex items-center justify-center border-2 rounded-full border-f-black"
        >
          <span class="pi pi-user !text-6xl"></span>
        </div>
        <FileUpload
          mode="basic"
          @select="onFileSelect"
          customUpload
          auto
          severity="secondary"
          class="p-button-outlined"
        />
      </div>
      <div class="flex lg:flex-col flex-1 gap-4">
        <FInput class="grow" id="fullName" label="Full Name" name="fullName" />
        <FInput class="grow" type="email" id="email" label="Email" name="email" />
      </div>
    </div>
    <div class="flex gap-4 flex-1">
      <FInput class="grow" id="role" label="Role" name="role" />
      <FSelect
        class="grow"
        label="Language"
        name="language"
        placeholder="Select language"
        :options="languagesList"
      />
    </div>

    <div class="grow">
      <FSelect
        class="grow"
        label="Timezone"
        name="timeZone"
        placeholder="Select timezone"
        :options="timeZoneList"
      />
    </div>

    <div class="flex justify-center gap-2">
      <Button
        type="submit"
        label="Save"
        :disabled="isSubmitting"
        @click.stop="submitHandler"
        :loading="isSubmitting"
      ></Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { useProfileStore } from '@/stores/profile/profile';
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();
const profileStore = useProfileStore();

const src = ref();

const languagesList = [
  { name: 'Turkish', value: 'tr' },
  { name: 'English', value: 'en' },
];

const timeZoneList = computed(() =>
  profileStore?.TimeZoneList?.map((item) => ({ name: item.Name, value: item.ID })),
);

const validationSchema = object({
  fullName: string().required().label('Full Name'),
  email: string().required().email().label('Email'),
  role: string().required().label('Role'),
  language: object().shape({
    name: string().label('Name'),
    value: string().label('language').required(),
  }),
  timeZone: object().shape({
    name: string().label('Name'),
    value: string().label('Time zone').required(),
  }),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage('working hours updated!');
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

const getInitialFormData = computed(() => {
  const user = profileStore?.User;
  const timeZone = profileStore?.TimeZone;
  const timeZoneName = timeZoneList.value.find((item) => item.value === timeZone)?.name;
  const LanguageCode = profileStore?.LanguageCode;
  const LanguageName = languagesList.find((item) => item.value === LanguageCode)?.name;

  return {
    fullName: user.fullname,
    email: user.Email,
    role: user.title,
    timeZone: { name: timeZoneName, value: timeZone },
    language: { name: LanguageName, value: LanguageCode },
  };
});

onMounted(async () => {
  await profileStore.filter();

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

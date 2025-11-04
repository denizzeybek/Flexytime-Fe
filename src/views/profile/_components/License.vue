<template>
  <div>
    <form class="flex flex-col gap-8">
      <div class="flex flex-col flex-1 gap-4">
        <FInput id="companyName" disabled class="grow" :label="t('pages.profile.license.companyName.label')" name="companyName" />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput id="totalUser" disabled class="flex-1" :label="t('pages.profile.license.totalUser.label')" name="totalUser" />
        <FInput
          id="licensedUser"
          disabled
          class="flex-1"
          :label="t('pages.profile.license.licensedUser.label')"
          name="licensedUser"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          id="licansePurchased"
          disabled
          class="flex-1"
          :label="t('pages.profile.license.licensePurchased.label')"
          name="licansePurchased"
        />
        <FInput
          id="licanseRemained"
          disabled
          class="flex-1"
          :label="t('pages.profile.license.licenseRemained.label')"
          name="licanseRemained"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput id="expireDate" disabled class="flex-1" :label="t('pages.profile.license.expireDate.label')" name="expireDate" />
        <FInput id="daysLeft" disabled class="flex-1" :label="t('pages.profile.license.daysLeft.label')" name="daysLeft" />
      </div>
    </form>
    <div class="flex justify-center mt-4">
      <Button
        type="button"
        severity="warn"
        :label="t('pages.profile.license.buyLicense.label')"
        @click="router.push({ name: ERouteNames.Classification })"
        @click.stop="submitHandler"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useForm } from 'vee-validate';
import { object,string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useProfileStore } from '@/stores/profile/profile';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const profileStore = useProfileStore();
const router = useRouter();

// const hasProfileImage = computed(() => !!profileStore?.GeneralProfile.ImagePath);

const validationSchema = object({
  companyName: string().required().label('Company Name'),
  totalUser: string().required().label('Total User'),
  licensedUser: string().required().label('Licensed User'),
  licansePurchased: string().required().label('Licanse Purchased'),
  licanseRemained: string().required().label('Licanse Remained'),
  expireDate: string().required().label('Expire Date'),
  daysLeft: string().required().label('Days Left'),
});

const { handleSubmit,  resetForm } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.profile.license.messages.updated'));
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const getInitialFormData = computed(() => {
  const license = profileStore?.License;

  return {
    companyName: license.CustomerName,
    totalUser: license.TotalUsers,
    licensedUser: license.LicensedUsers,
    licansePurchased: license.LicensedUsers,
    licanseRemained: license.RemainingUsers,
    expireDate: license.ExpireDate,
    daysLeft: license.RemainingDays,
  };
});

onMounted(async () => {
  await profileStore.filterLicense();

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

<style scoped></style>

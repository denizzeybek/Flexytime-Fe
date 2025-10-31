<template>
  <div>
    <form class="flex flex-col gap-8">
      <div class="flex flex-col flex-1 gap-4">
        <FInput disabled class="grow" id="companyName" :label="t('pages.profile.license.companyName.label')" name="companyName" />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput disabled class="flex-1" id="totalUser" :label="t('pages.profile.license.totalUser.label')" name="totalUser" />
        <FInput
          disabled
          class="flex-1"
          id="licensedUser"
          :label="t('pages.profile.license.licensedUser.label')"
          name="licensedUser"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          disabled
          class="flex-1"
          id="licansePurchased"
          :label="t('pages.profile.license.licensePurchased.label')"
          name="licansePurchased"
        />
        <FInput
          disabled
          class="flex-1"
          id="licanseRemained"
          :label="t('pages.profile.license.licenseRemained.label')"
          name="licanseRemained"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput disabled class="flex-1" id="expireDate" :label="t('pages.profile.license.expireDate.label')" name="expireDate" />
        <FInput disabled class="flex-1" id="daysLeft" :label="t('pages.profile.license.daysLeft.label')" name="daysLeft" />
      </div>
    </form>
    <div class="flex justify-center mt-4">
      <Button
        @click="router.push({ name: ERouteNames.Classification })"
        type="button"
        severity="warn"
        :label="t('pages.profile.license.buyLicense.label')"
        @click.stop="submitHandler"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { string, object } from 'yup';
import { type MessageSchema } from '@/plugins/i18n';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from '@/stores/profile/profile';
import { useFToast } from '@/composables/useFToast';
import { ERouteNames } from '@/router/routeNames.enum';
import { useRouter } from 'vue-router';

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

const { handleSubmit, resetForm } = useForm({
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

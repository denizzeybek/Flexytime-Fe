<template>
    <div>
      <form class="flex flex-col gap-8" @submit.prevent>
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
            id="licensePurchased"
            disabled
            class="flex-1"
            :label="t('pages.profile.license.licensePurchased.label')"
            name="licensePurchased"
          />
          <FInput
            id="licenseRemained"
            disabled
            class="flex-1"
            :label="t('pages.profile.license.licenseRemained.label')"
            name="licenseRemained"
          />
        </div>
        <div class="flex gap-4 flex-1">
          <FInput id="expireDate" disabled class="flex-1" :label="t('pages.profile.license.expireDate.label')" name="expireDate" />
          <FInput id="daysLeft" disabled class="flex-1" :label="t('pages.profile.license.daysLeft.label')" name="daysLeft" />
        </div>
        <div class="flex flex-col flex-1 gap-4">
          <FInput
            id="licenseKey"
            class="grow"
            :label="t('pages.profile.license.licenseKey.label')"
            :placeholder="t('pages.profile.license.licenseKey.placeholder')"
            name="licenseKey"
          />
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <Button
            ref="saveButtonRef"
            type="button"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            :label="t('common.buttons.save')"
            @click="showConfirmPopup"
          />
          <ConfirmPopup />
          <Button
            type="button"
            severity="warn"
            :label="t('pages.profile.license.buyLicense.label')"
            @click="router.push({ name: ERouteNames.Classification })"
          />
        </div>
      </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useConfirm } from 'primevue/useconfirm';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { ERouteNames } from '@/router/routeNames.enum';
import { useProfileStore } from '@/stores/profile/profile';

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();
const confirm = useConfirm();
const profileStore = useProfileStore();
const router = useRouter();

const validationSchema = object({
  licenseKey: string().required().label('License Key'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

const saveButtonRef = ref();

const getInitialFormData = computed(() => {
  const license = profileStore?.License;

  return {
    companyName: license?.CustomerName ?? '',
    totalUser: String(license?.TotalUsers ?? ''),
    licensedUser: String(license?.LicensedUsers ?? ''),
    licensePurchased: String(license?.LicensedUsers ?? ''),
    licenseRemained: String(license?.RemainingUsers ?? ''),
    expireDate: license?.ExpireDate ?? '',
    daysLeft: String(license?.RemainingDays ?? ''),
    licenseKey: license?.LicenseKey ?? '',
  };
});

const submitHandler = handleSubmit(async (values) => {
  try {
    await profileStore.saveLicense(values.licenseKey);
    showSuccessMessage(t('pages.profile.license.messages.updated'));
  } catch (error) {
    showErrorMessage(error as Error);
  }
});

const showConfirmPopup = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: t('pages.profile.license.confirm.message'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('common.buttons.yes'),
    rejectLabel: t('common.buttons.no'),
    accept: () => {
      submitHandler();
    },
  });
};

onMounted(async () => {
  await profileStore.filterLicense();

  resetForm({
    values: getInitialFormData.value,
  });
});
</script>

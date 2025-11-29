<template>
  <div
    class="h-full max-h-full w-full max-w-full flex flex-col lg:flex-row items-center gap-4 lg:gap-12"
  >
    <div class="flex-1 flex-col h-full flex items-start justify-center gap-4 lg:gap-6">
      <div class="flex gap-4 mb-12 w-full">
        <Button
          icon="pi pi-microsoft"
          severity="contrast"
          :outlined="isMacos"
          :label="t('pages.download.windows.label')"
          size="large"
          class="flex-1"
          @click="activeComputer = EComputerNames.WINDOWS"
        />
        <Button
          icon="pi pi-apple"
          severity="contrast"
          :outlined="!isMacos"
          :label="t('pages.download.macos.label')"
          size="large"
          class="flex-1"
          @click="activeComputer = EComputerNames.MAC"
        />
      </div>
      <span class="!text-6xl font-semibold">{{ t('pages.download.title') }}</span>
      <FText>
        {{ t('pages.download.description') }}
      </FText>
      <div class="flex gap-4 w-full mt-12">
        <Button
          icon="pi pi-download"
          severity="info"
          size="large"
          :label="t('pages.download.downloadButton')"
          class="flex-1 w-full"
          @click="onDownloadButtonClicked(isMacos)"
        />
        <Button
          v-if="isMacos"
          class="flex-1 w-full"
          :icon="isCopied ? 'pi pi-check' : ''"
          severity="warn"
          size="large"
          :label="downloadsStore.ServiceKey"
          @click="copyDownloadKeyText"
        />
      </div>
      <template v-if="isWizard">
        <div class="w-full flex justify-end">
          <slot name="skipBtn"/>
        </div>
      </template>
    </div>
    <div v-if="!isWizard" class="h-full flex items-center justify-end">
      <img :alt="t('pages.download.imageAlt')" src="@/assets/images/flexymac.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed,onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { EComputerNames } from '@/common/enums/computer.enum';
import { useDownloadApp } from '@/composables/useDownloadapp';
import { copyToClipboard } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsDownloadsStore } from '@/stores/settings/download';

interface IProps {
  isWizard?: boolean;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();

const downloadsStore = useSettingsDownloadsStore();
const { findActiveComputer, onDownloadButtonClicked } = useDownloadApp();

const isCopied = ref(false);
const activeComputer = ref();

const isMacos = computed(() => {
  return activeComputer.value === EComputerNames.MAC;
});

const copyDownloadKeyText = () => {
  try {
    copyToClipboard(downloadsStore.ServiceKey);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.log(error);
    isCopied.value = false;
  }
};

onMounted(async () => {
  await downloadsStore.filter();
  const isComputerMac = findActiveComputer();
  activeComputer.value = isComputerMac ? EComputerNames.MAC : EComputerNames.WINDOWS;
});
</script>

<style scoped></style>

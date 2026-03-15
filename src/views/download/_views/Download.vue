<template>
  <Card class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors">
    <template #content>
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
              @click="handleDownload"
            />
            <Button
              v-if="isMacos"
              class="flex-1 w-full"
              :icon="isCopied ? 'pi pi-check' : 'pi pi-copy'"
              severity="warn"
              size="large"
              :label="isCopied ? downloadsStore.ServiceKey : t('pages.download.macos.copyKeyLabel')"
              @click="copyDownloadKeyText"
            />
          </div>

          <!-- macOS setup steps (shown after download starts) -->
          <div v-if="isMacos" class="w-full flex flex-col gap-3 mt-2">
            <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
              <span class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">1</span>
              <span class="text-sm text-content-primary">{{ t('pages.download.macos.step1') }}</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
              <span class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">2</span>
              <span class="text-sm text-content-primary">{{ t('pages.download.macos.step2') }}</span>
            </div>
            <div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
              <span class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold shrink-0">3</span>
              <span class="text-sm text-content-primary">{{ t('pages.download.macos.step3') }}</span>
            </div>
            <p class="text-xs text-content-quaternary mt-1 cursor-pointer hover:text-content-secondary" @click="copyDownloadKeyText">
              {{ t('pages.download.macos.manualHint') }}
            </p>
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
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Card from 'primevue/card';

import { EComputerNames } from '@/common/enums/computer.enum';
import { useDownloadApp } from '@/composables/useDownloadapp';
import { useFToast } from '@/composables/useFToast';
import { copyToClipboard } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { useSettingsDownloadsStore } from '@/stores/settings/download';

interface IProps {
  isWizard?: boolean;
}

defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();

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
  } catch {
    showErrorMessage(t('common.errors.generic'));
    isCopied.value = false;
  }
};

const handleDownload = () => {
  if (isMacos.value) {
    try {
      copyToClipboard(downloadsStore.ServiceKey);
      showSuccessMessage(t('pages.download.macos.keyCopied'));
      isCopied.value = true;
      setTimeout(() => { isCopied.value = false; }, 2000);
    } catch {
      // Download still proceeds even if copy fails
    }
  }
  onDownloadButtonClicked(isMacos.value);
};

onMounted(async () => {
  await downloadsStore.filter();
  const isComputerMac = findActiveComputer();
  activeComputer.value = isComputerMac ? EComputerNames.MAC : EComputerNames.WINDOWS;
});
</script>

<style scoped></style>

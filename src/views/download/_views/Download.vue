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
          label="Windows"
          size="large"
          class="flex-1"
        />
        <Button
          icon="pi pi-apple"
          severity="contrast"
          :outlined="!isMacos"
          label="Macos"
          size="large"
          class="flex-1"
        />
      </div>
      <span class="!text-6xl font-semibold">Automatic time control for your business </span>
      <FText>
        Control your employees' time in the best way and increase the productivity of your business.
        Make it easy to follow up with an automatic schedule.
      </FText>
      <div class="flex gap-4 w-full mt-12">
        <Button
          icon="pi pi-download"
          severity="info"
          size="large"
          label="Download"
          class="flex-1 w-full"
        />
        <Button
          class="flex-1 w-full"
          :icon="isCopied ? 'pi pi-check' : ''"
          severity="warn"
          size="large"
          @click="copyText"
          :label="downloadsStore.ServiceKey"
        />
      </div>
    </div>
    <div class="h-full flex items-center justify-end">
      <img alt="flexy mac" src="@/assets/images/flexymac.png" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsDownloadsStore } from '@/stores/settings/download';
import { copyToClipboard } from '@/helpers/utils';

const downloadsStore = useSettingsDownloadsStore();

const isMacos = ref(true);
const downloadLink = ref(null);
const isCopied = ref(false);

const onDownloadButtonClicked = () => {
  window.location.href = `${downloadLink.value}&os=${isMacos.value ? 'mac' : 'win'}`;
};

const copyText = () => {
  try {
    copyToClipboard(downloadsStore.ServiceKey);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    isCopied.value = false;
  }
};

onMounted(async () => {
  await downloadsStore.filter();
  isMacos.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
});
</script>

<style scoped></style>

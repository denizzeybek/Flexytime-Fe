<template>
  <div class="flex flex-col justify-between items-center h-full gap-4">
    <div class="flex flex-col justify-center items-center gap-4">
      <FText as="h1"
        >Recommend to friends, get <span class="text-f-warn">bonus membership</span>
      </FText>
      <FText class="text-center">
        Get 1 month of free Flexytime subscription <br />
        for every friend you reccomend who installs Flexytime on their computer. *
      </FText>
      <span class="text-xs text-gray-400">* Valid for up to 50 people</span>
    </div>

    <Card class="w-2/3 my-12">
      <template #header>
        <div class="w-full flex items-center justify-center p-4">
          <FText as="h4">Invite by Email</FText>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <EmailInputList
            v-model:emails="emails"
            name="emails"
            :error-message="emailErrorMessage"
          />
          <Button @click="onSubmitEmails" @click.stop>Add your friednd</Button>
        </div>
      </template>
    </Card>

    <div class="w-full items-center flex flex-col gap-4">
      <FText>Or invite in a different way </FText>
      <div class="w-2/3 flex justify-center gap-4">
        <InputText class="flex-1" placeholder="Enter your friend's email" :value="link" disabled />
        <Button @click="copyText" :icon="isCopied ? 'pi pi-check' : ''" label="Copy Link" />
      </div>
      <div class="flex gap-4">
        <Button
          @click="isBonusModalOpen = true"
          severity="link"
          label="Bonus Earned"
          class="!text-f-warn !underline"
        ></Button>
        <Button
          @click="isPrevInvitationsModalOpen = true"
          severity="link"
          label="Previous Invitations"
          class="!underline"
        ></Button>
      </div>
    </div>
  </div>
  <BonusModal v-if="isBonusModalOpen" v-model:open="isBonusModalOpen" />
  <PrevInvitationsModal v-if="isPrevInvitationsModalOpen" v-model:open="isPrevInvitationsModalOpen" />
</template>

<script setup lang="ts">
// TODO:: stepler için gerekli olan datayı topla ona göre stepleri aktif yap
import EmailInputList from '@/components/ui/local/EmailInputList.vue';
import { ref, computed, onMounted } from 'vue';
import { useFToast } from '@/composables/useFToast';
import { usePromotionsStore } from '@/stores/promotion/promotion';
import { copyToClipboard } from '@/helpers/utils';
import PrevInvitationsModal from '../_components/PrevInvitationsModal.vue';
import BonusModal from '../_components/BonusModal.vue';

const { showSuccessMessage, showErrorMessage } = useFToast();
const promotionsStore = usePromotionsStore();

const emails = ref([]);
const emailErrorMessage = ref('');
const isCopied = ref(false);
const isBonusModalOpen = ref(false);
const isPrevInvitationsModalOpen = ref(false);

const link = computed(() => {
  return `https://flexytime.com/invite?email=${promotionsStore.PromotionLink}`;
});

const onSubmitEmails = () => {
  try {
    if (emails?.value?.length === 0) {
      emailErrorMessage.value = 'Please enter at least one email address.';
      return;
    }
    emailErrorMessage.value = '';
    console.log('emails.value ', emails.value);
    showSuccessMessage('Emails added successfully');
  } catch (error) {
    showErrorMessage(error as any);
  }
};

const copyText = () => {
  try {
    copyToClipboard(promotionsStore.PromotionLink);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    isCopied.value = false;
  }
};

onMounted(async () => {
  await promotionsStore.filter();
  await promotionsStore.fetchPromotionLink();
});
</script>

<style scoped></style>

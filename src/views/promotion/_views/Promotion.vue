<template>
  <div class="flex flex-col justify-between items-center h-full gap-4">
    <div class="flex flex-col justify-center items-center gap-4">
      <FText as="h1"
        >{{ t('pages.promotion.title') }} <span class="text-f-warn">{{ t('pages.promotion.bonusText') }}</span>
      </FText>
      <FText class="text-center">
        {{ t('pages.promotion.description') }}
      </FText>
      <span class="text-xs text-gray-400">{{ t('pages.promotion.disclaimer') }}</span>
    </div>

    <Card class="w-2/3 my-12 shadow-lg border border-gray-100 rounded-2xl">
      <template #header>
        <div class="w-full flex items-center justify-center p-4">
          <FText as="h4">{{ t('pages.promotion.inviteByEmail') }}</FText>
        </div>
      </template>
      <template #content>
        <form @submit="submitHandler">
          <div class="flex flex-col gap-5">
            <FEmailList name="emails" :is-clear="isClear"/>
            <Button
              type="submit"
              :label="t('pages.promotion.addFriendButton')"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              class="shadow-sm"
            />
          </div>
        </form>
      </template>
    </Card>

    <div class="w-full items-center flex flex-col gap-4">
      <FText>{{ t('pages.promotion.alternativeInvite') }}</FText>
      <div class="w-2/3 flex justify-center gap-4">
        <InputText class="flex-1" :placeholder="t('pages.promotion.emailPlaceholder')" :value="link" disabled />
        <Button :icon="isCopied ? 'pi pi-check' : ''" :label="t('pages.promotion.copyLink')" class="shadow-sm" @click="copyText" />
      </div>
      <div class="flex gap-4">
        <Button
          severity="link"
          :label="t('pages.promotion.bonusEarned')"
          class="!text-f-warn !underline"
          @click="isBonusModalOpen = true"
        ></Button>
        <Button
          severity="link"
          :label="t('pages.promotion.previousInvitations')"
          class="!underline"
          @click="isPrevInvitationsModalOpen = true"
        ></Button>
      </div>
    </div>
  </div>
  <BonusModal v-if="isBonusModalOpen" v-model:open="isBonusModalOpen" />
  <PrevInvitationsModal
    v-if="isPrevInvitationsModalOpen"
    v-model:open="isPrevInvitationsModalOpen"
  />
</template>

<script setup lang="ts">
// TODO:: stepler için gerekli olan datayı topla ona göre stepleri aktif yap
import { computed, onMounted,ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { array,object, string } from 'yup';

import { useFToast } from '@/composables/useFToast';
import { copyToClipboard } from '@/helpers/utils';
import { type MessageSchema } from '@/plugins/i18n';
import { usePromotionsStore } from '@/stores/promotion/promotion';

import BonusModal from '../_components/BonusModal.vue';
import PrevInvitationsModal from '../_components/PrevInvitationsModal.vue';

const { t } = useI18n<{ message: MessageSchema }>();

const { showSuccessMessage, showErrorMessage } = useFToast();
const promotionsStore = usePromotionsStore();

const validationSchema = object({
  emails: array()
    .label('Email')
    .of(string().email('Please enter a valid email address.').required('Email is required.'))
    .required('Please add at least one email.')
    .min(1, 'Please add at least one email.'), // Ensures the array isn't empty
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const isCopied = ref(false);
const isBonusModalOpen = ref(false);
const isPrevInvitationsModalOpen = ref(false);
const isClear = ref(false);

const link = computed(() => {
  return `https://flexytime.com/invite?email=${promotionsStore.PromotionLink}`;
});

const submitHandler = handleSubmit(async (values) => {
  try {
    console.log('values ', values);
    showSuccessMessage(t('pages.promotion.messages.success'));
    isClear.value = true;
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});

const copyText = () => {
  try {
    copyToClipboard(promotionsStore.PromotionLink);
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
  await promotionsStore.filter();
  await promotionsStore.fetchPromotionLink();
});
</script>

<style scoped></style>

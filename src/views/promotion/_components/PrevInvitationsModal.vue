<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="t('pages.promotion.modals.prevInvitationsModal.title')"
    class="!bg-f-secondary-purple lg:!w-[800px] !w-full"
    :style="{ width: '50rem' }"
  >
    <Card>
      <template #content>
        <DataTable
          tableStyle="min-width: 50rem"
          paginator
          :value="promotionsList"
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column sortable field="EmailAddress" :header="t('pages.promotion.modals.prevInvitationsModal.emailAddress')"> </Column>
          <Column sortable field="SendDate" :header="t('pages.promotion.modals.prevInvitationsModal.sendDate')"> </Column>
          <Column field="IsDownloaded" :header="t('pages.promotion.modals.prevInvitationsModal.isDownloaded')"> </Column>
          <template #footer>
            {{ t('pages.promotion.modals.prevInvitationsModal.footerText', { count: promotionsList ? promotionsList.length : 0 }) }}
          </template>
        </DataTable>
      </template>
    </Card>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import { usePromotionsStore } from '@/stores/promotion/promotion';

const { t } = useI18n<{ message: MessageSchema }>();

const promotionsStore = usePromotionsStore();

const open = defineModel<boolean>('open');

const promotionsList = computed(() => {
  return promotionsStore.PromotedPromotionList;
});
</script>

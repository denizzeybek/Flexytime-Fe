<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="t('pages.promotion.modals.bonusModal.title')"
    class="lg:!w-[800px] !w-full"
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
          <Column sortable field="EmailAddress" :header="t('pages.promotion.modals.bonusModal.emailAddress')">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>
          <Column sortable field="SendDate" :header="t('pages.promotion.modals.bonusModal.sendDate')">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>
          <Column field="UsageDate" :header="t('pages.promotion.modals.bonusModal.usageDate')">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>

          <template #footer>
            {{ t('pages.promotion.modals.bonusModal.footerText', { count: promotionsList ? promotionsList.length : 0 }) }}
          </template>
        </DataTable>
      </template>
    </Card>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import { usePromotionsStore } from '@/stores/promotion/promotion';

const { t } = useI18n<{ message: MessageSchema }>();

const promotionsStore = usePromotionsStore();
const isLoading = ref(true);
const open = defineModel<boolean>('open');

const promotionsList = computed(() => {
  return promotionsStore.EarnedPromotionList;
});
</script>

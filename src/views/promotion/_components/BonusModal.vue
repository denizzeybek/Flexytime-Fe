<template>
  <Dialog
    v-model:visible="open"
    modal
    header="Bonus Earned"
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
          <Column sortable field="EmailAddress" header="Email Address">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>
          <Column sortable field="SendDate" header="Send Date">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>
          <Column field="UsageDate" header="Usage Date">
            <Skeleton v-if="isLoading" height="1.5rem" width="10rem" />
          </Column>

          <template #footer>
            In total there are {{ promotionsList ? promotionsList.length : 0 }} promotionsList.
          </template>
        </DataTable>
      </template>
    </Card>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePromotionsStore } from '@/stores/promotion/promotion';

const promotionsStore = usePromotionsStore();
const isLoading = ref(true);
const open = defineModel<boolean>('open');

const promotionsList = computed(() => {
  return promotionsStore.EarnedPromotionList;
});
</script>

import { defineStore } from 'pinia';

import { PromotionApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { PromotionListViewModel, PromotionModifyViewModel, PromotionViewModel } from '@/client';

interface State {
  EarnedPromotionList: PromotionViewModel[];
  PromotedPromotionList: PromotionViewModel[];
  PromotionLink: string;
  loading: boolean;
  error: string | null;
}

export const usePromotionsStore = defineStore(EStoreNames.PROMOTION, {
  state: (): State => ({
    EarnedPromotionList: [],
    PromotedPromotionList: [],
    PromotionLink: '',
    loading: false,
    error: null,
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
  },
  actions: {
    /**
     * Fetch promotions list (Earned & Promoted)
     * Endpoint: GET /webapi/promotions
     */
    async filter(): Promise<PromotionListViewModel | null> {
      try {
        this.loading = true;
        this.error = null;

        const data = await PromotionApiService.promotionApiPromotions();

        this.EarnedPromotionList = data.Earned ?? [];
        this.PromotedPromotionList = data.Promoted ?? [];

        return data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Failed to fetch promotions';
        console.error('Error fetching promotions:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch promotion link
     * Endpoint: GET /webapi/promotion/promote
     */
    async fetchPromotionLink(): Promise<string | null> {
      try {
        this.loading = true;
        this.error = null;

        const data = await PromotionApiService.promotionApiPromote();

        this.PromotionLink = data.PromotionLink ?? '';

        return this.PromotionLink;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Failed to fetch promotion link';
        console.error('Error fetching promotion link:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Save promotion (send invitation emails)
     * Endpoint: POST /webapi/promotion/save
     */
    async savePromotion(payload: PromotionModifyViewModel): Promise<boolean> {
      try {
        this.loading = true;
        this.error = null;

        await PromotionApiService.promotionApiSavePromotion(payload);

        // Refresh the promotions list after saving
        await this.filter();

        return true;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Failed to save promotion';
        console.error('Error saving promotion:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});

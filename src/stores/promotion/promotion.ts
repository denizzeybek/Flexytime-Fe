import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
import type { IPromotion, IPromote, IPromotionResponse } from '@/interfaces/promotion/promotion';

interface State {
  EarnedPromotionList: IPromotion[];
  PromotedPromotionList: IPromotion[];
  PromotionLink: IPromote['PromotionLink'];
}

export const usePromotionsStore = defineStore(EStoreNames.PROMOTION, {
  state: (): State => ({
    EarnedPromotionList: [],
    PromotedPromotionList: [],
    PromotionLink: '',
  }),
  actions: {
    filter() {
      const api = '/webapi/promotions';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.EarnedPromotionList = useMockData
              ? response[api].Earned
              : (response as IPromotionResponse).Earned;

            this.PromotedPromotionList = useMockData
              ? response[api].Promoted
              : (response as IPromotionResponse).Promoted;

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fetchPromotionLink() {
      const api = '/webapi/promotion/promote';
      return new Promise((resolve, reject) => {
        const url = useMockData ? '/mockData.json' : api;

        axios
          .post(url)
          .then((response: any) => {
            this.PromotionLink = useMockData
              ? response[api].PromotionLink
              : (response as IPromote).PromotionLink;

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

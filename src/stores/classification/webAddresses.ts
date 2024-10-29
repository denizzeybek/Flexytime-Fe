import type {
  IWebAddress,
  IWebAddressDTOData,
  IWebaddressDTOPayload,
} from '@/interfaces/classification/webAddress';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

interface State {
  list: IWebAddressDTOData[];
  totalItems: number;
}

export const useClassificationWebAddressesStore = defineStore(
  EStoreNames.CLASSIFICATION_WEB_ADDRESSES,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
    }),
    actions: {
      filter2(payload: IWebaddressDTOPayload) {
        return new Promise((resolve, reject) => {
          axios
            .post('/webapi/category/webaddresses/query', payload)
            .then((response) => {
              const { DTO } = response as unknown as IWebAddress;
              this.list = DTO.data;
              this.totalItems = DTO.recordsTotal;
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
      filter() {
        const api = '/webapi/category/webaddresses/query';
        return new Promise((resolve, reject) => {
          const url = useMockData ? '/mockData.json' : api;
  
          axios
            .post(url)
            .then((response: any) => {
              const webAddresses = useMockData ? response[api] : (response as IWebAddress).DTO.data;
  
              this.list = webAddresses;
              this.totalItems = webAddresses?.length || 0;
  
              resolve(webAddresses);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);

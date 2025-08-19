import type {
  IWebAddress,
  IWebAddressDTOData,
  IWebaddressDTOPayload,
} from '@/interfaces/classification/webAddress';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
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
      async filter(payload) {
        const url = '/webapi/category/webaddresses/query';

        const response = await axios.post<IWebAddress>(url, payload);
        const webAddresses = (response.data as IWebAddress).DTO?.data;
        const total = (response.data as IWebAddress).DTO?.recordsTotal ?? 0;

        this.list = webAddresses;
        this.totalItems = total;
        return webAddresses;
      },
      async save(payload) {
        const url = '/webapi/category/webaddress/save';
        this.list = this.list.map((webAddress) => {
          if (webAddress.ID === payload.ID) {
            webAddress.Domain = payload.Domain;
            webAddress.AlwaysOn = payload.AlwaysOn;
          }
          return webAddress;
        });

        return await axios.post<IWebAddress>(url, payload);
      },
    },
  },
);

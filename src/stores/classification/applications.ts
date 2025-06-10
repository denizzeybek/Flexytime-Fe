import type {
  IApplication,
  IApplicationDTOData,
  IApplicationDTOPayload,
} from '@/interfaces/classification/application';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';
interface State {
  list: IApplicationDTOData[];
  totalItems: number;
}

export const useClassificationApplicationsStore = defineStore(
  EStoreNames.CLASSIFICATION_APPLICATIONS,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
    }),
    actions: {
      async filter(payload) {
        const url = '/webapi/category/webaddresses/query';

        const response = await axios.post<IApplication>(url, payload);
        const applications = (response.data as IApplication).DTO?.data;

        this.list = applications;
        this.totalItems = applications?.length || 0;
        return applications;
      },
    },
  },
);

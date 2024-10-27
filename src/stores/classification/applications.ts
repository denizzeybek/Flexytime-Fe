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
      filter() {
        const api = '/webapi/category/allocations/query';
        return new Promise((resolve, reject) => {
          const url = useMockData ? '/mockData.json' : api;

          axios
            .post(url)
            .then((response: any) => {
              const applications = useMockData
                ? response[api]
                : (response as IApplication).DTO.data;

              this.list = applications;
              this.totalItems = applications?.length || 0;

              resolve(applications);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);

import type {
  IApplication,
  IApplicationDTOData,
  IApplicationDTOPayload,
} from '@/interfaces/classification/application';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
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
      filter(payload: IApplicationDTOPayload) {
        return new Promise((resolve, reject) => {
          axios
            .post('/webapi/category/allocations/query', payload)
            .then((response) => {
              const { DTO } = response as unknown as IApplication;
              this.list = DTO.data;
              this.totalItems = DTO.recordsTotal;
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);

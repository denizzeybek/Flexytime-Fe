import type {
  IApplication,
  IApplicationDTOData,
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
      async filter(payload) {
        const url = '/webapi/category/allocations/query';

        const response = await axios.post<IApplication>(url, payload);
        const applications = (response.data as IApplication).DTO?.data;
        const total = (response.data as IApplication).DTO?.recordsTotal ?? 0;

        this.list = applications;
        this.totalItems = total;
        return applications;
      },
      async save(payload) {
        const url = '/webapi/category/allocation/save';
        this.list = this.list.map((allocation) => {
          if (allocation.ID === payload.ID) {
            allocation.Domain = payload.Domain;
            allocation.AlwaysOn = payload.AlwaysOn;
          }
          return allocation;
        });

        return await axios.post<IApplication>(url, payload);
      },
    },
  },
);

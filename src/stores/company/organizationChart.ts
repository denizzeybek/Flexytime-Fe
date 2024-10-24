import type {
  IOrganizationChart,
  IOrganizationChartNodes,
} from '@/interfaces/company/organizationChart';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';

interface State {
  list: IOrganizationChartNodes[];
}

export const useCompanyOrganizationChartsStore = defineStore(
  EStoreNames.COMPANY_ORGANIZATION_CHARTS,
  {
    state: (): State => ({
      list: [],
    }),
    actions: {
      filter() {
        return new Promise((resolve, reject) => {
          axios
            .post('/webapi/company/organization')
            .then((response) => {
              const { nodes } = response as unknown as IOrganizationChart;
              this.list = nodes;
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

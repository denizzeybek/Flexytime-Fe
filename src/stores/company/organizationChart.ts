import type {
  IOrganizationChart,
  IOrganizationChartNodes,
} from '@/interfaces/company/organizationChart';
import { EStoreNames } from '@/stores/storeNames.enum';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useMockData } from '@/config';

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
        const api = '/webapi/company/organization';
        return new Promise((resolve, reject) => {
          const url = useMockData ? '/mockData.json' : api;

          axios
            .post(url)
            .then((response: any) => {
              const organizations = useMockData
                ? response[api]
                : (response as IOrganizationChart).nodes;

              this.list = organizations;

              resolve(organizations);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },
    },
  },
);

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
      async filter() {
        const url = '/webapi/company/organization';

        const response = await axios.get<IOrganizationChart>(url);
        const organizations = (response.data as IOrganizationChart).Nodes;
        this.list = organizations;

        return response.data;
      },
      async save(payload: any) {
        const url = '/webapi/company/organization/save';

        const response = await axios.post<any>(url, payload);
        return response.data;
      },
    },
  },
);

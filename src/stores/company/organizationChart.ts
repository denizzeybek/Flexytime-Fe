import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { OrganizationNodeViewModel, OrganizationViewModel } from '@/client';

interface State {
  list: OrganizationNodeViewModel[];
}

export const useCompanyOrganizationChartsStore = defineStore(
  EStoreNames.COMPANY_ORGANIZATION_CHARTS,
  {
    state: (): State => ({
      list: [],
    }),
    actions: {
      async filter() {
        const data = await CompanyApiService.companyApiOrganization();
        const organizations = data.Nodes ?? [];
        this.list = organizations;

        return data;
      },
      async save(payload: OrganizationViewModel) {
        await CompanyApiService.companyApiSaveOrganization(payload);
        await this.filter();
      },
    },
  },
);

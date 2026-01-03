import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { OrganizationNodeViewModel, OrganizationViewModel, PerformNameValueModel } from '@/client';

interface State {
  list: OrganizationNodeViewModel[];
  members: PerformNameValueModel[];
  titles: PerformNameValueModel[];
}

export const useCompanyOrganizationChartsStore = defineStore(
  EStoreNames.COMPANY_ORGANIZATION_CHARTS,
  {
    state: (): State => ({
      list: [],
      members: [],
      titles: [],
    }),
    actions: {
      async filter() {
        const data = await CompanyApiService.companyApiOrganization();
        this.list = data.Nodes ?? [];
        this.members = data.Members ?? [];
        this.titles = data.Titles ?? [];

        return data;
      },
      async save(payload: OrganizationViewModel) {
        await CompanyApiService.companyApiSaveOrganization(payload);
        // Note: Do not call filter() here as it may return stale data
        // The caller should manage the local state
      },
    },
  },
);

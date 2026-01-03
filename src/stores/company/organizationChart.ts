import { defineStore } from 'pinia';

import { CompanyApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { OrganizationNodeViewModel, OrganizationViewModel, PerformNameValueModel, TitleViewModel } from '@/client';

interface State {
  list: OrganizationNodeViewModel[];
  members: PerformNameValueModel[];
  titles: TitleViewModel[];
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
        const [orgData, titlesData] = await Promise.all([
          CompanyApiService.companyApiOrganization(),
          CompanyApiService.companyApiTitles(),
        ]);
        this.list = orgData.Nodes ?? [];
        this.members = orgData.Members ?? [];
        this.titles = titlesData ?? [];

        return orgData;
      },
      async save(payload: OrganizationViewModel) {
        await CompanyApiService.companyApiSaveOrganization(payload);
        // Note: Do not call filter() here as it may return stale data
        // The caller should manage the local state
      },
    },
  },
);

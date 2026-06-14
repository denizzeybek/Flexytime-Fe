import { defineStore } from 'pinia';

import { CompanyService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { OrganizationDto, OrganizationNodeViewModel, PerformNameValueModel, TitleDto } from '@/client';

interface State {
  list: OrganizationNodeViewModel[];
  members: PerformNameValueModel[];
  titles: TitleDto[];
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
          CompanyService.companyControllerOrganization(),
          CompanyService.companyControllerTitles(),
        ]);
        this.list = orgData.Nodes ?? [];
        this.members = orgData.Members ?? [];
        this.titles = titlesData ?? [];

        return orgData;
      },
      async save(payload: OrganizationDto) {
        await CompanyService.companyControllerSaveOrganization(payload);

      },
    },
  },
);

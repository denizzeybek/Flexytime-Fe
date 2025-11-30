import { defineStore } from 'pinia';

import { CategoryApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { DataTableQueryModel, WebAddressModifyModel } from '@/client';

interface IWebAddressDTOData {
  HostName: string;
  DomainDisplay: string;
  Name: string;
  IsWork: boolean;
  IsMeeting: boolean;
  IsLeisure: boolean;
  TopicName: string;
  Actions?: null;
  Customise?: null;
  Timeout: number | string | null;
  AlwaysOn: boolean;
  ID: string;
  Domain: string;
}

// Backend returns a DataTable response with DTO structure (not in OpenAPI spec)
interface DataTableResponse {
  DTO?: {
    data: IWebAddressDTOData[];
    recordsTotal: number;
  };
}

interface State {
  list: IWebAddressDTOData[];
  totalItems: number;
  loading: boolean;
}

export const useClassificationWebAddressesStore = defineStore(
  EStoreNames.CLASSIFICATION_WEB_ADDRESSES,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
      loading: false,
    }),
    getters: {
      isLoading: (state): boolean => state.loading,
    },
    actions: {
      async filter(payload: DataTableQueryModel) {
        try {
          this.loading = true;
          // Note: Backend returns DataTable format not in OpenAPI spec
          // TODO: Update OpenAPI spec to include DTO wrapper
          const rawResponse = await CategoryApiService.categoryApiQueryWebAddresses(payload);
          const response = rawResponse as unknown as DataTableResponse;

          // Runtime validation
          const webAddresses = Array.isArray(response.DTO?.data) ? response.DTO.data : [];
          const total = typeof response.DTO?.recordsTotal === 'number' ? response.DTO.recordsTotal : 0;

          this.list = webAddresses;
          this.totalItems = total;
          return webAddresses;
        } finally {
          this.loading = false;
        }
      },
      async save(payload: WebAddressModifyModel) {
        this.list = this.list.map((webAddress) => {
          if (webAddress.ID === payload.ID) {
            webAddress.Domain = String(payload.Domain ?? '');
            webAddress.AlwaysOn = payload.AlwaysOn ?? false;
          }
          return webAddress;
        });

        return await CategoryApiService.categoryApiSaveWebAddress(payload);
      },
    },
  },
);

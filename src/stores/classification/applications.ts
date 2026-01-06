import { defineStore } from 'pinia';

import { CategoryApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { DataTableQueryModel, PerformAllocationModifyModel } from '@/client';

interface IApplicationDTOData {
  HostName: string;
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
    data: IApplicationDTOData[];
    recordsTotal: number;
  };
}

interface State {
  list: IApplicationDTOData[];
  totalItems: number;
  loading: boolean;
  lastQuery: DataTableQueryModel | null;
}

export const useClassificationApplicationsStore = defineStore(
  EStoreNames.CLASSIFICATION_APPLICATIONS,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
      loading: false,
      lastQuery: null,
    }),
    getters: {
      isLoading: (state): boolean => state.loading,
    },
    actions: {
      async filter(payload: DataTableQueryModel) {
        try {
          this.loading = true;
          this.lastQuery = payload;
          // Note: Backend returns DataTable format not in OpenAPI spec
          // TODO: Update OpenAPI spec to include DTO wrapper
          const rawResponse = await CategoryApiService.categoryApiQueryAllocations(payload);
          const response = rawResponse as unknown as DataTableResponse;

          // Runtime validation
          const applications = Array.isArray(response.DTO?.data) ? response.DTO.data : [];
          const total = typeof response.DTO?.recordsTotal === 'number' ? response.DTO.recordsTotal : 0;

          this.list = applications;
          this.totalItems = total;
          return applications;
        } finally {
          this.loading = false;
        }
      },
      async save(payload: PerformAllocationModifyModel) {
        await CategoryApiService.categoryApiSavePerformAllocation(payload);

        // Refetch data after save to get updated list from backend
        if (this.lastQuery) {
          await this.filter(this.lastQuery);
        }
      },
    },
  },
);

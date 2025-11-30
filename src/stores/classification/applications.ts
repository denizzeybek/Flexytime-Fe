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
}

export const useClassificationApplicationsStore = defineStore(
  EStoreNames.CLASSIFICATION_APPLICATIONS,
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
        this.list = this.list.map((allocation) => {
          if (allocation.ID === payload.ID) {
            allocation.Domain = String(payload.Domain ?? '');
            allocation.AlwaysOn = payload.AlwaysOn ?? false;
          }
          return allocation;
        });

        return await CategoryApiService.categoryApiSavePerformAllocation(payload);
      },
    },
  },
);

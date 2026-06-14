import { defineStore } from 'pinia';

import { CategoryService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { PerformAllocationModifyDto } from '@/client';

export interface ApplicationViewModel {
  ID: string;
  HostName: string;
  Name: string;
  AlwaysOn: boolean;
  Domain: number;
}

export interface ApplicationsFilterRequest {
  start?: number;
  length?: number;
  search?: string;
  sort?: string;
  descending?: boolean;
}

interface QueryResponse {
  Total?: number;
  Filtered?: number;
  Items?: ApplicationViewModel[];
}

interface State {
  list: ApplicationViewModel[];
  totalItems: number;
  loading: boolean;
  lastQuery: ApplicationsFilterRequest | null;
}

export const useClassificationApplicationsStore = defineStore(
  EStoreNames.CLASSIFICATION_APPLICATIONS,
  {
    state: (): State => ({
      list: [],
      totalItems: 0,
      loading: true,
      lastQuery: null,
    }),
    getters: {
      isLoading: (state): boolean => state.loading,
    },
    actions: {
      async filter(payload: ApplicationsFilterRequest) {
        try {
          this.loading = true;
          this.lastQuery = payload;
          const body = {
            Start: payload.start ?? 1,
            Length: payload.length ?? 10,
            Sort: payload.sort ?? '',
            Descending: payload.descending ?? false,
            Search: payload.search ?? '',
          };
          const response = (await CategoryService.categoryControllerQueryAllocations(
            body as never,
          )) as unknown as QueryResponse;

          this.list = Array.isArray(response.Items) ? response.Items : [];
          this.totalItems = typeof response.Total === 'number' ? response.Total : 0;
          return this.list;
        } finally {
          this.loading = false;
        }
      },
      async save(payload: PerformAllocationModifyDto) {
        await CategoryService.categoryControllerSavePerformAllocation(payload as never);

        const idx = this.list.findIndex(
          (item) => (payload.ID ? item.ID === payload.ID : item.Name === payload.Name),
        );
        if (idx !== -1) {
          if (typeof payload.Domain === 'number' && payload.Domain !== 1) {
            this.list[idx].Domain = payload.Domain;
          }
          if (typeof payload.AlwaysOn === 'boolean') {
            this.list[idx].AlwaysOn = payload.AlwaysOn;
          }
        }
      },
    },
  },
);

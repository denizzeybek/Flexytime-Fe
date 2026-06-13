import { defineStore } from 'pinia';

import { CategoryService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { PerformAllocationModifyDto } from '@/client';

/**
 * v2 `AllocationViewModel` shape returned by `category/allocations` (list +
 * query) and `category/allocation` (single). Like `WebAddressViewModel`,
 * the RESHAPED-v2 contract dropped the legacy presentational fields
 * (`DomainDisplay`, `TopicName`, `IsWork/IsMeeting/IsLeisure`, `Timeout`).
 * The "host" field here is purely cosmetic for executable allocations
 * (the Query the BE classifies on); FE keeps it under `HostName` so the
 * Applications table doesn't have to change its column key.
 */
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
      loading: false,
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
          // v2 ClassificationQuery body (PascalCase); Start is 1-based.
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

        // Refetch data after save to get the updated list from backend.
        if (this.lastQuery) {
          await this.filter(this.lastQuery);
        }
      },
    },
  },
);

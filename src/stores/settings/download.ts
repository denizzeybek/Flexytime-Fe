import { defineStore } from 'pinia';

import { SettingApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type { DownloadViewModel } from '@/client';

interface State {
  InvitationLink: string;
  InvitationId: string;
  ServiceKey: string;
  loading: boolean;
  error: string | null;
}

export const useSettingsDownloadsStore = defineStore(EStoreNames.SETTINGS_DOWNLOAD, {
  state: (): State => ({
    InvitationLink: '',
    InvitationId: '',
    ServiceKey: '',
    loading: false,
    error: null,
  }),
  actions: {
    async filter(): Promise<DownloadViewModel | null> {
      try {
        this.loading = true;
        this.error = null;

        const data = await SettingApiService.settingApiDownload();

        this.InvitationLink = data.InvitationLink ?? '';
        this.InvitationId = data.InvitationId ?? '';
        this.ServiceKey = data.ServiceKey ?? '';

        return data;
      } catch (err: any) {
        this.error = err?.response?.data?.message || 'Failed to fetch download info';
        console.error('Error fetching download info:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});

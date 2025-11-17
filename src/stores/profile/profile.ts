import { defineStore } from 'pinia';

import { ProfileApiService, SettingApiService } from '@/client';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  EmployeeViewModel,
  LicenseViewModel,
  ProfileViewModel,
  TimeZoneViewModel,
} from '@/client';

interface State {
  TimeZoneList: TimeZoneViewModel[];
  User: EmployeeViewModel;
  IsMailSubscribe: ProfileViewModel['IsMailSubscribe'];
  License: LicenseViewModel;
  TimeZone: ProfileViewModel['TimeZone'];
  LanguageCode: ProfileViewModel['LanguageCode'];
  GeneralProfile: ProfileViewModel;
}

export const useProfileStore = defineStore(EStoreNames.PROFILE, {
  state: (): State => ({
    GeneralProfile: {} as ProfileViewModel,
    User: {} as EmployeeViewModel,
    TimeZoneList: [],
    IsMailSubscribe: false,
    License: {} as LicenseViewModel,
    TimeZone: '',
    LanguageCode: '',
  }),
  actions: {
    async filter() {
      const data = await ProfileApiService.profileApiGetProfile();
      this.GeneralProfile = data;
      this.User = data.Employee ?? ({} as EmployeeViewModel);
      this.TimeZone = data.TimeZone;
      this.LanguageCode = data.LanguageCode;
      this.IsMailSubscribe = data.IsMailSubscribe;
      this.TimeZoneList = data.Timezones ?? [];

      return data;
    },
    async filterLicense() {
      const data = await SettingApiService.settingApiLicense();
      this.License = data;

      return data;
    },
  },
});

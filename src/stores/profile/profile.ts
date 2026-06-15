import { defineStore } from 'pinia';

import axios from 'axios';

import { OpenAPI, ProfileLegacyWebapiService, SettingService } from '@/client';
import { ERole } from '@/enums/role.enum';
import { EStoreNames } from '@/stores/storeNames.enum';

async function downscaleImageToDataUrl(
  file: File,
  maxEdge: number,
  quality: number,
): Promise<string> {
  const sourceDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unexpected reader result'));
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Image decode failed'));
    el.src = sourceDataUrl;
  });

  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
}

import type {
  EmployeeViewModel,
  LicenseModifyViewModel,
  LicenseViewModel,
  ProfileUpdateDto,
  ProfileViewModel,
  TimeZoneViewModel,
} from '@/client';

export interface CurrencyOption {
  ID: string;
  Name: string;
}

interface State {
  TimeZoneList: TimeZoneViewModel[];
  CurrencyList: CurrencyOption[];
  User: EmployeeViewModel;
  IsMailSubscribe: ProfileViewModel['IsMailSubscribe'];
  License: LicenseViewModel;
  TimeZone: ProfileViewModel['TimeZone'];
  Currency: string;
  LanguageCode: ProfileViewModel['LanguageCode'];
  GeneralProfile: ProfileViewModel;
}

export const useProfileStore = defineStore(EStoreNames.PROFILE, {
  state: (): State => ({
    GeneralProfile: {} as ProfileViewModel,
    User: {} as EmployeeViewModel,
    TimeZoneList: [],
    CurrencyList: [],
    IsMailSubscribe: false,
    License: {} as LicenseViewModel,
    TimeZone: '',
    Currency: 'TRY',
    LanguageCode: '',
  }),
  getters: {

    roles: (state): string[] => {
      return state.GeneralProfile?.Wizard?.Roles ?? [];
    },

    permissions: (state): string[] => {
      return state.GeneralProfile?.Wizard?.Permissions ?? [];
    },

    isAdmin: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.ADMIN) ?? false;
    },

    isSupervisor: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.SUPERVISOR) ?? false;
    },

    isHR: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.HR) ?? false;
    },

    isEmployee: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.EMPLOYEE) ?? false;
    },

    hasSupervisorPermission: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Permissions?.includes('supervisor') ?? false;
    },

    memberId: (state): string | null => {
      return state.GeneralProfile?.Wizard?.MemberId ?? null;
    },

    canSeeOthers: (state): boolean => {
      const wizard = state.GeneralProfile?.Wizard as
        | { CanSeeOthers?: boolean }
        | undefined;
      return wizard?.CanSeeOthers === true;
    },
  },
  actions: {
    async filter() {
      const data = await ProfileLegacyWebapiService.legacyProfileControllerGetProfile();
      this.GeneralProfile = data;
      this.User = (data as { Employee?: EmployeeViewModel }).Employee ?? ({} as EmployeeViewModel);
      this.TimeZone = data.timezone ?? '';
      this.Currency = data.currency ?? 'TRY';
      this.LanguageCode = data.languageCode ?? '';
      this.IsMailSubscribe = Boolean(data.emailPermit);

      return data;
    },
    async filterLicense() {
      const data = await SettingService.settingControllerLicense();
      this.License = data;

      return data;
    },

    async saveLicense(licenseKey: string) {
      const payload: LicenseModifyViewModel = { LicenseKey: licenseKey };
      const response = await SettingService.settingControllerSaveLicense(payload);
      await this.filterLicense();
      return response;
    },

    async updateProfile(model: ProfileUpdateDto) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerSaveProfile(model);
      await this.filter();
      return response;
    },

    async updateTimezone(timezone: string) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerUpdateTimezone({
        Timezone: timezone,
      });
      this.TimeZone = timezone;
      return response;
    },

    async updateCurrency(currency: string) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerUpdateCurrency({
        Currency: currency,
      });
      this.Currency = currency;
      return response;
    },

    async updateLanguageCode(languageCode: string) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerUpdateLanguage({
        LanguageCode: languageCode,
      });
      this.LanguageCode = languageCode;
      return response;
    },

    async resendConfirmation() {
      return ProfileLegacyWebapiService.legacyProfileControllerResendConfirm();
    },

    async changePassword(password: string) {
      return ProfileLegacyWebapiService.legacyProfileControllerChangePassword(
        { Password: password } as never,
      );
    },

    async fetchTimezones() {
      const data = await ProfileLegacyWebapiService.legacyProfileControllerGetTimezones();
      this.TimeZoneList = data as unknown as TimeZoneViewModel[];
      return data;
    },

    async fetchCurrencies() {
      const data = await ProfileLegacyWebapiService.legacyProfileControllerGetCurrencies();
      this.CurrencyList = data as unknown as CurrencyOption[];
      return data;
    },

    async uploadProfileImage(file: File) {
      const imageBase64 = await downscaleImageToDataUrl(file, 512, 0.85);

      const response = await axios.post(
        `${OpenAPI.BASE}/webapi/profile/image`,
        { imageBase64 },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OpenAPI.TOKEN}`,
          },
        },
      );

      await this.filter();

      return response.data;
    },

    async removeProfileImage() {
      const response = await axios.post(
        `${OpenAPI.BASE}/webapi/profile/image/delete`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OpenAPI.TOKEN}`,
          },
        },
      );

      await this.filter();

      return response.data;
    },
  },
});

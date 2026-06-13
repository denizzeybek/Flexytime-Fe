import { defineStore } from 'pinia';

import axios from 'axios';

import { OpenAPI, ProfileLegacyWebapiService, SettingService } from '@/client';
import { ERole } from '@/enums/role.enum';
import { EStoreNames } from '@/stores/storeNames.enum';

import type {
  EmployeeViewModel,
  LicenseModifyViewModel,
  LicenseViewModel,
  ProfileModifyViewModel,
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
  getters: {
    /**
     * Get user roles from profile
     * Returns empty array if profile not loaded
     */
    roles: (state): string[] => {
      return state.GeneralProfile?.Wizard?.Roles ?? [];
    },

    /**
     * Get user permissions from profile
     * Returns empty array if profile not loaded
     */
    permissions: (state): string[] => {
      return state.GeneralProfile?.Wizard?.Permissions ?? [];
    },

    /**
     * Check if user has Admin role
     */
    isAdmin: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.ADMIN) ?? false;
    },

    /**
     * Check if user has Supervisor role
     */
    isSupervisor: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.SUPERVISOR) ?? false;
    },

    /**
     * Check if user has HR role
     */
    isHR: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.HR) ?? false;
    },

    /**
     * Check if user has Employee role
     */
    isEmployee: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Roles?.includes(ERole.EMPLOYEE) ?? false;
    },

    /**
     * Check if user has supervisor permission
     * This determines if they can see team/supervisor views
     */
    hasSupervisorPermission: (state): boolean => {
      return state.GeneralProfile?.Wizard?.Permissions?.includes('supervisor') ?? false;
    },

    /**
     * Get member ID for individual view navigation
     */
    memberId: (state): string | null => {
      return state.GeneralProfile?.Wizard?.MemberId ?? null;
    },
  },
  actions: {
    async filter() {
      const data = await ProfileLegacyWebapiService.legacyProfileControllerGetProfile();
      this.GeneralProfile = data;
      this.User = data.Employee ?? ({} as EmployeeViewModel);
      this.TimeZone = data.TimeZone;
      this.LanguageCode = data.LanguageCode;
      this.IsMailSubscribe = data.IsMailSubscribe;

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

    async updateProfile(model: ProfileModifyViewModel) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerSaveProfile(
        model as never,
      );
      await this.filter();
      return response;
    },

    async updateTimezone(timeZone: string) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerUpdateTimezone(
        { TimeZone: timeZone } as never,
      );
      this.TimeZone = timeZone;
      return response;
    },

    async updateLanguageCode(languageCode: string) {
      const response = await ProfileLegacyWebapiService.legacyProfileControllerUpdateLanguage(
        { LanguageCode: languageCode } as never,
      );
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

    async uploadProfileImage(file: File) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${OpenAPI.BASE}/upload/profileimage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${OpenAPI.TOKEN}`,
        },
      });

      await this.filter();

      return response.data;
    },
  },
});

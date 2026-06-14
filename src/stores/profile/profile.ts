import { defineStore } from 'pinia';

import axios from 'axios';

import { OpenAPI, ProfileLegacyWebapiService, SettingService } from '@/client';
import { ERole } from '@/enums/role.enum';
import { EStoreNames } from '@/stores/storeNames.enum';

/**
 * Reads a File via FileReader, draws it onto an off-screen canvas scaled so the
 * longest edge is `maxEdge` px, then returns a `data:image/jpeg;base64,...` URL
 * at the given quality. Used to keep profile-image uploads small (avatar is
 * never rendered larger than ~120px in the UI, so 512 is plenty).
 */
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

/**
 * Currency dropdown row — mirrors the BE `CurrencyListItemDto` (exported as a
 * `type` interface so the OpenAPI plugin doesn't emit a class). `ID` is the
 * ISO 4217 code persisted on the company setting; `Name` is a "(symbol) Name"
 * label rendered verbatim by the dropdown.
 */
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

    /**
     * Persists the company's display currency and updates the local store so
     * the worktime page re-renders with the new currency on the next paint.
     * Mirrors {@link updateTimezone}'s shape.
     */
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

    /**
     * Fetches the static ISO 4217 whitelist driving the Currency dropdown.
     * The BE response is `CurrencyListItemDto[]` (exported as an interface;
     * OpenAPI codegen widens it to `any`), so we cast to the local
     * {@link CurrencyOption} shape with the same field names.
     */
    async fetchCurrencies() {
      const data = await ProfileLegacyWebapiService.legacyProfileControllerGetCurrencies();
      this.CurrencyList = data as unknown as CurrencyOption[];
      return data;
    },

    /**
     * v2 image upload: downscale client-side to a max 512x512 JPEG (q=0.85), then
     * POST as JSON `{ imageBase64: "data:image/jpeg;base64,..." }`. BE persists
     * the data URL verbatim into Customer.ImageUrl and surfaces it back through
     * both the profile response (profile page avatar) and the worktime section
     * `Individuals[].ImageUrl` (team/individual tables). Downscaling keeps the
     * JSON body well under the default Express ~100KB limit and avoids server
     * round-trip cost for high-res sources — avatar quality is fine at 512.
     */
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

    /**
     * Clears the user's profile image via the legacy compat endpoint. BE unsets
     * Customer.ImageUrl, so the next /webapi/profile read returns no `imageUrl`
     * and the avatar falls back to the placeholder.
     */
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

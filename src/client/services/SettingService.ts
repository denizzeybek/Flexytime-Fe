/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { SaveCompanyRequestDto } from '../models/SaveCompanyRequestDto';
import type { SaveInvitationRequestDto } from '../models/SaveInvitationRequestDto';
import type { SaveLicenseRequestDto } from '../models/SaveLicenseRequestDto';
import type { SavePermissionsRequestDto } from '../models/SavePermissionsRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingService {
    /**
     * List all companies (superadmin)
     * RESHAPED-v2 — Create/activity dates are UTC ISO instants (was "yyyy.MM.dd"); now includes the owner Fullname/Email + LastActivityDate/DashboardActivityDate. License stays a composed "{active}/{licensed} kullanıcı {expire}" string. FE refactor required. Requires the `admin` role.
     * @returns any CompanyViewModel[]
     * @throws ApiError
     */
    public static settingControllerCompanies(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/companies',
        });
    }
    /**
     * Look up a single company by reference id
     * @param requestBody
     * @returns any DataResult<CompanyViewModel>
     * @throws ApiError
     */
    public static settingControllerGetCompany(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a company entry (admin role required)
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static settingControllerSaveCompany(
        requestBody: SaveCompanyRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a company by id (admin role required)
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static settingControllerDeleteCompany(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List permission groups managed by the current user
     * RESHAPED-v2 — id field is `ID` (uppercase, v2 convention) not the legacy `Id`; same on the save round-trip. Fields otherwise unchanged ({ID,Key,Name,Enabled,VisibleOnlyByAdmin}). FE refactor required (read `ID`, send `ID`).
     * @returns any PermissionViewModel[]
     * @throws ApiError
     */
    public static settingControllerPermissions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/permissions',
        });
    }
    /**
     * Save the permission matrix for a group
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static settingControllerSavePermissions(
        requestBody: SavePermissionsRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/permission/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the active license for the current tenant
     * RESHAPED-v2 — clean contract { CustomerName, ExpireDate, RemainingDays, TotalUsers, ActiveUsers, LicensedUsers, RemainingUsers, IsUnsubscribe, LicenseKey }. Renamed CompanyName→CustomerName, Key→LicenseKey; dropped IsValid; added the user-count fan-out + IsUnsubscribe. FE refactor required.
     * @returns any LicenseViewModel
     * @throws ApiError
     */
    public static settingControllerLicense(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/license',
        });
    }
    /**
     * Apply or update the license (validates against the Rijndael blob)
     * @param requestBody
     * @returns any DataResult envelope reflecting license apply outcome
     * @throws ApiError
     */
    public static settingControllerSaveLicense(
        requestBody: SaveLicenseRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/license/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the desktop-agent installer link + ServiceKey
     * RESHAPED-v2 — clean contract { InvitationLink, InvitationId, ServiceKey } (was the scaffolded { ServiceKey, Url }). InvitationLink is the installer URL; ServiceKey = GuidEncoder.encode(companyId). FE refactor required.
     * @returns any DownloadViewModel
     * @throws ApiError
     */
    public static settingControllerDownload(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/download',
        });
    }
    /**
     * List pending invitations created by the current user
     * @returns any InvitationViewModel[]
     * @throws ApiError
     */
    public static settingControllerInvitations(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/invitations',
        });
    }
    /**
     * Create or update an invitation entry
     * When `EXPOSE_INVITE_LINKS_IN_RESPONSE=true` (dev/local only — the loader hard-wires this off in production), the response DTO carries the generated `{Email, Link}` pairs so the operator can click through without a real mail send. Hidden by default; never trust the absence on prod.
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static settingControllerSaveInvitation(
        requestBody: SaveInvitationRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/invitation/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List advanced (feature-level) permission toggles
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1. Was a 501 stub; now reads visible PerformSettings. SettingType/DataType are readable STRING enums (e.g. "EmployeeTags"/"Boolean"), not the legacy raw bytes; legacy TypeName (localized) dropped — FE localizes from SettingType. Save accepts the same string SettingType. FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any AdvancedPermissionViewModel[]
     * @throws ApiError
     */
    public static settingControllerAdvancedPermissions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/advances',
        });
    }
    /**
     * Save the on/off state for a batch of advanced permissions
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static settingControllerSaveAdvancedPermissions(
        requestBody: Array<string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/advance/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

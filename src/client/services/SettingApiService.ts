/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedPermissonViewModel } from '../models/AdvancedPermissonViewModel';
import type { AdvancedSettingModifyModel } from '../models/AdvancedSettingModifyModel';
import type { CompanyReferenceModel } from '../models/CompanyReferenceModel';
import type { CompanyViewModel } from '../models/CompanyViewModel';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { DownloadViewModel } from '../models/DownloadViewModel';
import type { InvitationModifyViewModel } from '../models/InvitationModifyViewModel';
import type { InvitationViewModel } from '../models/InvitationViewModel';
import type { LicenseModifyViewModel } from '../models/LicenseModifyViewModel';
import type { LicenseViewModel } from '../models/LicenseViewModel';
import type { PermissionModifyViewModel } from '../models/PermissionModifyViewModel';
import type { PermissonViewModel } from '../models/PermissonViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingApiService {
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiDeleteCompany(
        model: CompanyReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company/delete',
            body: model,
        });
    }
    /**
     * @returns CompanyViewModel OK
     * @throws ApiError
     */
    public static settingApiCompanies(): CancelablePromise<Array<CompanyViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/companies',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiSaveCompany(
        model: CompanyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiGetCompany(
        model: CompanyReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/company',
            body: model,
        });
    }
    /**
     * @returns PermissonViewModel OK
     * @throws ApiError
     */
    public static settingApiPermissions(): CancelablePromise<Array<PermissonViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/permissions',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiSavePermissions(
        model: PermissionModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/permission/save',
            body: model,
        });
    }
    /**
     * @returns LicenseViewModel OK
     * @throws ApiError
     */
    public static settingApiLicense(): CancelablePromise<LicenseViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/license',
        });
    }
    /**
     * @returns DownloadViewModel OK
     * @throws ApiError
     */
    public static settingApiDownload(): CancelablePromise<DownloadViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/download',
        });
    }
    /**
     * @returns InvitationViewModel OK
     * @throws ApiError
     */
    public static settingApiInvitations(): CancelablePromise<Array<InvitationViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/invitations',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiSaveInvitation(
        model: InvitationModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/invitation/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiSaveLicense(
        model: LicenseModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/license/save',
            body: model,
        });
    }
    /**
     * @returns AdvancedPermissonViewModel OK
     * @throws ApiError
     */
    public static settingApiAdvancedPermissions(): CancelablePromise<Array<AdvancedPermissonViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/setting/advances',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static settingApiSaveAdvancedPermissions(
        model: Array<AdvancedSettingModifyModel>,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/advance/save',
            body: model,
        });
    }
}

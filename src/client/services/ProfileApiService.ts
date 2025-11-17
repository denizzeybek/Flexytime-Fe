/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { ProfileLanguageCodeViewModel } from '../models/ProfileLanguageCodeViewModel';
import type { ProfileMarketingViewModel } from '../models/ProfileMarketingViewModel';
import type { ProfileModifyViewModel } from '../models/ProfileModifyViewModel';
import type { ProfilePasswordViewModel } from '../models/ProfilePasswordViewModel';
import type { ProfileTimezoneViewModel } from '../models/ProfileTimezoneViewModel';
import type { ProfileViewModel } from '../models/ProfileViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileApiService {
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiSavePermit(
        model: ProfileMarketingViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/marketing/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiUpdateTimezone(
        model: ProfileTimezoneViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/timezone/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiUpdateLanguageCode(
        model: ProfileLanguageCodeViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/language/save',
            body: model,
        });
    }
    /**
     * @returns ProfileViewModel OK
     * @throws ApiError
     */
    public static profileApiGetProfile(): CancelablePromise<ProfileViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiChangePassword(
        model: ProfilePasswordViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/password/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiUpdateProfile(
        model: ProfileModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/save',
            body: model,
        });
    }
    /**
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static profileApiResendConfirm(): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile/confirm',
        });
    }
}

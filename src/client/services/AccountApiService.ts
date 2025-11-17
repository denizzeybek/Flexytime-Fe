/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountConfirmViewModel } from '../models/AccountConfirmViewModel';
import type { AccountRegisterViewModel } from '../models/AccountRegisterViewModel';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { DownloadViewModel } from '../models/DownloadViewModel';
import type { WizardForgotViewModel } from '../models/WizardForgotViewModel';
import type { WizarDownloadViewModel } from '../models/WizarDownloadViewModel';
import type { WizardPromotionViewModel } from '../models/WizardPromotionViewModel';
import type { WizardResetViewModel } from '../models/WizardResetViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountApiService {
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static accountApiRegister(
        request: AccountRegisterViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/register',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static accountApiReset(
        request: WizardResetViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/reset',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static accountApiConfirm(
        request: AccountConfirmViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/confirm',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static accountApiForgot(
        request: WizardForgotViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/forgot',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static accountApiGetPromotion(
        request: WizardPromotionViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/promotion',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DownloadViewModel OK
     * @throws ApiError
     */
    public static accountApiGetDownloadDetails(
        request: WizarDownloadViewModel,
    ): CancelablePromise<DownloadViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/wizard/download',
            body: request,
        });
    }
}

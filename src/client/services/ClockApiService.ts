/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlertViewModel } from '../models/AlertViewModel';
import type { ClockEmployeeRequest } from '../models/ClockEmployeeRequest';
import type { ClockEmployeeResponse } from '../models/ClockEmployeeResponse';
import type { ClockSection2Response } from '../models/ClockSection2Response';
import type { ClockSectionRequest } from '../models/ClockSectionRequest';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { InvitationSingleViewModel } from '../models/InvitationSingleViewModel';
import type { ManualClockModifyViewModel } from '../models/ManualClockModifyViewModel';
import type { PerformReferenceModel } from '../models/PerformReferenceModel';
import type { WebClockModifyModel } from '../models/WebClockModifyModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClockApiService {
    /**
     * @returns AlertViewModel OK
     * @throws ApiError
     */
    public static clockApiGetAlerts(): CancelablePromise<AlertViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/clock/alerts',
        });
    }
    /**
     * @param request
     * @returns ClockSection2Response OK
     * @throws ApiError
     */
    public static clockApiGetSection(
        request: ClockSectionRequest,
    ): CancelablePromise<ClockSection2Response> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/section',
            body: request,
        });
    }
    /**
     * @param request
     * @returns ClockEmployeeResponse OK
     * @throws ApiError
     */
    public static clockApiGetEmployee(
        request: ClockEmployeeRequest,
    ): CancelablePromise<ClockEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/employee',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiSaveManual(
        request: ManualClockModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiGetManual(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiDeleteManual(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiResendInvitation(
        request: InvitationSingleViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/invitation/resend',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiDeleteInvitation(
        request: InvitationSingleViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/invitation/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static clockApiSaveWebClock(
        request: WebClockModifyModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/web/save',
            body: request,
        });
    }
}

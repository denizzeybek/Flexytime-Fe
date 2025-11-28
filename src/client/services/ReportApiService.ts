/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportFilterViewModel } from '../models/ReportFilterViewModel';
import type { ReportQueryViewModel } from '../models/ReportQueryViewModel';
import type { ReportResultViewModel } from '../models/ReportResultViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportApiService {
    /**
     * @returns ReportFilterViewModel OK
     * @throws ApiError
     */
    public static reportApiGetFilters(): CancelablePromise<ReportFilterViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/report/filters',
        });
    }
    /**
     * @param request
     * @returns ReportResultViewModel OK
     * @throws ApiError
     */
    public static reportApiQueryReport(
        request: ReportQueryViewModel,
    ): CancelablePromise<ReportResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/query',
            body: request,
        });
    }
}

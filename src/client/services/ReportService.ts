/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportQueryDto } from '../models/ReportQueryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportService {
    /**
     * Return the filter options available to the current user
     * @returns any ReportFilterViewModel — dropdowns/date ranges/scopes
     * @throws ApiError
     */
    public static reportControllerGetFilters(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/report/filters',
        });
    }
    /**
     * Execute a report query with the given filter selections
     * @param requestBody
     * @returns any ReportResultViewModel — rows + aggregates for the query
     * @throws ApiError
     */
    public static reportControllerQueryReport(
        requestBody: ReportQueryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/query',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

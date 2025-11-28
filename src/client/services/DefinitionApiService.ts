/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnualViewModel } from '../models/AnnualViewModel';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { PerformAnnualViewModel } from '../models/PerformAnnualViewModel';
import type { PerformEmployeeViewModel } from '../models/PerformEmployeeViewModel';
import type { PerformReferenceModel } from '../models/PerformReferenceModel';
import type { TheMemberModifyViewModel } from '../models/TheMemberModifyViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefinitionApiService {
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiGetEmployee(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiSaveEmployee(
        request: TheMemberModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiGetAnnual(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiDeleteAnnual(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiDeleteEmployee(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static definitionApiSaveAnnual(
        request: AnnualViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual/save',
            body: request,
        });
    }
    /**
     * @returns PerformAnnualViewModel OK
     * @throws ApiError
     */
    public static definitionApiAnnuals(): CancelablePromise<PerformAnnualViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/annuals',
        });
    }
    /**
     * @returns PerformEmployeeViewModel OK
     * @throws ApiError
     */
    public static definitionApiEmployees(): CancelablePromise<PerformEmployeeViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/employees',
        });
    }
}

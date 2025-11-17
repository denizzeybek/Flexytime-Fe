/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationResultViewModel } from '../models/AllocationResultViewModel';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { DataTableQueryModel } from '../models/DataTableQueryModel';
import type { PerformAllocationModifyModel } from '../models/PerformAllocationModifyModel';
import type { PerformReferenceModel } from '../models/PerformReferenceModel';
import type { PerformWebAddressViewModel } from '../models/PerformWebAddressViewModel';
import type { WebAddressModifyModel } from '../models/WebAddressModifyModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryApiService {
    /**
     * @returns AllocationResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiPerformAllocations(): CancelablePromise<AllocationResultViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/category/allocations',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiQueryAllocations(
        model: DataTableQueryModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocations/query',
            body: model,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiGetPerformAllocation(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocation',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiSavePerformAllocation(
        request: PerformAllocationModifyModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocation/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiDeleteWebAddress(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress/delete',
            body: request,
        });
    }
    /**
     * @returns PerformWebAddressViewModel OK
     * @throws ApiError
     */
    public static categoryApiWebAddresses(): CancelablePromise<PerformWebAddressViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/category/webaddresses',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiQueryWebAddresses(
        model: DataTableQueryModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddresses/query',
            body: model,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiGetWebAddress(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static categoryApiSaveWebAddress(
        request: WebAddressModifyModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress/save',
            body: request,
        });
    }
}

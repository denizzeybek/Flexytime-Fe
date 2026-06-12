/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryService {
    /**
     * Return allocation summary metrics for the current tenant
     * @returns any AllocationResultViewModel
     * @throws ApiError
     */
    public static categoryControllerPerformAllocations(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/category/allocations',
        });
    }
    /**
     * Paginated classification list of executable allocations
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (ClassificationPage{Total,Filtered,Items} not DataResult/DataTable; Item is {ID,Name,HostName,Domain,AlwaysOn}, no DomainDisplay/IsWork/Timeout). FE refactor required. See docs/classification-redesign.md.
     * @returns any ClassificationPage
     * @throws ApiError
     */
    public static categoryControllerQueryAllocations(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocations/query',
        });
    }
    /**
     * Look up a single executable allocation by reference id
     * RESHAPED-v2 — returns the accurate TraceAllocation edit shape (WebAddressViewModel: ID/HostName/Name/AlwaysOn/Domain), not the scaffold AllocationViewModel; localized DomainDisplay dropped. FE refactor required.
     * @param requestBody
     * @returns any DataResult<WebAddressViewModel>
     * @throws ApiError
     */
    public static categoryControllerGetPerformAllocation(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update an allocation entry
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static categoryControllerSavePerformAllocation(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/allocation/save',
        });
    }
    /**
     * List configured web-address categories
     * @returns any WebAddressListResponse
     * @throws ApiError
     */
    public static categoryControllerWebAddresses(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/category/webaddresses',
        });
    }
    /**
     * Paginated classification list of web addresses
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (ClassificationPage{Total,Filtered,Items} not DataResult/DataTable; Item is {ID,Name,HostName,Domain,AlwaysOn}, no DomainDisplay/IsWork/TopicName/Timeout). FE refactor required. See docs/classification-redesign.md.
     * @returns any ClassificationPage
     * @throws ApiError
     */
    public static categoryControllerQueryWebAddresses(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddresses/query',
        });
    }
    /**
     * Look up a single web address by reference id
     * @param requestBody
     * @returns any DataResult<WebAddressViewModel>
     * @throws ApiError
     */
    public static categoryControllerGetWebAddress(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a web address entry
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static categoryControllerSaveWebAddress(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress/save',
        });
    }
    /**
     * Delete a web address by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static categoryControllerDeleteWebAddress(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/category/webaddress/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

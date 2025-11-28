/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { PromoteViewModel } from '../models/PromoteViewModel';
import type { PromotionListViewModel } from '../models/PromotionListViewModel';
import type { PromotionModifyViewModel } from '../models/PromotionModifyViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromotionApiService {
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static promotionApiSavePromotion(
        request: PromotionModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/promotion/save',
            body: request,
        });
    }
    /**
     * @returns PromoteViewModel OK
     * @throws ApiError
     */
    public static promotionApiPromote(): CancelablePromise<PromoteViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/promotion/promote',
        });
    }
    /**
     * @returns PromotionListViewModel OK
     * @throws ApiError
     */
    public static promotionApiPromotions(): CancelablePromise<PromotionListViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/promotions',
        });
    }
}

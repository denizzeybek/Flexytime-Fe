/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromotionService {
    /**
     * Return the company's referral signup link
     * PromoteViewModel { PromotionLink }. Lazily mints + persists the company's PromotionCode when empty.
     * @returns any PromoteViewModel { PromotionLink }
     * @throws ApiError
     */
    public static promotionControllerPromote(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/promotion/promote',
        });
    }
    /**
     * List the company referral funnel (Earned + Promoted)
     * RESHAPED-v2 — dates emitted as raw UTC ISO instead of legacy dd.MM.yyyy display strings; FE formats them. Contract shape (Earned/Promoted of PromotionViewModel) matches legacy.
     * @returns any PromotionListViewModel { Earned, Promoted }
     * @throws ApiError
     */
    public static promotionControllerPromotions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/promotions',
        });
    }
    /**
     * Create or update a promotion entry
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static promotionControllerSavePromotion(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/promotion/save',
        });
    }
}

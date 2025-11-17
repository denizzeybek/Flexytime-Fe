/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CouponRequestModel } from '../models/CouponRequestModel';
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { InvoiceViewModel } from '../models/InvoiceViewModel';
import type { PaymentSuccessViewModel } from '../models/PaymentSuccessViewModel';
import type { PerformInvoiceViewModel } from '../models/PerformInvoiceViewModel';
import type { SubscriptionModifyViewModel } from '../models/SubscriptionModifyViewModel';
import type { SubscriptionViewModel } from '../models/SubscriptionViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentApiService {
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static paymentApiGetCoupon(
        request: CouponRequestModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/coupon',
            body: request,
        });
    }
    /**
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static paymentApiUnsubscribe(): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/unsubscribe',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static paymentApiSaveSubscription(
        model: SubscriptionModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/subscribe/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns InvoiceViewModel OK
     * @throws ApiError
     */
    public static paymentApiPaymentSuccess(
        model: PaymentSuccessViewModel,
    ): CancelablePromise<InvoiceViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/success',
            body: model,
        });
    }
    /**
     * @returns PerformInvoiceViewModel OK
     * @throws ApiError
     */
    public static paymentApiBilling(): CancelablePromise<PerformInvoiceViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/billing',
        });
    }
    /**
     * @returns SubscriptionViewModel OK
     * @throws ApiError
     */
    public static paymentApiSubscribe(): CancelablePromise<SubscriptionViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/subscribe',
        });
    }
}

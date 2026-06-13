/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CouponRequestDto } from '../models/CouponRequestDto';
import type { PaymentSuccessDto } from '../models/PaymentSuccessDto';
import type { SubscriptionModifyDto } from '../models/SubscriptionModifyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentService {
    /**
     * Validate a coupon code and return the resulting price breakdown
     * @param requestBody
     * @returns any DataResult envelope wrapping CouponViewModel { Amount } (Amount=0 when not found/expired)
     * @throws ApiError
     */
    public static paymentControllerGetCoupon(
        requestBody: CouponRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/coupon',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the tenant's invoice history + current billing status
     * @returns any PerformInvoiceViewModel
     * @throws ApiError
     */
    public static paymentControllerBilling(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/billing',
        });
    }
    /**
     * Return the subscription plan options + current selection
     * @returns any SubscriptionViewModel
     * @throws ApiError
     */
    public static paymentControllerSubscribe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/subscribe',
        });
    }
    /**
     * Persist the chosen subscription plan and seat count
     * @param requestBody
     * @returns any DataResult envelope reflecting Stripe + DB outcome
     * @throws ApiError
     */
    public static paymentControllerSaveSubscription(
        requestBody: SubscriptionModifyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/subscribe/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Cancel the tenant's active subscription at period end
     * @returns any DataResult envelope confirming cancellation
     * @throws ApiError
     */
    public static paymentControllerUnsubscribe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/payment/unsubscribe',
        });
    }
    /**
     * Finalize a payment after redirect-back from the gateway and emit the invoice
     * @param requestBody
     * @returns any InvoiceViewModel — finalised invoice for the receipt screen
     * @throws ApiError
     */
    public static paymentControllerPaymentSuccess(
        requestBody: PaymentSuccessDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/success',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

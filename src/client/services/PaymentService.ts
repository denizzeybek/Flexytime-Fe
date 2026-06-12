/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentService {
    /**
     * Validate a coupon code and return the resulting price breakdown
     * @returns any DataResult envelope wrapping CouponViewModel { Amount } (Amount=0 when not found/expired)
     * @throws ApiError
     */
    public static paymentControllerGetCoupon(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/coupon',
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
     * @returns any DataResult envelope reflecting Stripe + DB outcome
     * @throws ApiError
     */
    public static paymentControllerSaveSubscription(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/subscribe/save',
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
     * @returns any InvoiceViewModel — finalised invoice for the receipt screen
     * @throws ApiError
     */
    public static paymentControllerPaymentSuccess(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/payment/success',
        });
    }
}

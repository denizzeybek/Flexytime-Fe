/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountConfirmDto } from '../models/AccountConfirmDto';
import type { AccountForgotDto } from '../models/AccountForgotDto';
import type { AccountRegisterDto } from '../models/AccountRegisterDto';
import type { AccountResetDto } from '../models/AccountResetDto';
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountService {
    /**
     * Register a new tenant + owner user (auto-login) with a confirmation email flow
     * RESHAPED-v2 — on success returns the same { access_token, user } as login + sets the refresh cookie (the new owner is logged in immediately). Duplicate email → 409.
     * @param requestBody
     * @returns AuthResponseDto
     * @throws ApiError
     */
    public static accountControllerRegister(
        requestBody: AccountRegisterDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Email already in use`,
            },
        });
    }
    /**
     * Trigger a password-reset email for the given account
     * @param requestBody
     * @returns any DataResult envelope; same response whether the email matches or not (anti-enumeration)
     * @throws ApiError
     */
    public static accountControllerForgot(
        requestBody: AccountForgotDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/forgot',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Set a new password using a token from the forgot-password email
     * @param requestBody
     * @returns any DataResult envelope; rejects if the token is expired or already used
     * @throws ApiError
     */
    public static accountControllerReset(
        requestBody: AccountResetDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/reset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Confirm an account email via the token from the registration email
     * @param requestBody
     * @returns any DataResult envelope; rejects if the token is expired or invalid
     * @throws ApiError
     */
    public static accountControllerConfirm(
        requestBody: AccountConfirmDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/confirm',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Resolve a promotion code to the inviter fullname
     * @returns any DataResult<WizardPromotionSelectDto>
     * @throws ApiError
     */
    public static accountControllerGetPromotion(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/account/promotion',
        });
    }
}

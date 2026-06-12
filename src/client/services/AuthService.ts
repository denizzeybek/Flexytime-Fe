/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { GoogleLoginDto } from '../models/GoogleLoginDto';
import type { LoginDto } from '../models/LoginDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Exchange credentials for an access token (+ refresh cookie) and user
     * @param requestBody
     * @returns AuthResponseDto
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Username or password did not match`,
            },
        });
    }
    /**
     * Rotate the refresh cookie for a fresh access token (+ user)
     * @returns AuthResponseDto
     * @throws ApiError
     */
    public static authControllerRefresh(): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                401: `Refresh cookie missing, expired, or revoked`,
            },
        });
    }
    /**
     * Revoke the caller's refresh tokens + clear the cookie
     * @returns void
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
        });
    }
    /**
     * Sign in (or auto-register a new tenant) with a Google ID token
     * RESHAPED-v2 — verifies the Google ID token, then issues our own { access_token, user } + refresh cookie. A first-time email provisions a new tenant + owner; an existing email signs in and links the Google account.
     * @param requestBody
     * @returns AuthResponseDto
     * @throws ApiError
     */
    public static googleControllerGoogle(
        requestBody: GoogleLoginDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/google',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Google token invalid or unverified`,
            },
        });
    }
}

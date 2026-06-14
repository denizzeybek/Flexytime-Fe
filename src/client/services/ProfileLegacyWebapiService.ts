/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileImageUploadDto } from '../models/ProfileImageUploadDto';
import type { ProfileLanguageDto } from '../models/ProfileLanguageDto';
import type { ProfileMarketingDto } from '../models/ProfileMarketingDto';
import type { ProfilePasswordChangeDto } from '../models/ProfilePasswordChangeDto';
import type { ProfileResponseDto } from '../models/ProfileResponseDto';
import type { ProfileTimezoneDto } from '../models/ProfileTimezoneDto';
import type { ProfileUpdateDto } from '../models/ProfileUpdateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileLegacyWebapiService {
    /**
     * Legacy: return the authenticated user profile
     * @returns ProfileResponseDto
     * @throws ApiError
     */
    public static legacyProfileControllerGetProfile(): CancelablePromise<ProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile',
        });
    }
    /**
     * Legacy: update profile fields and return the saved profile in a DataResult envelope
     * @param requestBody
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerSaveProfile(
        requestBody: ProfileUpdateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Legacy: upload the profile image as a base64 data URL (no multer / no separate storage)
     * @param requestBody
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerUploadImage(
        requestBody: ProfileImageUploadDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/image',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Legacy: remove the profile image (clears Customer.ImageUrl)
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerRemoveImage(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/image/delete',
        });
    }
    /**
     * Legacy: update the user's timezone
     * @param requestBody
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerUpdateTimezone(
        requestBody: ProfileTimezoneDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/timezone/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Legacy: update the user's preferred language code
     * @param requestBody
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerUpdateLanguage(
        requestBody: ProfileLanguageDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/language/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Legacy: toggle the marketing-email permit flag
     * @param requestBody
     * @returns any DataResult<ProfileResponseDto>
     * @throws ApiError
     */
    public static legacyProfileControllerUpdateMarketing(
        requestBody: ProfileMarketingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/marketing/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Legacy: change the password by supplying the current one + the new one
     * @param requestBody
     * @returns any DataResult envelope; rejects on wrong OldPassword
     * @throws ApiError
     */
    public static legacyProfileControllerChangePassword(
        requestBody: ProfilePasswordChangeDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/password/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List supported timezones for the timezone picker
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (ID is the IANA zone e.g. "Europe/Istanbul", not the Windows id "Turkey Standard Time"; Name is "(UTC±HH:MM) City"). The selected ID is saved as IANA. FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any TimezoneListItemDto[] — IANA id + "(UTC±HH:MM) City" label
     * @throws ApiError
     */
    public static legacyProfileControllerGetTimezones(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timezones',
        });
    }
    /**
     * Legacy: verify the current access token (mirrors /profile/verify-token)
     * @param authorization
     * @returns any VerifyTokenResponseDto
     * @throws ApiError
     */
    public static legacyProfileControllerVerifyToken(
        authorization: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile/verifyToken',
            headers: {
                'authorization': authorization,
            },
        });
    }
    /**
     * Legacy: resend email confirmation token
     * @returns any DataResult
     * @throws ApiError
     */
    public static legacyProfileControllerResendConfirm(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile/confirm',
        });
    }
    /**
     * Legacy: external calendar OAuth (superseded)
     * RESHAPED-v2 — replaced by GET /calendar/google/connect. Legacy route returns 501 with { redirectTo } until removed.
     * @returns any
     * @throws ApiError
     */
    public static legacyProfileControllerExternalLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/profile/externalLogin',
        });
    }
    /**
     * Legacy: external calendar OAuth trigger (superseded)
     * RESHAPED-v2 — replaced by GET /calendar/google/connect. Legacy route returns 501 with { redirectTo } until removed.
     * @returns any
     * @throws ApiError
     */
    public static legacyProfileControllerExternalLoginTrigger(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile/externalLoginTrigger',
        });
    }
    /**
     * Legacy: external calendar OAuth callback (superseded)
     * RESHAPED-v2 — replaced by GET /calendar/google/callback. Legacy route returns 501 with { redirectTo } until removed.
     * @returns any
     * @throws ApiError
     */
    public static legacyProfileControllerExternalLoginCallback(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/profile/externalLoginCallback',
        });
    }
}

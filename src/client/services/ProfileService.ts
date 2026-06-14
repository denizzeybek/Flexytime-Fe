/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileImageUploadDto } from '../models/ProfileImageUploadDto';
import type { ProfileResponseDto } from '../models/ProfileResponseDto';
import type { ProfileUpdateDto } from '../models/ProfileUpdateDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * Return the authenticated user's profile
     * @returns ProfileResponseDto
     * @throws ApiError
     */
    public static profileControllerGetMe(): CancelablePromise<ProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/me',
        });
    }
    /**
     * Update editable fields on the current profile
     * @param requestBody
     * @returns ProfileResponseDto
     * @throws ApiError
     */
    public static profileControllerUpdateMe(
        requestBody: ProfileUpdateDto,
    ): CancelablePromise<ProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profile/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
            },
        });
    }
    /**
     * Upload the profile image as a base64 data URL (no multer / no separate storage)
     * @param requestBody
     * @returns ProfileResponseDto
     * @throws ApiError
     */
    public static profileControllerUploadImage(
        requestBody: ProfileImageUploadDto,
    ): CancelablePromise<ProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profile/image',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
            },
        });
    }
    /**
     * Remove the profile image (clears Customer.ImageUrl)
     * @returns ProfileResponseDto
     * @throws ApiError
     */
    public static profileControllerRemoveImage(): CancelablePromise<ProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profile/image',
        });
    }
    /**
     * Verify that the current access token is still associated with a valid user
     * @param authorization
     * @returns any Verification result with user metadata if the token is valid
     * @throws ApiError
     */
    public static profileControllerVerifyToken(
        authorization: string,
    ): CancelablePromise<{
        valid: boolean;
        userId?: string;
        username?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/verify-token',
            headers: {
                'authorization': authorization,
            },
        });
    }
}

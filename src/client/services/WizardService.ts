/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Function } from '../models/Function';
import type { WizardProfileResponseDto } from '../models/WizardProfileResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WizardService {
    /**
     * Mark the onboarding wizard as shown for the current user
     * @returns any DataResult envelope with Status=Success
     * @throws ApiError
     */
    public static wizardControllerWizardShown(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/wizard/show',
        });
    }
    /**
     * Legacy: get the wizard profile context
     * @returns WizardProfileResponseDto
     * @throws ApiError
     */
    public static wizardControllerGetProfile(): CancelablePromise<WizardProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/wizard/profile',
        });
    }
    /**
     * Legacy: resolve a download key and invitation to a service key
     * @param requestBody
     * @returns any DownloadViewModel
     * @throws ApiError
     */
    public static wizardControllerGetDownloadDetails(
        requestBody: Function,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/wizard/download',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

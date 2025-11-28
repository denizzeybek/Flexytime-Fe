/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { WizardProfileViewModel } from '../models/WizardProfileViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WizardApiService {
    /**
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static wizardApiWizardShown(): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/wizard/show',
        });
    }
    /**
     * @returns WizardProfileViewModel OK
     * @throws ApiError
     */
    public static wizardApiGetProfile(): CancelablePromise<WizardProfileViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/wizard/profile',
        });
    }
}

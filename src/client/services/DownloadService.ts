/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadService {
    /**
     * Authorize a file download and return a signed URL or DTO
     * @returns any Legacy DataResult envelope with the download payload
     * @throws ApiError
     */
    public static downloadControllerAuthorizeFile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/download',
        });
    }
}

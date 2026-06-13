/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DownloadRequestDto } from '../models/DownloadRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadService {
    /**
     * Authorize a file download and return a signed URL or DTO
     * @param requestBody
     * @returns any Legacy DataResult envelope with the download payload
     * @throws ApiError
     */
    public static downloadControllerAuthorizeFile(
        requestBody: DownloadRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/download',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

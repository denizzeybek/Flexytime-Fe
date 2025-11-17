/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { DownloadRequestViewModel } from '../models/DownloadRequestViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadApiService {
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static downloadApiAuthorizeFile(
        model: DownloadRequestViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/download',
            body: model,
        });
    }
}

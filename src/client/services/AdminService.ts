/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAdminUserRequestDto } from '../models/CreateAdminUserRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Create the system superadmin user (control-key protected)
     * Creates a Customer with role=admin. Requires `X-Control-Key` header matching the `ADMIN_CONTROL_KEY` env var. Not accessible via JWT — intended for initial system seeding only. Returns 401 when the key is absent or wrong.
     * @param requestBody
     * @returns any DataResult envelope (Status=0 on success)
     * @throws ApiError
     */
    public static adminControllerCreateAdminUser(
        requestBody: CreateAdminUserRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/setting/admin/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failed`,
                401: `Missing or invalid X-Control-Key`,
                409: `Email already exists`,
            },
        });
    }
}

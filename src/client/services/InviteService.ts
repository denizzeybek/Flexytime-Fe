/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcceptInviteDto } from '../models/AcceptInviteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InviteService {
    /**
     * Resolve an invitation URL into a welcome-page context (public, no JWT)
     * @param id
     * @param token
     * @returns any InviteLookup
     * @throws ApiError
     */
    public static inviteControllerLookup(
        id: string,
        token: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/invite/{id}',
            path: {
                'id': id,
            },
            query: {
                'token': token,
            },
        });
    }
    /**
     * Accept an invitation, set password + Fullname, and create the Customer / Member
     * Idempotent — a second POST after acceptance returns the same context without touching the user. The body `Token` must match the same URL token the GET validated.
     * @param id
     * @param requestBody
     * @returns any InviteLookup
     * @throws ApiError
     */
    public static inviteControllerAccept(
        id: string,
        requestBody: AcceptInviteDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/invite/{id}/accept',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

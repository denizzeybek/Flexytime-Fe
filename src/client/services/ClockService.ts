/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClockActivitiesRequestDto } from '../models/ClockActivitiesRequestDto';
import type { ClockActivitiesResponse } from '../models/ClockActivitiesResponse';
import type { ClockEmployeeResponse } from '../models/ClockEmployeeResponse';
import type { ClockSectionResponse } from '../models/ClockSectionResponse';
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClockService {
    /**
     * Return alert badges (missing punches, pending invitations, etc.)
     * @returns any AlertViewModel
     * @throws ApiError
     */
    public static clockControllerGetAlerts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/clock/alerts',
        });
    }
    /**
     * Return a clock section (group of employees + their current clock state)
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (Summary object not array, seconds not "HH:mm", string-enum codes e.g. Domain "Work" / WellBeing "Overtime", no charts/labels). FE refactor required. See docs/worktime-redesign.md.
     * @returns ClockSectionResponse
     * @throws ApiError
     */
    public static clockControllerGetSection(): CancelablePromise<ClockSectionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/section',
        });
    }
    /**
     * Return clock detail for a single employee
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (no Model wrapper / Days[]; flat Employee+Summary+Distribution+WellBeings+ProductivityGraph, raw seconds + string-enum codes e.g. Domain "Work" / WellBeing "Overtime"). FE refactor required. See docs/worktime-redesign.md.
     * @returns ClockEmployeeResponse
     * @throws ApiError
     */
    public static clockControllerGetEmployee(): CancelablePromise<ClockEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/employee',
        });
    }
    /**
     * List classified PerformView activities (agent → PerformJob → TraceClock pipeline output)
     * @param requestBody
     * @returns ClockActivitiesResponse
     * @throws ApiError
     */
    public static clockControllerGetActivities(
        requestBody: ClockActivitiesRequestDto,
    ): CancelablePromise<ClockActivitiesResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/activities',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a manual clock entry
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static clockControllerSaveManual(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual/save',
        });
    }
    /**
     * Look up a single manual clock entry by id
     * @param requestBody
     * @returns any DataResult envelope with the manual entry
     * @throws ApiError
     */
    public static clockControllerGetManual(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a manual clock entry by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static clockControllerDeleteManual(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/manual/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Resend a pending invitation email to the targeted employee
     * @returns any DataResult envelope reflecting send outcome
     * @throws ApiError
     */
    public static clockControllerResendInvitation(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/invitation/resend',
        });
    }
    /**
     * Revoke a pending invitation
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static clockControllerDeleteInvitation(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/invitation/delete',
        });
    }
    /**
     * Persist a web-clock punch (in/out/break) for the current user
     * @returns any DataResult envelope reflecting punch outcome
     * @throws ApiError
     */
    public static clockControllerSaveWebClock(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/clock/web/save',
        });
    }
}

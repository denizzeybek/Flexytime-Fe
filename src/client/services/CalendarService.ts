/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarConnectUrlDto } from '../models/CalendarConnectUrlDto';
import type { CalendarFolderDto } from '../models/CalendarFolderDto';
import type { CalendarStatusDto } from '../models/CalendarStatusDto';
import type { SaveCalendarFoldersDto } from '../models/SaveCalendarFoldersDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CalendarService {
    /**
     * Get the Google Calendar consent URL to redirect the user to
     * @returns CalendarConnectUrlDto
     * @throws ApiError
     */
    public static calendarControllerConnect(): CancelablePromise<CalendarConnectUrlDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/google/connect',
        });
    }
    /**
     * List the user's Google calendars, marking which are selected to sync
     * @returns CalendarFolderDto
     * @throws ApiError
     */
    public static calendarControllerFolders(): CancelablePromise<Array<CalendarFolderDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/google/folders',
        });
    }
    /**
     * Save which Google calendars to sync as meetings
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static calendarControllerSaveFolders(
        requestBody: SaveCalendarFoldersDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/calendar/google/folders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Calendar connection status + the stored selected Google calendars
     * @returns CalendarStatusDto
     * @throws ApiError
     */
    public static calendarControllerStatus(): CancelablePromise<CalendarStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/calendar/status',
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimesheetService {
    /**
     * List time-tracking projects available to the user
     * @returns any TimeProjectViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetProjects(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/projects',
        });
    }
    /**
     * Create or update a time-tracking project
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static timesheetControllerSaveProject(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/project/save',
        });
    }
    /**
     * Delete a time-tracking project by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static timesheetControllerDeleteProject(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/project/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List time-entry tags defined for the tenant
     * @returns any TimeTagViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetTags(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/tags',
        });
    }
    /**
     * Create or update a time-entry tag
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static timesheetControllerSaveTag(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/tag/save',
        });
    }
    /**
     * Delete a time-entry tag by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static timesheetControllerDeleteTag(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/tag/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List tasks available for time tracking
     * @returns any TimeTaskViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetTasks(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/tasks',
        });
    }
    /**
     * Create or update a task
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static timesheetControllerSaveTask(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/task/save',
        });
    }
    /**
     * Delete a task by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static timesheetControllerDeleteTask(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/task/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the week grid (employee/project perspective)
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1. Two-level grid [{ Name, Days, Children:[{ Name, Days }] }]; Days is 7 per-day totals in SECONDS (Mon→Sun), not the legacy "HH:mm". Body { StartDate: dd.MM.yyyy, Perspective: "employee"|"project" }. FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any TimeEntryWeekViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetWeek(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/week',
        });
    }
    /**
     * Return the day’s time entries (grouped by RecordDate)
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1. Group { RecordDate (UTC-midnight ISO), Entries }; each entry has UTC ISO range Start/End + Seconds; the legacy DateRangeText/TimeSpanText/dd.MM.yyyy strings are dropped (FE formats). Body is { RecordDate: dd.MM.yyyy }. FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any TimeEntryGroupViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetEntries(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entries',
        });
    }
    /**
     * Return clock-derived time entries grouped for the query window
     * @returns any TimeClockGroupViewModel[]
     * @throws ApiError
     */
    public static timesheetControllerGetClocks(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/clocks',
        });
    }
    /**
     * Create or update a single time entry
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (StartDate/EndDate are ISO-8601 UTC instants instead of dd.MM.yyyy tr-TR strings; project/task/tags by flat IDs; time-duration fallback dropped). FE refactor required. See docs/worktime-redesign.md.
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static timesheetControllerSaveTimeEntry(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entry/save',
        });
    }
    /**
     * Delete a single time entry by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static timesheetControllerDeleteTimeEntry(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entry/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a contiguous range of time entries identified by the range id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static timesheetControllerDeleteTimeEntryRange(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entryrange/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { PerformReferenceModel } from '../models/PerformReferenceModel';
import type { TimeClockGroupViewModel } from '../models/TimeClockGroupViewModel';
import type { TimeEntryGroupViewModel } from '../models/TimeEntryGroupViewModel';
import type { TimeEntryModifyViewModel } from '../models/TimeEntryModifyViewModel';
import type { TimeEntryQueryViewModel } from '../models/TimeEntryQueryViewModel';
import type { TimeEntryWeekViewModel } from '../models/TimeEntryWeekViewModel';
import type { TimeProjectModifyViewModel } from '../models/TimeProjectModifyViewModel';
import type { TimeProjectViewModel } from '../models/TimeProjectViewModel';
import type { TimeTagModifyViewModel } from '../models/TimeTagModifyViewModel';
import type { TimeTagViewModel } from '../models/TimeTagViewModel';
import type { TimeTaskModifyViewModel } from '../models/TimeTaskModifyViewModel';
import type { TimeTaskViewModel } from '../models/TimeTaskViewModel';
import type { TimeWeekQueryViewModel } from '../models/TimeWeekQueryViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimesheetApiService {
    /**
     * @returns TimeProjectViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetProjects(): CancelablePromise<Array<TimeProjectViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/projects',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiSaveProject(
        model: TimeProjectModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/project/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiDeleteProject(
        model: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/project/delete',
            body: model,
        });
    }
    /**
     * @returns TimeTagViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetTags(): CancelablePromise<Array<TimeTagViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/tags',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiSaveTag(
        model: TimeTagModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/tag/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiDeleteTag(
        model: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/tag/delete',
            body: model,
        });
    }
    /**
     * @returns TimeTaskViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetTasks(): CancelablePromise<Array<TimeTaskViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/timesheet/tasks',
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiSaveTask(
        model: TimeTaskModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/task/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiDeleteTask(
        model: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/task/delete',
            body: model,
        });
    }
    /**
     * @param model
     * @returns TimeEntryWeekViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetTimeWeekEntries(
        model: TimeWeekQueryViewModel,
    ): CancelablePromise<Array<TimeEntryWeekViewModel>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/week',
            body: model,
        });
    }
    /**
     * @param model
     * @returns TimeEntryGroupViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetTimeEntries(
        model: TimeEntryQueryViewModel,
    ): CancelablePromise<Array<TimeEntryGroupViewModel>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entries',
            body: model,
        });
    }
    /**
     * @param model
     * @returns TimeClockGroupViewModel OK
     * @throws ApiError
     */
    public static timesheetApiGetTimeClocks(
        model: TimeEntryQueryViewModel,
    ): CancelablePromise<Array<TimeClockGroupViewModel>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/clocks',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiSaveTimeEntry(
        model: TimeEntryModifyViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entry/save',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiDeleteTimeEntry(
        model: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entry/delete',
            body: model,
        });
    }
    /**
     * @param model
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static timesheetApiDeleteTimeEntryRange(
        model: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/timesheet/entryrange/delete',
            body: model,
        });
    }
}

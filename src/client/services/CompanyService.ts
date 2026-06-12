/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyService {
    /**
     * List configured company holidays
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (Start/End are UTC ISO instants, not dd.MM.yyyy/HH:mm; StartDate/StartTime/EndDate/EndTime/StartDateText/EndDateText dropped — FE formats in UTC). FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any HolidayViewModel[]
     * @throws ApiError
     */
    public static companyControllerHolidays(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/holidays',
        });
    }
    /**
     * Look up a single holiday by reference id
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (Start/End UTC ISO instants; formatted-string fields dropped). FE refactor required. See docs/time-and-timezone-contract.md.
     * @param requestBody
     * @returns any DataResult envelope with HolidayViewModel
     * @throws ApiError
     */
    public static companyControllerGetHoliday(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a holiday
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveHoliday(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday/save',
        });
    }
    /**
     * Delete a holiday by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static companyControllerDeleteHoliday(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List job titles defined for the tenant
     * @returns any TitleViewModel[]
     * @throws ApiError
     */
    public static companyControllerTitles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/titles',
        });
    }
    /**
     * Look up a single title by reference id
     * @param requestBody
     * @returns any DataResult envelope with TitleViewModel
     * @throws ApiError
     */
    public static companyControllerGetTitle(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a job title
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveTitle(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title/save',
        });
    }
    /**
     * Delete a job title by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static companyControllerDeleteTitle(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List teams defined for the tenant
     * @returns any TeamViewModel[]
     * @throws ApiError
     */
    public static companyControllerTeams(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/teams',
        });
    }
    /**
     * Create or update a team
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveTeam(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/team/save',
        });
    }
    /**
     * Delete a team by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static companyControllerDeleteTeam(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/team/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the tenant work-hours settings (shift hours, break rules, etc.)
     * @returns any WorkSettingViewModel
     * @throws ApiError
     */
    public static companyControllerWorkHours(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/workhours',
        });
    }
    /**
     * Save the tenant work-hours settings
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveWorkHours(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/workhours/save',
        });
    }
    /**
     * Return the tenant organisation tree (departments + reporting chain)
     * @returns any OrganizationViewModel
     * @throws ApiError
     */
    public static companyControllerOrganization(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/organization',
        });
    }
    /**
     * Save the tenant organisation tree
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveOrganization(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/organization/save',
        });
    }
    /**
     * List scheduled email-report configurations
     * @returns any PerformReportViewModel
     * @throws ApiError
     */
    public static companyControllerReports(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/reports',
        });
    }
    /**
     * Look up a single scheduled report by reference id
     * @param requestBody
     * @returns any DataResult envelope with ReportModifyModel
     * @throws ApiError
     */
    public static companyControllerGetReport(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update a scheduled email-report configuration
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveReport(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report/save',
        });
    }
    /**
     * Delete a scheduled report by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static companyControllerDeleteReport(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HolidayDto } from '../models/HolidayDto';
import type { OrganizationDto } from '../models/OrganizationDto';
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { ReportModifyDto } from '../models/ReportModifyDto';
import type { TeamDto } from '../models/TeamDto';
import type { TitleDto } from '../models/TitleDto';
import type { WorkSettingDto } from '../models/WorkSettingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyService {
    /**
     * List configured company holidays
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (Start/End are UTC ISO instants, not dd.MM.yyyy/HH:mm; StartDate/StartTime/EndDate/EndTime/StartDateText/EndDateText dropped — FE formats in UTC). FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any HolidayDto[]
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
     * @returns any DataResult envelope with HolidayDto
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveHoliday(
        requestBody: HolidayDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday/save',
            body: requestBody,
            mediaType: 'application/json',
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
     * @returns any TitleDto[]
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
     * @returns any DataResult envelope with TitleDto
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveTitle(
        requestBody: TitleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title/save',
            body: requestBody,
            mediaType: 'application/json',
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
     * @returns any TeamDto[]
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveTeam(
        requestBody: TeamDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/team/save',
            body: requestBody,
            mediaType: 'application/json',
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
     * @returns any WorkSettingDto
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveWorkHours(
        requestBody: WorkSettingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/workhours/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return the tenant organisation tree (departments + reporting chain)
     * @returns any OrganizationDto
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveOrganization(
        requestBody: OrganizationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/organization/save',
            body: requestBody,
            mediaType: 'application/json',
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
     * @returns any DataResult envelope with ReportModifyDto
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
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static companyControllerSaveReport(
        requestBody: ReportModifyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report/save',
            body: requestBody,
            mediaType: 'application/json',
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

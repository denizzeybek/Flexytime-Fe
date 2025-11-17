/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DataResultViewModel } from '../models/DataResultViewModel';
import type { HolidayViewModel } from '../models/HolidayViewModel';
import type { OrganizationViewModel } from '../models/OrganizationViewModel';
import type { PerformReferenceModel } from '../models/PerformReferenceModel';
import type { PerformReportViewModel } from '../models/PerformReportViewModel';
import type { ReportModifyModel } from '../models/ReportModifyModel';
import type { TitleViewModel } from '../models/TitleViewModel';
import type { WorkSettingViewModel } from '../models/WorkSettingViewModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyApiService {
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiSaveHoliday(
        request: HolidayViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiDeleteHoliday(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiGetHoliday(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/holiday',
            body: request,
        });
    }
    /**
     * @returns HolidayViewModel OK
     * @throws ApiError
     */
    public static companyApiHolidays(): CancelablePromise<Array<HolidayViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/holidays',
        });
    }
    /**
     * @returns WorkSettingViewModel OK
     * @throws ApiError
     */
    public static companyApiWorkHours(): CancelablePromise<WorkSettingViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/workhours',
        });
    }
    /**
     * @returns TitleViewModel OK
     * @throws ApiError
     */
    public static companyApiTitles(): CancelablePromise<Array<TitleViewModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/titles',
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiSaveTitle(
        request: TitleViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiDeleteTitle(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiGetTitle(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/title',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiSaveWorkHours(
        request: WorkSettingViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/workhours/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiSaveOrganization(
        request: OrganizationViewModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/organization/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiSaveReport(
        request: ReportModifyModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report/save',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiDeleteReport(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report/delete',
            body: request,
        });
    }
    /**
     * @param request
     * @returns DataResultViewModel OK
     * @throws ApiError
     */
    public static companyApiGetReport(
        request: PerformReferenceModel,
    ): CancelablePromise<DataResultViewModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/company/report',
            body: request,
        });
    }
    /**
     * @returns PerformReportViewModel OK
     * @throws ApiError
     */
    public static companyApiReports(): CancelablePromise<PerformReportViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/reports',
        });
    }
    /**
     * @returns OrganizationViewModel OK
     * @throws ApiError
     */
    public static companyApiOrganization(): CancelablePromise<OrganizationViewModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/company/organization',
        });
    }
}

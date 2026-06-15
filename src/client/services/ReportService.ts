/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportDownloadDto } from '../models/ReportDownloadDto';
import type { ReportPresetMetaDto } from '../models/ReportPresetMetaDto';
import type { ReportQueryDto } from '../models/ReportQueryDto';
import type { ReportRunDto } from '../models/ReportRunDto';
import type { ReportSavedFilterDeleteDto } from '../models/ReportSavedFilterDeleteDto';
import type { ReportSavedFilterDto } from '../models/ReportSavedFilterDto';
import type { ReportSavedFilterSaveDto } from '../models/ReportSavedFilterSaveDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportService {
    /**
     * List the caller-company saved Time Entries filters
     * RESHAPED-v2 — backs the Time Entries tab "Save as Filter" + Scheduled modal preset/filter dropdown. Returns every PerformSavedFilter for the caller's CompanyId sorted alphabetically.
     * @returns ReportSavedFilterDto
     * @throws ApiError
     */
    public static reportControllerListSavedFilters(): CancelablePromise<Array<ReportSavedFilterDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/report/saved-filters',
        });
    }
    /**
     * Create or update a saved Time Entries / Worktime filter
     * RESHAPED-v2 — body `{ID?, Name, DataSource:"time-entry"|"worktime", FilterSpec}`. The FilterSpec mirrors ReportQueryViewModel so the scheduler can replay the same query when the cron fires.
     * @param requestBody
     * @returns ReportSavedFilterDto
     * @throws ApiError
     */
    public static reportControllerSaveSavedFilter(
        requestBody: ReportSavedFilterSaveDto,
    ): CancelablePromise<ReportSavedFilterDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/saved-filter/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a saved filter by ID (company-scoped)
     * @param requestBody
     * @returns any { Status: 0 }
     * @throws ApiError
     */
    public static reportControllerDeleteSavedFilter(
        requestBody: ReportSavedFilterDeleteDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/saved-filter/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List the available built-in report presets
     * RESHAPED-v2 — first cut of the Reports Landing catalog. Returns the preset metadata the FE renders as cards. Worktime presets carry requiresWorktime=true so the FE shows an empty state when the company has no agent data.
     * @returns ReportPresetMetaDto
     * @throws ApiError
     */
    public static reportControllerListPresets(): CancelablePromise<Array<ReportPresetMetaDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/report/presets',
        });
    }
    /**
     * Run a preset (or template) and return its ReportResultViewModel
     * RESHAPED-v2 — preset/template runner. Body: { presetId? | templateId?, override? }. The result is the same shape as POST /query plus a Meta block { DataSource, Range, Tz } so the FE knows which data source produced it. Worktime presets throw NotImplemented until the WorktimeReportService lands; templates throw NotImplemented until Phase 4.
     * @param requestBody
     * @returns any ReportResultViewModel + Meta
     * @throws ApiError
     */
    public static reportControllerRunReport(
        requestBody: ReportRunDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/run',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                501: `Template / worktime path`,
            },
        });
    }
    /**
     * Return the filter options available to the current user
     * @returns any ReportFilterViewModel — dropdowns/date ranges/scopes
     * @throws ApiError
     */
    public static reportControllerGetFilters(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/report/filters',
        });
    }
    /**
     * Execute a report query with the given filter selections
     * @param requestBody
     * @returns any ReportResultViewModel — rows + aggregates for the query
     * @throws ApiError
     */
    public static reportControllerQueryReport(
        requestBody: ReportQueryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/query',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Run the same report query as POST /query and stream the result as XLSX
     * RESHAPED-v2 — one-shot XLSX download. Body is identical to POST /query; response is an exceljs-rendered .xlsx with Summary, Grouping, and Daily sheets. Role-gated identically to /query (plain Employee sees own data only).
     * @param requestBody
     * @returns any XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
     * @throws ApiError
     */
    public static reportControllerDownloadReport(
        requestBody: ReportQueryDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/download',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Download a preset rich .xlsx workbook
     * RESHAPED-v2 — per-preset rich workbook. Body: { presetId, override? }. The preset declares its own buildXlsxLayout() so each report (timesheet-summary, project-hours, attendance, …) ships its own purpose-built sheets (Overview, By Employee, By Project, By Day, etc.) instead of the generic three-sheet skeleton served by POST /download.
     * @param requestBody
     * @returns any XLSX (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
     * @throws ApiError
     */
    public static reportControllerDownloadPreset(
        requestBody: ReportDownloadDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/report/download/preset',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}

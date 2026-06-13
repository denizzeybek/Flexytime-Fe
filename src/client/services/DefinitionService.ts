/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnualDto } from '../models/AnnualDto';
import type { PerformReferenceDto } from '../models/PerformReferenceDto';
import type { TheMemberModifyDto } from '../models/TheMemberModifyDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefinitionService {
    /**
     * List employees defined within the current tenant
     * @returns any PerformEmployeeResponse
     * @throws ApiError
     */
    public static definitionControllerEmployees(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/employees',
        });
    }
    /**
     * Look up a single employee by reference id
     * RESHAPED-v2 — returns the rich MemberViewModel (same as the employees() list) + Email, not the slim scaffold EmployeeViewModel. FE refactor required.
     * @param requestBody
     * @returns any DataResult<MemberViewModel>
     * @throws ApiError
     */
    public static definitionControllerGetEmployee(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update an employee record
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static definitionControllerSaveEmployee(
        requestBody: TheMemberModifyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an employee by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static definitionControllerDeleteEmployee(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/employee/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List annual-leave allotments for the current tenant
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (AnnualDto Start/End are UTC ISO instants, not dd.MM.yyyy/HH:mm; StartDate/StartTime/EndDate/EndTime/StartDateText/EndDateText dropped — FE formats in UTC). FE refactor required. See docs/time-and-timezone-contract.md.
     * @returns any AnnualListResponse
     * @throws ApiError
     */
    public static definitionControllerAnnuals(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/annuals',
        });
    }
    /**
     * Look up a single annual-leave entry by id
     * @param requestBody
     * @returns any DataResult<AnnualDto>
     * @throws ApiError
     */
    public static definitionControllerGetAnnual(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create or update an annual-leave entry
     * RESHAPED-v2 — clean contract, NOT wire-compatible with legacy v1 (Start/End are ISO-8601 UTC instants instead of dd.MM.yyyy + HH:mm tr-TR StartDate/StartTime/EndDate/EndTime; member by MemberId). FE refactor required. See docs/worktime-redesign.md.
     * @param requestBody
     * @returns any DataResult envelope reflecting save outcome
     * @throws ApiError
     */
    public static definitionControllerSaveAnnual(
        requestBody: AnnualDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an annual-leave entry by id
     * @param requestBody
     * @returns any DataResult envelope reflecting delete outcome
     * @throws ApiError
     */
    public static definitionControllerDeleteAnnual(
        requestBody: PerformReferenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/webapi/definition/annual/delete',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Return members as a name/value list (dropdown helper)
     * @returns any NameValueModel[]
     * @throws ApiError
     */
    public static definitionControllerMembers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/members',
        });
    }
    /**
     * Return teams as a name/value list (dropdown helper)
     * @returns any NameValueModel[]
     * @throws ApiError
     */
    public static definitionControllerTeams(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/teams',
        });
    }
    /**
     * Return roles as a name/value list (dropdown helper)
     * @returns any NameValueModel[]
     * @throws ApiError
     */
    public static definitionControllerRoles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/roles',
        });
    }
    /**
     * Return employee titles as a name/value list
     * @returns any NameValueModel[]
     * @throws ApiError
     */
    public static definitionControllerEmployeeTitles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/employee-titles',
        });
    }
    /**
     * Return manager titles as a name/value list
     * @returns any NameValueModel[]
     * @throws ApiError
     */
    public static definitionControllerManagerTitles(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/manager-titles',
        });
    }
    /**
     * Return the employee tag catalog (tag id → label)
     * @returns any Record<string, string> — tag dictionary
     * @throws ApiError
     */
    public static definitionControllerEmployeeTags(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/webapi/definition/employee-tags',
        });
    }
}

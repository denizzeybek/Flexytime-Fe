/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LegacyMvcStubsService {
    /**
     * Stub: upload profile image — pending multer + storage backend
     * @returns any Stub envelope describing what blocks the full port
     * @throws ApiError
     */
    public static mvcControllerUploadProfileImage(): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Upload/ProfileImage',
        });
    }
    /**
     * Stub: upload employee image — pending multer + storage backend
     * @param memberId
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerUploadEmployeeImage(
        memberId?: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Upload/EmployeeImage',
            query: {
                'memberId': memberId,
            },
        });
    }
    /**
     * Stub: stream the agent MSI installer — storage backend pending
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerDownloadApp(
        id: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/DownloadApp/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Stub: fetch a stored image by id + download key — storage backend pending
     * @param id
     * @param downloadKey
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerGetImage(
        id?: string,
        downloadKey?: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/GetImage',
            query: {
                'id': id,
                'downloadKey': downloadKey,
            },
        });
    }
    /**
     * Stub: stream a rendered report by download key — report pipeline pending
     * @param downloadkey
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerDownloadReport(
        downloadkey?: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/DownloadReport',
            query: {
                'downloadkey': downloadkey,
            },
        });
    }
    /**
     * Stub: stream an employee export by download key — export pipeline pending
     * @param downloadKey
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerDownloadEmployee(
        downloadKey?: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/DownloadEmployee',
            query: {
                'downloadKey': downloadKey,
            },
        });
    }
    /**
     * Stub: stream a section export by download key — export pipeline pending
     * @param downloadKey
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerDownloadSection(
        downloadKey?: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/DownloadSection',
            query: {
                'downloadKey': downloadKey,
            },
        });
    }
    /**
     * Stub: render and stream a PDF invoice — PDF rendering pipeline pending
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerInvoice(
        id: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Download/Invoice/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Stub: resolve a short-url id to the canonical URL — Shorten store pending
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerShortenIndex(
        id: string,
    ): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Shorten/Index/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Stub: render the payment-callback landing page — gateway handler pending
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerPaymentResult(): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Payment/PaymentResult',
        });
    }
    /**
     * Stub: redirect into Google/MS OIDC external login — OIDC credentials pending
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerExternalLogin(): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Account/ExternalLogin',
        });
    }
    /**
     * Stub: complete OIDC external-login round-trip — OIDC credentials pending
     * @returns any
     * @throws ApiError
     */
    public static mvcControllerExternalLoginCallback(): CancelablePromise<{
        statusCode: number;
        message: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Account/ExternalLoginCallback',
        });
    }
}

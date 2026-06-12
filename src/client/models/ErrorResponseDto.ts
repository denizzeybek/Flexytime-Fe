/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorResponseDto = {
    /**
     * Stable machine-readable code. Examples: `"ValidationFailed"`, `"TENANT_SUSPENDED"`.
     */
    error: string;
    /**
     * Human-readable message safe to surface to the end user.
     */
    message: string;
    /**
     * For 400/422 only: per-field validation issues, keyed by DTO property name.
     */
    fields?: Record<string, any>;
    /**
     * Echoes `X-Request-Id` so support can correlate the error with logs.
     */
    traceId?: string;
};


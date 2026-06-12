/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginDto = {
    username: string;
    password: string;
    /**
     * Optional auth code (e.g. Google OAuth flow); reserved for Phase 3 OIDC paths.
     */
    code?: string;
};


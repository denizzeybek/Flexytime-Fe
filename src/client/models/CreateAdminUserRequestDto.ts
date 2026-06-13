/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateAdminUserRequestDto = {
    /**
     * Email address that will be used as the admin's login username.
     */
    Email: string;
    /**
     * Plain-text password; the service bcrypt-hashes it before persisting.
     */
    Password: string;
    /**
     * Display name shown in the app.
     */
    Fullname?: string;
};


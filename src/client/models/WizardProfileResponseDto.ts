/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WizardProfileResponseDto = {
    IsSingleUser: boolean;
    IsFresh: boolean;
    MemberId?: string;
    Fullname?: string;
    Email?: string;
    CompanyName?: string;
    /**
     * FE-facing flags translated from PerformPermission.Key (see PermissionFlag enum).
     */
    Permissions: Array<'supervisor' | 'inshift' | 'productivity' | 'wellbeing' | 'web' | 'manual' | 'cost' | 'phone' | 'location' | 'meeting' | 'mask'>;
    /**
     * Lower-cased role list — well-known values are in CustomerRole, but the
     * underlying ASP.NET Identity data may carry other strings, so the field
     * stays `string[]` and the enum is documentation, not a constraint.
     */
    Roles: Array<string>;
    IsEmployee: boolean;
};


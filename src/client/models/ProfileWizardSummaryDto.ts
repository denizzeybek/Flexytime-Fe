/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileWizardSummaryDto = {
    /**
     * Lowercased role names from `Customer.Roles[].Name`. Empty → `['employee']`.
     */
    Roles: Array<string>;
    /**
     * `PerformMember._id` for the authenticated user, or `null` when missing.
     */
    MemberId: string | null;
};


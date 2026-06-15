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
    /**
     * True when the caller can see other employees' data — either an Administrator
     * (Customer.Roles contains `Supervisor`) or a Manager (their PerformMember's
     * TitleId maps to a PerformTitle with IsSupervisor=true). Drives Reports
     * Team/Employee filter visibility and other role-gated UI.
     */
    CanSeeOthers: boolean;
};


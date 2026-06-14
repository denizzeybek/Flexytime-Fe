/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileWizardSummaryDto } from './ProfileWizardSummaryDto';
export type ProfileResponseDto = {
    id: string;
    username: string;
    fullname?: string;
    email?: string;
    companyId?: string;
    imageUrl?: string;
    languageCode?: string;
    timezone?: string;
    /**
     * ISO 4217 currency code for the company's cost displays (worktime usage
     * Cost perspective). Resolved on every `getMe`: PerformSetting (Type=
     * Currency) → PerformSubscription→PerformTariff.Currency fallback →
     * `'TRY'` default. The FE Basic page lets owners pick this; it then drives
     * the `/clock/section` + `/clock/employee` `Currency` field.
     */
    currency?: string;
    isLicensed: boolean;
    emailPermit: boolean;
    /**
     * Wizard summary the SPA reads for role / member-id checks.
     */
    Wizard?: ProfileWizardSummaryDto;
};


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
    isLicensed: boolean;
    emailPermit: boolean;
    /**
     * Wizard summary the SPA reads for role / member-id checks.
     */
    Wizard?: ProfileWizardSummaryDto;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockSectionRequestDto = {
    StartDate?: string;
    EndDate?: string;
    Date?: string;
    TeamId?: string;
    TitleId?: string;
    /**
     * Legacy dropdown value (Time/Cost/Rate/InShift) — informational.
     */
    Perspective?: string;
    /**
     * `All` (default) keeps out-of-shift rows tagged; `InShift` drops them.
     */
    Category?: ClockSectionRequestDto.Category;
};
export namespace ClockSectionRequestDto {
    /**
     * `All` (default) keeps out-of-shift rows tagged; `InShift` drops them.
     */
    export enum Category {
        ALL = 'All',
        IN_SHIFT = 'InShift',
    }
}


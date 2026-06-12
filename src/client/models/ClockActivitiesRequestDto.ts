/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockActivitiesRequestDto = {
    UserId?: string;
    StartDate: string;
    EndDate: string;
    /**
     * `All` (default) keeps out-of-shift rows tagged; `InShift` drops them.
     */
    Category?: ClockActivitiesRequestDto.Category;
};
export namespace ClockActivitiesRequestDto {
    /**
     * `All` (default) keeps out-of-shift rows tagged; `InShift` drops them.
     */
    export enum Category {
        ALL = 'All',
        IN_SHIFT = 'InShift',
    }
}


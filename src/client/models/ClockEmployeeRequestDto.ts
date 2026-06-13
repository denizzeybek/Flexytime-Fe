/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClockEmployeeRequestDto = {
    StartDate?: string;
    EndDate?: string;
    Date?: string;
    MemberId?: string;
    UserId?: string;
    Perspective?: string;
    Category?: ClockEmployeeRequestDto.Category;
};
export namespace ClockEmployeeRequestDto {
    export enum Category {
        ALL = 'All',
        IN_SHIFT = 'InShift',
    }
}


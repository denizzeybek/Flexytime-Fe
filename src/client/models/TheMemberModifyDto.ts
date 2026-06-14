/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TheMemberModifyDto = {
    ID?: string;
    MemberName?: string;
    TeamId: string;
    TitleId?: string;
    TitleName?: string;
    Salary?: string;
    Password?: string;
    Email?: string;
    Enabled?: boolean;
    Role?: TheMemberModifyDto.Role;
    Tags?: Array<string>;
};
export namespace TheMemberModifyDto {
    export enum Role {
        '_0' = 0,
        '_1' = 1,
        '_2' = 2,
    }
}


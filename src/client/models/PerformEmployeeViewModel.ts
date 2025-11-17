/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { ClockInvitation } from './ClockInvitation';
import type { DefinitionMemberViewModel } from './DefinitionMemberViewModel';
import type { TheMemberViewModel } from './TheMemberViewModel';
export type PerformEmployeeViewModel = {
    Members?: Array<TheMemberViewModel>;
    Roles?: Array<DefinitionMemberViewModel>;
    EmployeeTitles?: Array<DefinitionMemberViewModel>;
    ManagerTitles?: Array<DefinitionMemberViewModel>;
    Teams?: Array<DefinitionMemberViewModel>;
    Tags?: Record<string, string>;
    Invitations?: Array<ClockInvitation>;
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrganizationNodeViewModel = {
    ID?: string;
    Name?: string;
    /**
     * Legacy read-only getter `Title => Name`, serialized lowercase as JSON `title`.
     */
    title?: string;
    /**
     * Team's title display name (`subTeam.Title.Name`), resolved from `PerformTitle`.
     */
    TitleName?: string;
    /**
     * UPPER-cased first letters of each non-empty word in `Name`.
     */
    Abbreviation?: string;
    TitleId?: string;
    /**
     * Supervisor's `UserId` (empty string when the team has no supervisor).
     */
    MemberId?: string;
    /**
     * Supervisor's `Fullname`; `null` when the team has no supervisor.
     */
    MemberName?: string | null;
    /**
     * Legacy quirk: equals `ID` (`TeamId = subTeam.Id`).
     */
    TeamId?: string;
    /**
     * FE-only parent-tracking hint emitted by the org-chart UI (vue-flow / tree-dnd).
     * The server determines parent purely from tree position (`children` nesting), so
     * this field is read-through whitelisting and intentionally ignored downstream.
     * Without an explicit `@IsOptional()` declaration the global `ValidationPipe`
     * (`forbidNonWhitelisted: true`) would reject the entire payload with 400.
     */
    _parentId?: string;
    /**
     * Recursive child nodes, serialized lowercase as JSON `children`.
     */
    children?: Array<OrganizationNodeViewModel>;
};


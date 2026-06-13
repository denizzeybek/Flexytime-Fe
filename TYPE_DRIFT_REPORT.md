# Flexytime-Fe TS Drift Report

**Date:** 2026-06-13
**Total errors:** 123
**Status:** Backend swagger regenerated via `npm run gcl` from test.api.flexytime.com.

Mechanical renames already applied (CalendarFolder→CalendarFolderDto, ClockSection2Response→ClockSectionResponse, ClockWellBeingItem→ClockWellBeing, PerformReferenceModel→PerformReferenceDto, WebClockAllocationViewModel→ClockAllocationViewModel, timesheetControllerGetTimeEntries→GetEntries, GetTimeClocks→GetClocks, GetTimeWeekEntries→GetWeek).

---

## A) Missing types from @/client (TS2305 — 75 errors)

These names no longer exist as exports. Some are renamed, some removed. Each row needs a product decision: what's the new shape, OR delete the consumer.

| Missing type | Occurrences | Files |
|---|---|---|
| `AdvancedPermissonViewModel` | 2 | `src/stores/settings/advanced.ts`<br>`src/views/settings/_views/Advanced.vue` |
| `AdvancedSettingModifyModel` | 1 | `src/stores/settings/advanced.ts` |
| `CardViewModel` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockBreadCrumb` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockGraphGroup` | 2 | `src/views/worktimeUsage/_components/tabs/GraphTab.vue`<br>`src/views/worktimeUsage/_types/api.ts` |
| `ClockGraph` | 1 | `src/views/worktimeUsage/_components/tabs/GraphTab.vue` |
| `ClockInvitation` | 1 | `src/stores/hrSettings/Employees.ts` |
| `ClockSectionIndividual` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockSectionSupervisorAvatar` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockSectionTeamAvatar` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockSectionTeamset` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockSectionTeam` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `ClockStatistic` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `CompanyViewModel` | 4 | `src/stores/settings/companies.ts`<br>`src/views/settings/_components/companies/CompaniesList.vue`<br>`src/views/settings/_components/companies/CompaniesTable.vue`<br>`src/views/settings/_components/companies/_modals/CompanyModal.vue` |
| `DefinitionMemberViewModel` | 2 | `src/stores/hrSettings/Employees.ts`<br>`src/stores/hrSettings/annuals.ts` |
| `DownloadViewModel` | 1 | `src/stores/settings/download.ts` |
| `EmployeeViewModel` | 1 | `src/stores/profile/profile.ts` |
| `GraphViewModel2` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `LicenseModifyViewModel` | 1 | `src/stores/profile/profile.ts` |
| `LicenseViewModel` | 1 | `src/stores/profile/profile.ts` |
| `OrganizationNodeViewModel` | 6 | `src/stores/company/organizationChart.ts`<br>`src/views/company/_components/organizationChart/NodeEditDialog.vue`<br>`src/views/company/_components/organizationChart/OrganizationChartDeleteDialog.vue`<br>`src/views/company/_types/organizationChartV2.ts`<br>`src/views/company/_types/organizationTree.ts`<br>`src/views/company/_views/OrganizationChart.vue` |
| `PerformNameValueModel` | 2 | `src/stores/company/organizationChart.ts`<br>`src/stores/company/reports.ts` |
| `PerformReportViewModel` | 1 | `src/stores/company/reports.ts` |
| `PermissionModifyViewModel` | 1 | `src/stores/settings/permissions.ts` |
| `PermissonViewModel` | 2 | `src/stores/settings/permissions.ts`<br>`src/views/settings/_views/Permissions.vue` |
| `ProfileModifyViewModel` | 1 | `src/stores/profile/profile.ts` |
| `ProfileViewModel` | 1 | `src/stores/profile/profile.ts` |
| `PromotionListViewModel` | 1 | `src/stores/promotion/promotion.ts` |
| `PromotionViewModel` | 1 | `src/stores/promotion/promotion.ts` |
| `ReportFilterViewModel` | 1 | `src/stores/company/reports.ts` |
| `ReportGraphGroupViewModel` | 1 | `src/stores/company/reports.ts` |
| `ReportGroupViewModel` | 1 | `src/stores/company/reports.ts` |
| `ReportResultViewModel` | 1 | `src/stores/company/reports.ts` |
| `ReportSummaryViewModel` | 1 | `src/stores/company/reports.ts` |
| `ReportViewModel` | 4 | `src/stores/company/reports.ts`<br>`src/views/company/_components/reports/_modals/DefaultReportModal.vue`<br>`src/views/company/_components/reports/defaultReports/DefaultReportsList.vue`<br>`src/views/company/_components/reports/defaultReports/DefaultReportsTable.vue` |
| `SectionClockSummary` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `TheMemberViewModel` | 7 | `src/stores/hrSettings/Employees.ts`<br>`src/views/hrSettings/_components/employees/EmployeesList.vue`<br>`src/views/hrSettings/_components/employees/EmployeesTable.vue`<br>`src/views/hrSettings/_components/employees/_modals/EmployeeModal.vue`<br>`src/views/hrSettings/_components/employees/_modals/QuickAssignModal.vue`<br>`src/views/hrSettings/_components/employees/_modals/_components/EmployeeModalContent.vue`<br>`src/views/hrSettings/_composables/useEmployeeModalValidation.ts` |
| `TimeClockGroupViewModel` | 2 | `src/stores/timeSheets/timeEntries.ts`<br>`src/views/timesheets/_views/UnclassifiedTimeEntries.vue` |
| `TimeClockViewModel` | 3 | `src/views/timesheets/_components/timeEntries/EnterTime.vue`<br>`src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue`<br>`src/views/timesheets/_views/UnclassifiedTimeEntries.vue` |
| `TimeEntryGroupViewModel` | 1 | `src/stores/timeSheets/timeEntries.ts` |
| `TimeEntryWeekViewModel` | 2 | `src/stores/timeSheets/timeManagement.ts`<br>`src/views/timesheets/_components/timeManagement/TimeManagementTable.vue` |
| `TimeProjectViewModel` | 1 | `src/stores/timeSheets/timeEntries.ts` |
| `TimeTagViewModel` | 1 | `src/stores/timeSheets/timeEntries.ts` |
| `TimeTaskViewModel` | 1 | `src/stores/timeSheets/timeEntries.ts` |
| `TimeZoneViewModel` | 1 | `src/stores/profile/profile.ts` |
| `WebClockViewModel` | 1 | `src/views/worktimeUsage/_types/api.ts` |
| `WizardProfileViewModel` | 1 | `src/customClient/models/AuthTypes.ts` |
| `WorkDayViewModel` | 2 | `src/stores/company/workingHours.ts`<br>`src/views/company/_views/WorkingHours.vue` |

## B) Missing properties on existing types (TS2339 — 31 errors)

The type still exists but the property does not. Backend renamed/removed field.

| Property | Type | Line | File |
|---|---|---|---|
| `ID` | `WebClockModifyDto` | 91 | `src/stores/classification/webAddresses.ts` |
| `AlwaysOn` | `WebClockModifyDto` | 97 | `src/stores/classification/webAddresses.ts` |
| `AlwaysOn` | `WebClockModifyDto` | 98 | `src/stores/classification/webAddresses.ts` |
| `Employee` | `ProfileResponseDto` | 106 | `src/stores/profile/profile.ts` |
| `IsMailSubscribe` | `ProfileResponseDto` | 109 | `src/stores/profile/profile.ts` |
| `EntryId` | `TimeEntryQueryDto` | 201 | `src/stores/timeSheets/timeEntries.ts` |
| `EntryId` | `{ RecordDate?: string ` |  undefined; Hours?: number  | ` undefined; MemberId?: string ` |
| `EntryId` | `TimeEntryQueryDto` | 230 | `src/stores/timeSheets/timeEntries.ts` |
| `EntryId` | `{ RecordDate?: string ` |  undefined; Hours?: number  | ` undefined; MemberId?: string ` |
| `EntryId` | `{ RecordDate?: string ` |  undefined; Hours?: number  | ` undefined; MemberId?: string ` |
| `EntryId` | `{ RecordDate?: string ` |  undefined; Hours?: number  | ` undefined; MemberId?: string ` |
| `Domain` | `FormTimeClock` | 12 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Domain` | `FormTimeClock` | 29 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Domain` | `FormTimeClock` | 31 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Name` | `FormTimeClock` | 36 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Title` | `FormTimeClock` | 44 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Title` | `FormTimeClock` | 45 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Domain` | `FormTimeClock` | 52 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Spend` | `FormTimeClock` | 53 | `src/views/timesheets/_components/unclassified/UnclassifiedClockCard.vue` |
| `Spend` | `{ Selected?: boolean ` |  undefined; Details?: any; } | `125` |
| `statisticType` | `{ formattedTime: string; applications: { formattedTime: string; AllocationId: string; Name: string; Seconds: number; Cost: string; }[]; chart: { labels: string[]; datasets: { data: any[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; }; Domain: Domain; Seconds: number; Cost: string; Applications: C...` | 40 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `statisticType` | `{ formattedTime: string; applications: { formattedTime: string; AllocationId: string; Name: string; Seconds: number; Cost: string; }[]; chart: { labels: string[]; datasets: { data: any[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; }; Domain: Domain; Seconds: number; Cost: string; Applications: C...` | 42 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `statisticType` | `{ formattedTime: string; applications: { formattedTime: string; AllocationId: string; Name: string; Seconds: number; Cost: string; }[]; chart: { labels: string[]; datasets: { data: any[]; backgroundColor: string[]; hoverBackgroundColor: string[]; }[]; }; Domain: Domain; Seconds: number; Cost: string; Applications: C...` | 44 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `title` | `{ formattedTime: string; AllocationId: string; Name: string; Seconds: number; Cost: string; }` | 66 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `time` | `ClockDistribution` | 134 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `time` | `ClockDistributionApp` | 137 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `Chart` | `ClockDistribution` | 139 | `src/views/worktimeUsage/_components/tabs/DistributionTab.vue` |
| `Type` | `ClockAllocationViewModel` | 18 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |
| `Type` | `ClockAllocationViewModel` | 20 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |
| `Spent` | `ClockAllocationViewModel` | 26 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |
| `WebClocks` | `ClockAllocationViewModel` | 33 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |
| `WebClocks` | `ClockAllocationViewModel` | 33 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |
| `WebClocks` | `ClockAllocationViewModel` | 34 | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |

## C) Did-you-mean property renames (TS2551 — 5 errors)

| Old name | Suggested | File |
|---|---|---|
| `TimeZone` | `timezone` | `src/stores/profile/profile.ts` |
| `LanguageCode` | `languageCode` | `src/stores/profile/profile.ts` |
| `ID` | `Id` | `src/views/worktimeUsage/_components/tabs/WebHistoryTab.vue` |

## D) Object literal mismatches (TS2353/2554/2345/2322/2352 — 12 errors)

src/components/ui/global/MultiSelect.vue(31,24): error TS2322: Type '{ value: any; removeCallback: (event: Event, item: any) => void; }' is not assignable to type 'ChipSlotProps'.
src/stores/timeSheets/timeEntries.ts(201,11): error TS2353: Object literal may only specify known properties, and 'EntryId' does not exist in type 'TimeEntryQueryDto'.
src/stores/timeSheets/timeEntries.ts(230,11): error TS2353: Object literal may only specify known properties, and 'EntryId' does not exist in type 'TimeEntryQueryDto'.
src/stores/timeSheets/timeEntries.ts(248,9): error TS2353: Object literal may only specify known properties, and 'EntryId' does not exist in type 'TimeEntryQueryDto'.
src/stores/timeSheets/timeEntries.ts(292,77): error TS2554: Expected 0 arguments, but got 1.
src/stores/timeSheets/timeEntries.ts(318,63): error TS2554: Expected 0 arguments, but got 1.
src/stores/timeSheets/timeEntries.ts(340,59): error TS2554: Expected 0 arguments, but got 1.
src/stores/worktimeUsage/worktimeStore.ts(151,10): error TS2352: Conversion of type '{ id: string; statisticType: string; time: string; Applications: { imgPath: string; title: string; time: string; }[]; Chart: { label: string; value: number; }[]; }[]' to type 'ClockDistribution[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
src/views/timesheets/_components/timeEntries/EnterTime.vue(280,7): error TS2353: Object literal may only specify known properties, and 'Task' does not exist in type 'TimeEntryPayload'.
src/views/worktimeUsage/index.vue(98,18): error TS2322: Type 'IWellBeingGraph[] | { Type: string; Name: string; Color: "green" | "red" | "yellow"; Icon: string; Graph: { labels?: string[] | undefined; datasets?: { label?: string | undefined; data?: number[] | undefined; backgroundColor?: string | undefined; borderColor?: string | undefined; }[] | undefined; Unit?: string | und...' is not assignable to type 'IWellBeingGraph[] | undefined'.

---

## How to triage

For each row in section A:
- If you know the new name → tell me and I'll rename across all listed files
- If the type was removed because the endpoint/feature was dropped → tell me to delete the consumer files
- If you need the type to keep working → backend team needs to re-add it to swagger

For sections B/C/D: I can apply property renames once you confirm the new field names.

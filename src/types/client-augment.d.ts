/**
 * Augments `@/client` with the legacy *ViewModel types that the BE still ships
 * as `export interface` in `libs/contracts/src/**` and that the OpenAPI plugin
 * therefore strips from swagger (interfaces are erased; the codegen only emits
 * DTO **classes**). Memory: `feedback_be-contract-reshape-intentional` —
 * during the RESHAPED-v2 migration this drift is intentional and the FE
 * consumes raw runtime shapes.
 *
 * Until the BE rolls each shape to a class (Rule 19, BE rule), keep adding
 * the missing names here as permissive index signatures. **Do not** turn this
 * file into hand-typed mirrors of the BE contract — that's exactly the
 * hand-edit trap Rule 19 (`feedback_no-manual-client-edits`) exists to avoid.
 * Once a shape is class-ified on BE and `yarn gcl` lights it up under
 * `src/client/models/`, drop its entry here.
 */
declare module '@/client' {
  interface LegacyViewModel {
    // reason: legacy *ViewModel shapes are intentionally permissive while BE class-ification + `yarn gcl` are pending (Rule 19 BE / state-services.md Regeneration).
    [key: string]: any;
  }

  export interface AdvancedPermissonViewModel extends LegacyViewModel {}
  export interface AdvancedSettingModifyModel extends LegacyViewModel {}
  export interface CardViewModel extends LegacyViewModel {}
  export interface ClockGraph extends LegacyViewModel {}
  export interface ClockGraphGroup extends LegacyViewModel {}
  export interface ClockInvitation extends LegacyViewModel {}
  export interface ClockSectionIndividual extends LegacyViewModel {}
  export interface ClockSectionSupervisorAvatar extends LegacyViewModel {}
  export interface ClockSectionTeam extends LegacyViewModel {}
  export interface ClockSectionTeamAvatar extends LegacyViewModel {}
  export interface ClockSectionTeamset extends LegacyViewModel {}
  export interface ClockStatistic extends LegacyViewModel {}
  export interface CompanyViewModel extends LegacyViewModel {}
  export interface DefinitionMemberViewModel extends LegacyViewModel {}
  export interface DownloadViewModel extends LegacyViewModel {}
  export interface EmployeeViewModel extends LegacyViewModel {}
  export interface GraphViewModel2 extends LegacyViewModel {}
  export interface LicenseModifyViewModel extends LegacyViewModel {}
  export interface LicenseViewModel extends LegacyViewModel {}
  export interface PerformNameValueModel extends LegacyViewModel {}
  export interface PerformReportViewModel extends LegacyViewModel {}
  export interface PermissionModifyViewModel extends LegacyViewModel {}
  export interface PermissonViewModel extends LegacyViewModel {}
  export interface ProfileViewModel extends LegacyViewModel {}
  export interface PromotionListViewModel extends LegacyViewModel {}
  export interface PromotionViewModel extends LegacyViewModel {}
  export interface ReportFilterViewModel extends LegacyViewModel {}
  export interface ReportGraphGroupViewModel extends LegacyViewModel {}
  export interface ReportGroupViewModel extends LegacyViewModel {}
  export interface ReportResultViewModel extends LegacyViewModel {}
  export interface ReportSummaryViewModel extends LegacyViewModel {}
  export interface ReportViewModel extends LegacyViewModel {}
  export interface SectionClockSummary extends LegacyViewModel {}
  export interface TheMemberViewModel extends LegacyViewModel {}
  export interface TimeClockGroupViewModel extends LegacyViewModel {
    RecordDate?: string;
    RecordTime?: string;
    Clocks?: TimeClockViewModel[];
  }
  export interface TimeClockViewModel extends LegacyViewModel {
    ID?: string;
    Name?: string;
    Title?: string;
    Spend?: number;
    Domain?: number;
    Selected?: boolean;
    Details?: TimeClockViewModel[];
  }
  export interface TimeEntryGroupViewModel extends LegacyViewModel {
    RecordDate?: string;
    Entries?: TimeEntryViewModel[];
  }
  export interface TimeEntryViewModel extends LegacyViewModel {
    ID?: string;
    RecordDate?: string;
    DateRangeText?: string;
    TimeSpanText?: string;
    Seconds?: number;
    Task?: TimeTaskViewModel;
    Project?: TimeProjectViewModel;
    Tags?: TimeTagViewModel[];
    Ranges?: Array<Record<string, unknown>>;
  }
  export interface TimeEntryWeekViewModel extends LegacyViewModel {
    Name?: string;
    Days?: number[];
    Children?: Array<{ Name?: string; Days?: number[] }>;
  }
  export interface TimeProjectViewModel extends LegacyViewModel {
    ID?: string;
    Name?: string;
    Color?: string;
  }
  export interface TimeTagViewModel extends LegacyViewModel {
    ID?: string;
    Name?: string;
    Color?: string;
  }
  export interface TimeTaskViewModel extends LegacyViewModel {
    ID?: string;
    Name?: string;
  }
  export interface TimeZoneViewModel extends LegacyViewModel {}
  export interface WebClockViewModel extends LegacyViewModel {}
  export interface WizardProfileViewModel extends LegacyViewModel {}
  export interface WorkDayViewModel extends LegacyViewModel {}
}

export {};

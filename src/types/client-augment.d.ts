
declare module '@/client' {
  interface LegacyViewModel {
    // reason: legacy *ViewModel shapes are intentionally permissive while BE class-ification + `yarn gcl` are pending (Rule 19 BE / state-services.md Regeneration).
    [key: string]: any;
  }

  export type AdvancedPermissonViewModel = LegacyViewModel;
  export type AdvancedSettingModifyModel = LegacyViewModel;
  export type CardViewModel = LegacyViewModel;
  export type ClockGraph = LegacyViewModel;
  export type ClockGraphGroup = LegacyViewModel;
  export type ClockInvitation = LegacyViewModel;
  export type ClockSectionIndividual = LegacyViewModel;
  export type ClockSectionSupervisorAvatar = LegacyViewModel;
  export type ClockSectionTeam = LegacyViewModel;
  export type ClockSectionTeamAvatar = LegacyViewModel;
  export type ClockSectionTeamset = LegacyViewModel;
  export type ClockStatistic = LegacyViewModel;
  export type CompanyViewModel = LegacyViewModel;
  export type DefinitionMemberViewModel = LegacyViewModel;
  export type DownloadViewModel = LegacyViewModel;
  export type EmployeeViewModel = LegacyViewModel;
  export type GraphViewModel2 = LegacyViewModel;
  export type LicenseModifyViewModel = LegacyViewModel;
  export type LicenseViewModel = LegacyViewModel;
  export type PerformNameValueModel = LegacyViewModel;
  export type PerformReportViewModel = LegacyViewModel;
  export type PermissionModifyViewModel = LegacyViewModel;
  export type PermissonViewModel = LegacyViewModel;
  export type ProfileViewModel = LegacyViewModel;
  export type PromotionListViewModel = LegacyViewModel;
  export type PromotionViewModel = LegacyViewModel;
  export type ReportFilterViewModel = LegacyViewModel;
  export type ReportGraphGroupViewModel = LegacyViewModel;
  export type ReportGroupViewModel = LegacyViewModel;
  export type ReportResultViewModel = LegacyViewModel;
  export type ReportSummaryViewModel = LegacyViewModel;
  export type ReportViewModel = LegacyViewModel;
  export type SectionClockSummary = LegacyViewModel;
  export type TheMemberViewModel = LegacyViewModel;
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
  export type TimeZoneViewModel = LegacyViewModel;
  export type WebClockViewModel = LegacyViewModel;
  export type WizardProfileViewModel = LegacyViewModel;
  export type WorkDayViewModel = LegacyViewModel;
}

export {};

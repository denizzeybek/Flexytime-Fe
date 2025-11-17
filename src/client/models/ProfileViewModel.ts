/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { AlertViewModel } from './AlertViewModel';
import type { CalendarFolder } from './CalendarFolder';
import type { EmployeeViewModel } from './EmployeeViewModel';
import type { LanguageView } from './LanguageView';
import type { TimeZoneViewModel } from './TimeZoneViewModel';
import type { WizardProfileViewModel } from './WizardProfileViewModel';
export type ProfileViewModel = {
    UserDuty?: string;
    UserTitle?: string;
    ImagePath?: string;
    EmailConfirmed?: boolean;
    EmailAddress?: string;
    IsMailSubscribe?: boolean;
    HasGoogle?: boolean;
    HasOffice?: boolean;
    Timezones?: Array<TimeZoneViewModel>;
    TimeZone?: string;
    Languages?: Array<LanguageView>;
    LanguageCode?: string;
    HasOutlook?: boolean;
    GoogleCalendars?: Array<CalendarFolder>;
    OfficeCalendars?: Array<CalendarFolder>;
    OutlookCalendars?: Array<CalendarFolder>;
    Alerts?: AlertViewModel;
    Employee?: EmployeeViewModel;
    Wizard?: WizardProfileViewModel;
    IsUnsubscribe?: boolean;
};


/**
 * User permissions in the system
 * These are fine-grained access controls for specific features
 * Backend returns these as strings in ProfileViewModel.Wizard.Permissions
 */
export enum EPermission {
  /**
   * WorktimeUsage module permissions
   */
  WORKTIME_USAGE_VIEW = 'WorktimeUsage.View',
  WORKTIME_USAGE_EXPORT = 'WorktimeUsage.Export',
  WORKTIME_USAGE_ADMIN = 'WorktimeUsage.Admin',

  /**
   * Employee management permissions
   */
  EMPLOYEE_VIEW = 'Employee.View',
  EMPLOYEE_EDIT = 'Employee.Edit',
  EMPLOYEE_DELETE = 'Employee.Delete',

  /**
   * Team management permissions
   */
  TEAM_VIEW = 'Team.View',
  TEAM_EDIT = 'Team.Edit',

  /**
   * Settings permissions
   */
  SETTINGS_VIEW = 'Settings.View',
  SETTINGS_EDIT = 'Settings.Edit',
}

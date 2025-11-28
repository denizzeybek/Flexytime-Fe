/**
 * User roles in the system
 * These values MUST match exactly what backend returns (case-sensitive!)
 *
 * Backend returns: ["employee", "supervisor", "admin", "hr"] (lowercase)
 */
export enum ERole {
  /**
   * Administrator - Full system access
   */
  ADMIN = 'admin',

  /**
   * Supervisor/Manager - Can view team data and WorktimeUsage
   */
  SUPERVISOR = 'supervisor',

  /**
   * HR - Human Resources role with limited access
   */
  HR = 'hr',

  /**
   * Employee - Standard user with basic access
   */
  EMPLOYEE = 'employee',
}

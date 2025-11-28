import { computed } from 'vue';

import { EPermission } from '@/enums/permission.enum';
import { ERole } from '@/enums/role.enum';
import { useProfileStore } from '@/stores/profile/profile';

/**
 * Authorization composable for checking user roles and permissions
 *
 * @example
 * ```ts
 * const { hasRole, hasPermission, isAdmin } = useAuthorization();
 *
 * if (hasRole(ERole.ADMIN)) {
 *   // Show admin-only content
 * }
 *
 * if (hasPermission(EPermission.WORKTIME_USAGE_VIEW)) {
 *   // Show worktime usage section
 * }
 * ```
 */
export const useAuthorization = () => {
  const profileStore = useProfileStore();

  /**
   * Check if user has a specific role
   * @param role - Role to check (ERole enum value)
   * @returns true if user has the role
   */
  const hasRole = (role: ERole): boolean => {
    return profileStore.roles.includes(role);
  };

  /**
   * Check if user has ANY of the provided roles
   * @param roles - Array of roles to check
   * @returns true if user has at least one of the roles
   */
  const hasAnyRole = (roles: ERole[]): boolean => {
    return roles.some((role) => profileStore.roles.includes(role));
  };

  /**
   * Check if user has ALL of the provided roles
   * @param roles - Array of roles to check
   * @returns true if user has all of the roles
   */
  const hasAllRoles = (roles: ERole[]): boolean => {
    return roles.every((role) => profileStore.roles.includes(role));
  };

  /**
   * Check if user has a specific permission
   * @param permission - Permission to check (EPermission enum value or string)
   * @returns true if user has the permission
   */
  const hasPermission = (permission: EPermission | string): boolean => {
    return profileStore.permissions.includes(permission);
  };

  /**
   * Check if user has ANY of the provided permissions
   * @param permissions - Array of permissions to check
   * @returns true if user has at least one of the permissions
   */
  const hasAnyPermission = (permissions: Array<EPermission | string>): boolean => {
    return permissions.some((permission) => profileStore.permissions.includes(permission));
  };

  /**
   * Check if user has ALL of the provided permissions
   * @param permissions - Array of permissions to check
   * @returns true if user has all of the permissions
   */
  const hasAllPermissions = (permissions: Array<EPermission | string>): boolean => {
    return permissions.every((permission) => profileStore.permissions.includes(permission));
  };

  /**
   * Computed property - Check if current user is Admin
   */
  const isAdmin = computed(() => profileStore.isAdmin);

  /**
   * Computed property - Check if current user is Supervisor
   */
  const isSupervisor = computed(() => profileStore.isSupervisor);

  /**
   * Computed property - Check if current user is HR
   */
  const isHR = computed(() => profileStore.isHR);

  /**
   * Computed property - Check if current user is Employee
   */
  const isEmployee = computed(() => profileStore.isEmployee);

  /**
   * Computed property - Check if user has Admin OR Supervisor role
   * Useful for WorktimeUsage access control
   */
  const canAccessWorktimeUsage = computed(() => {
    return hasAnyRole([ERole.ADMIN, ERole.SUPERVISOR]);
  });

  return {
    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Computed role flags
    isAdmin,
    isSupervisor,
    isHR,
    isEmployee,

    // Feature-specific computed flags
    canAccessWorktimeUsage,

    // Raw data (for advanced use cases)
    roles: computed(() => profileStore.roles),
    permissions: computed(() => profileStore.permissions),
  };
};

import { computed } from 'vue';

import { EPermission } from '@/enums/permission.enum';
import { ERole } from '@/enums/role.enum';
import { useProfileStore } from '@/stores/profile/profile';

export const useAuthorization = () => {
  const profileStore = useProfileStore();

  const hasRole = (role: ERole): boolean => {
    return profileStore.roles.includes(role);
  };

  const hasAnyRole = (roles: ERole[]): boolean => {
    return roles.some((role) => profileStore.roles.includes(role));
  };

  const hasAllRoles = (roles: ERole[]): boolean => {
    return roles.every((role) => profileStore.roles.includes(role));
  };

  const hasPermission = (permission: EPermission | string): boolean => {
    return profileStore.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Array<EPermission | string>): boolean => {
    return permissions.some((permission) => profileStore.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Array<EPermission | string>): boolean => {
    return permissions.every((permission) => profileStore.permissions.includes(permission));
  };

  const isAdmin = computed(() => profileStore.isAdmin);

  const isSupervisor = computed(() => profileStore.isSupervisor);

  const isHR = computed(() => profileStore.isHR);

  const isEmployee = computed(() => profileStore.isEmployee);

  const canAccessWorktimeUsage = computed(() => {
    return hasAnyRole([ERole.ADMIN, ERole.SUPERVISOR]);
  });

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,

    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    isAdmin,
    isSupervisor,
    isHR,
    isEmployee,

    canAccessWorktimeUsage,

    roles: computed(() => profileStore.roles),
    permissions: computed(() => profileStore.permissions),
  };
};

import { ERole } from '@/enums/role.enum';

/**
 * Development-only role override for testing authorization
 * Set in browser console: window.__DEV_ROLE_OVERRIDE__ = ['Admin']
 *
 * IMPORTANT: This should ONLY be used in development!
 * Backend will still enforce authorization.
 */

declare global {
  interface Window {
    __DEV_ROLE_OVERRIDE__?: string[];
    __DEV_PERMISSION_OVERRIDE__?: string[];
  }
}

export const getDevRoleOverride = (): string[] | undefined => {
  if (import.meta.env.DEV && window.__DEV_ROLE_OVERRIDE__) {
    console.warn(
      '🔧 DEV MODE: Role override active:',
      window.__DEV_ROLE_OVERRIDE__
    );
    return window.__DEV_ROLE_OVERRIDE__;
  }
  return undefined;
};

export const getDevPermissionOverride = (): string[] | undefined => {
  if (import.meta.env.DEV && window.__DEV_PERMISSION_OVERRIDE__) {
    console.warn(
      '🔧 DEV MODE: Permission override active:',
      window.__DEV_PERMISSION_OVERRIDE__
    );
    return window.__DEV_PERMISSION_OVERRIDE__;
  }
  return undefined;
};

// Helper functions for console
export const setAdminRole = () => {
  window.__DEV_ROLE_OVERRIDE__ = [ERole.ADMIN];
  console.log('✅ Role set to admin. Refresh page to apply.');
};

export const setSupervisorRole = () => {
  window.__DEV_ROLE_OVERRIDE__ = [ERole.SUPERVISOR];
  console.log('✅ Role set to supervisor. Refresh page to apply.');
};

export const setHRRole = () => {
  window.__DEV_ROLE_OVERRIDE__ = [ERole.HR];
  console.log('✅ Role set to hr. Refresh page to apply.');
};

export const setEmployeeRole = () => {
  window.__DEV_ROLE_OVERRIDE__ = [ERole.EMPLOYEE];
  console.log('✅ Role set to employee. Refresh page to apply.');
};

export const clearRoleOverride = () => {
  delete window.__DEV_ROLE_OVERRIDE__;
  delete window.__DEV_PERMISSION_OVERRIDE__;
  console.log('✅ Role override cleared. Refresh page to apply.');
};

// Make functions available in window for console access
if (import.meta.env.DEV) {
  (window as any).setAdminRole = setAdminRole;
  (window as any).setSupervisorRole = setSupervisorRole;
  (window as any).setHRRole = setHRRole;
  (window as any).setEmployeeRole = setEmployeeRole;
  (window as any).clearRoleOverride = clearRoleOverride;
}

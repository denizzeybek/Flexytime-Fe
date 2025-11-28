# Flexytime Role & Permission System - Gap Analysis

**Date:** 2025-11-27
**Analysis:** Old Project (Eclone.Executive) vs New Project (Flexytime-Fe)

---

## Executive Summary

The **old Flexytime project** (ASP.NET MVC) has a **comprehensive multi-layer authorization system** with role-based access control (RBAC), fine-grained permissions, and service-level authorization checks.

The **new Flexytime-Fe project** (Vue 3 + TypeScript) has **basic JWT authentication** but **lacks frontend authorization enforcement**. While user role and permission data is available, it is **not utilized** for access control or UI rendering.

### Critical Gaps:
1. ❌ **No role-based route guards** (anyone can access WorktimeUsage if authenticated)
2. ❌ **No permission-based UI rendering** (all features visible to all users)
3. ❌ **No authorization composable** (no helper to check roles/permissions)
4. ❌ **No permission constants/enums** (hard to maintain permission keys)

---

## 1. ROLE SYSTEM COMPARISON

### Old Project (Eclone.Executive)

**Roles:** 3 primary roles with clear responsibilities

| Role | Responsibilities | Protected Features |
|------|------------------|-------------------|
| **Admin** | System administration | Company management, License settings, Permission configuration |
| **Supervisor** | Team/Department management | Clock reports, Employee definitions, Organization chart, Team reports |
| **HR** | Human Resources | Annual leave management, Salary definitions, Employee well-being |

**Implementation:**
```csharp
// Controller-level authorization
[Authorize(Roles = "Supervisor")]
public class CompanyController : BaseController { }

// Method-level authorization
[Authorize(Roles = "Admin")]
public ActionResult DeleteCompany(string id) { }

// Service-level checks
bool isSupervisor = User.IsInRole("Supervisor");
if (!isSupervisor) return RedirectToAction("Unauthorized");
```

**Usage in Clock/WorktimeUsage:**
```csharp
// ClockController.cs - Section method
public ActionResult Section(string id) {
    var response = clockService.GetSection(request, userId);

    if (!response.IsAuthorized)
        return RedirectToAction("Index", "Profile");

    if (!response.IsSupervisor)
        return RedirectToAction("Employee"); // Redirect non-supervisors to employee view

    return View(response.Model);
}
```

---

### New Project (Flexytime-Fe)

**Roles:** Data available but **NOT USED**

User model contains role indicators:
```typescript
export interface IWizard {
  Roles: string[];          // ✅ Available
  IsManager: boolean;       // ✅ Available
  IsHR: boolean;           // ✅ Available
  IsEmployee: boolean;     // ✅ Available
  Permissions: string[];   // ✅ Available
}
```

**Implementation:** ❌ **MISSING**
- No route guards checking roles
- No component-level role checks
- No conditional rendering based on roles

**WorktimeUsage Access:**
```typescript
// src/views/worktimeUsage/index.vue
// ❌ NO ROLE CHECKS - Anyone can access if authenticated
const fetchData = async () => {
  await store.fetchSectionData({ /* ... */ }); // No permission validation
};
```

---

## 2. PERMISSION SYSTEM COMPARISON

### Old Project (Eclone.Executive)

**Permission Service:**
```csharp
// Fine-grained permission checking
public bool PermitAccess(string key, bool isSupervisor, string userId)
{
    var user = GetUserById(userId);
    var permission = GetPermission(key, user.CompanyId);
    return permission != null && permission.Enabled;
}
```

**Permission Keys Found:**
- `"calisanlar"` / `"calisanlar-back"` - Employee management
- `"calisan-refahi"` - Employee well-being features

**View-Level Usage:**
```html
@if (Html.PermissionIsOk("calisanlar"))
{
    <li><a href="/Definition/Employees">Employees</a></li>
}

@if (Html.IsWellBeingEnabled())
{
    <div class="wellbeing-section"><!-- ... --></div>
}
```

---

### New Project (Flexytime-Fe)

**Permission Store:** ✅ Exists but only for **admin management**

```typescript
// src/stores/settings/permissions.ts
export const useSettingsPermissionsStore = defineStore(EStoreNames.SETTINGS_PERMISSIONS, {
  state: (): State => ({
    list: [], // List of permissions
  }),
  actions: {
    async filter() {
      const data = await SettingApiService.settingApiPermissions();
      this.list = data;
      return data;
    },
  },
});
```

**Permission Model:**
```typescript
export type PermissonViewModel = {
  Id?: string;
  Name?: string;
  Key?: string;
  Enabled?: boolean;              // Can be toggled by admin
  VisibleOnlyByAdmin?: boolean;   // Admin-only permissions
};
```

**Usage:** ❌ **MISSING**
- Admin can enable/disable permissions in settings UI
- **BUT** no frontend code checks these permissions before rendering
- All permission enforcement delegated to backend API

---

## 3. AUTHORIZATION IMPLEMENTATION COMPARISON

### Old Project - Multi-Layer Security

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Controller Decorators                 │
│ [Authorize(Roles = "Supervisor")]              │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ Layer 2: Service-Level Checks                  │
│ if (!response.IsAuthorized) { redirect }       │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ Layer 3: PermissionService                     │
│ PermitAccess("feature-key", isSupervisor, userId)│
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ Layer 4: View-Level Helpers                    │
│ @if (Html.IsMenuVisible("Controller"))         │
└─────────────────────────────────────────────────┘
```

**Result:** 4 layers of defense-in-depth security

---

### New Project - Single Layer (Backend Only)

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Route Auth Guard (Token Only)         │
│ if (!hasToken) { redirect to login }           │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ ❌ NO ROLE/PERMISSION CHECKS                    │
│ Component renders unconditionally               │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│ Backend API Enforcement (Assumed)               │
│ API returns 403 Forbidden if not authorized    │
└─────────────────────────────────────────────────┘
```

**Result:** Frontend fully trusts backend, no client-side authorization

---

## 4. WORKTIMEUSAGE SPECIFIC COMPARISON

### Old Project - Clock Access Control

**File:** `/Controllers/ClockController.cs`

```csharp
[Authorize] // Layer 1: Must be authenticated
public class ClockController : BaseController
{
    // Section view - Supervisor only
    public ActionResult Section(string id)
    {
        var response = clockService.GetSection(request, userId);

        // Layer 2: Service checks authorization
        if (!response.IsAuthorized)
            return RedirectToAction("Index", "Profile");

        // Layer 3: Must be supervisor to view team data
        if (!response.IsSupervisor)
            return RedirectToAction("Employee");

        return View(response.Model);
    }

    // Employee view - All authenticated users
    public ActionResult Employee()
    {
        var response = clockService.GetEmployee(request, userId);

        // Layer 2: Still checks authorization
        if (!response.IsAuthorized)
            return HttpUnauthorized();

        return View(response.Model);
    }

    // Download reports - Supervisor only + Team hierarchy check
    public ActionResult DownloadGridExcel(ClockSectionRequest request)
    {
        bool isSupervisor = User.IsInRole("Supervisor");

        if (isSupervisor && !string.IsNullOrEmpty(request.TeamId))
        {
            // Layer 4: Team hierarchy validation
            bool isTeamDescendant = IsTeamDescendant(request.TeamId, userId);
            if (!isTeamDescendant)
                return HttpUnauthorized(); // Can only download subordinate team data
        }

        return File(excelBytes, "application/vnd.ms-excel", "report.xlsx");
    }
}
```

**Access Rules:**
1. **All users:** Can view their own employee clock data
2. **Supervisors:** Can view team/section clock data for subordinate teams only
3. **Non-supervisors:** Redirected to employee view if they try to access section view
4. **Unauthorized teams:** Supervisors can't download reports for teams outside their hierarchy

---

### New Project - WorktimeUsage (No Protection)

**File:** `/src/views/worktimeUsage/index.vue`

```typescript
// ❌ NO ROLE CHECKS
// ❌ NO PERMISSION CHECKS
// ❌ NO TEAM HIERARCHY VALIDATION

const fetchData = async () => {
  try {
    if (currentQuery.value.view === 'individual' && currentQuery.value.memberId) {
      // Fetches employee data - NO permission check
      await store.fetchEmployeeData({
        Perspective: String(currentQuery.value.perspective),
        Interval: currentQuery.value.interval,
        MemberId: currentQuery.value.memberId ?? '',
      });
    } else {
      // Fetches section data - NO supervisor check
      await store.fetchSectionData({
        Perspective: String(currentQuery.value.perspective),
        Interval: currentQuery.value.interval,
        TeamId: currentQuery.value.teamId ?? undefined,
      });
    }
  } catch (error) {
    // Assumes backend API will reject unauthorized requests
    toast.error(error.message);
  }
};
```

**Access Rules:**
1. **Anyone authenticated:** Can access WorktimeUsage route
2. **No frontend checks:** All views/tabs visible to everyone
3. **Backend responsibility:** Must return 403 or empty data if not authorized
4. **No team validation:** Frontend doesn't verify team hierarchy

---

## 5. DETAILED GAP ANALYSIS

### MISSING #1: Authorization Composable

**What Old Project Has:**
```csharp
// HTML Helper for view-level checks
public static bool IsMenuVisible(this HtmlHelper html, string controller, string action)
{
    bool isSupervisor = html.User.IsInRole("Supervisor");
    bool isHR = html.User.IsInRole("HR");
    // ... menu visibility logic
}

public static bool HasClockAccess(this HtmlHelper html)
{
    bool isAdmin = html.User.IsInRole("Admin");
    if (isAdmin) return false; // Admins don't have clock access

    var userId = html.User.Identity.GetUserId();
    var memberList = DataService.GetMembersByUser(userId);
    return memberList.Count > 0;
}
```

**What New Project Needs:**
```typescript
// ❌ MISSING: src/composables/useAuthorization.ts

export function useAuthorization() {
  const usersStore = useCommonUsersStore();

  const hasRole = (role: string): boolean => {
    return usersStore.user?.Wizard.Roles?.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return usersStore.user?.Wizard.Permissions?.includes(permission) || false;
  };

  const isManager = computed(() => usersStore.user?.Wizard.IsManager || false);
  const isHR = computed(() => usersStore.user?.Wizard.IsHR || false);
  const isEmployee = computed(() => usersStore.user?.Wizard.IsEmployee || false);

  const canAccessWorktime = computed(() => {
    // Equivalent to HasClockAccess
    return !hasRole('Admin') && (isManager.value || isEmployee.value);
  });

  return {
    hasRole,
    hasPermission,
    isManager,
    isHR,
    isEmployee,
    canAccessWorktime,
  };
}
```

---

### MISSING #2: Route Meta Guards

**What Old Project Has:**
```csharp
[Authorize(Roles = "Supervisor")]
public class CompanyController : BaseController { }

[Authorize(Roles = "Supervisor,HR")]
public class DefinitionController : BaseController { }
```

**What New Project Needs:**
```typescript
// ❌ MISSING: Enhanced route meta in src/router/routes.ts

{
  path: '/worktimeUsage',
  name: 'WorktimeUsage',
  component: WorktimeUsage,
  meta: {
    requiresAuth: true,
    requiresRole: ['Manager', 'Employee'], // ❌ MISSING
    // OR
    requiresPermission: 'VIEW_WORKTIME',   // ❌ MISSING
    title: 'WorktimeUsage',
  },
}

// ❌ MISSING: Router guard implementation in src/router/index.ts

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const requiresRole = to.meta.requiresRole;
  const requiresPermission = to.meta.requiresPermission;

  if (requiresAuth && !hasToken) {
    return next({ name: 'Login' });
  }

  // NEW: Role-based routing
  if (requiresRole) {
    const { hasRole } = useAuthorization();
    const hasRequiredRole = Array.isArray(requiresRole)
      ? requiresRole.some(role => hasRole(role))
      : hasRole(requiresRole);

    if (!hasRequiredRole) {
      return next({ name: 'Unauthorized' }); // Needs Unauthorized page
    }
  }

  // NEW: Permission-based routing
  if (requiresPermission) {
    const { hasPermission } = useAuthorization();
    if (!hasPermission(requiresPermission)) {
      return next({ name: 'Unauthorized' });
    }
  }

  next();
});
```

---

### MISSING #3: Component-Level Authorization

**What Old Project Has:**
```html
<!-- Menu items conditionally rendered -->
@if (Html.IsMenuVisible("Company"))
{
    <li><a href="/Company">Organization</a></li>
}

@if (Html.IsMenuVisible("Definition", "Employees"))
{
    <li><a href="/Definition/Employees">Employees</a></li>
}

<!-- Well-being feature toggle -->
@if (Html.IsWellBeingEnabled())
{
    <div class="wellbeing-section">
        <!-- Well-being UI -->
    </div>
}
```

**What New Project Needs:**
```vue
<!-- ❌ MISSING: Conditional rendering in WorktimeUsage components -->

<template>
  <!-- Navigation tabs -->
  <div class="tabs">
    <!-- Productivity tab - Supervisor/Manager only -->
    <button
      v-if="isManager"
      @click="changeTab('productivity')"
    >
      Productivity
    </button>

    <!-- Well-being tab - Only if permission enabled -->
    <button
      v-if="hasPermission('VIEW_WELLBEING')"
      @click="changeTab('wellbeing')"
    >
      Well-being
    </button>
  </div>

  <!-- Download button - Supervisor only -->
  <Button
    v-if="isManager"
    @click="handleDownload"
    icon="pi pi-download"
  />
</template>

<script setup lang="ts">
import { useAuthorization } from '@/composables/useAuthorization';

const { isManager, hasPermission } = useAuthorization();
</script>
```

---

### MISSING #4: Permission Constants/Enums

**What Old Project Has:**
```csharp
// Permission keys used consistently
const string EMPLOYEE_PERMISSION = "calisanlar";
const string WELLBEING_PERMISSION = "calisan-refahi";

// In service:
var permission = DataService.GetPermission(EMPLOYEE_PERMISSION, companyId);
```

**What New Project Needs:**
```typescript
// ❌ MISSING: src/enums/permissions.enum.ts

export enum EPermissions {
  // WorktimeUsage permissions
  VIEW_WORKTIME_USAGE = 'VIEW_WORKTIME_USAGE',
  VIEW_TEAM_WORKTIME = 'VIEW_TEAM_WORKTIME',
  DOWNLOAD_WORKTIME_REPORTS = 'DOWNLOAD_WORKTIME_REPORTS',

  // Employee permissions
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',

  // HR permissions
  MANAGE_ANNUAL_LEAVE = 'MANAGE_ANNUAL_LEAVE',
  VIEW_WELLBEING = 'VIEW_WELLBEING',

  // Admin permissions
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  MANAGE_COMPANY = 'MANAGE_COMPANY',
}

// ❌ MISSING: src/enums/roles.enum.ts

export enum ERoles {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SUPERVISOR = 'Supervisor',
  HR = 'HR',
  EMPLOYEE = 'Employee',
}
```

---

## 6. IMPLEMENTATION PRIORITY

### 🔴 CRITICAL (Immediate - Security Risk)

1. **Create `useAuthorization()` Composable**
   - File: `src/composables/useAuthorization.ts`
   - Provides: `hasRole()`, `hasPermission()`, `isManager`, `isHR`, `isEmployee`
   - Why: Currently no way to check user authorization in components

2. **Add Role Guards to Router**
   - File: `src/router/index.ts`
   - Add: `requiresRole` and `requiresPermission` meta checks
   - Why: Anyone authenticated can access all routes (including WorktimeUsage)

3. **Protect WorktimeUsage Route**
   - File: `src/router/routes.ts`
   - Add: `requiresRole: ['Manager', 'Employee']` to WorktimeUsage route
   - Why: Non-employees/managers shouldn't access WorktimeUsage

### 🟡 HIGH (Next Sprint - Feature Completeness)

4. **Add Component-Level Permission Checks**
   - Files: All components in `src/views/worktimeUsage/_components/`
   - Add: `v-if="isManager"` for supervisor-only features
   - Add: `v-if="hasPermission('...')"` for feature-toggled UI
   - Why: UI should hide features user can't access

5. **Create Permission & Role Enums**
   - Files: `src/enums/permissions.enum.ts`, `src/enums/roles.enum.ts`
   - Why: Type safety and consistency for permission/role strings

6. **Add 403 Unauthorized Page**
   - File: `src/views/Unauthorized.vue`
   - Why: Users need feedback when they access forbidden routes

### 🟢 MEDIUM (Future - Polish)

7. **Pre-Request Permission Validation**
   - File: `src/customClient/` or interceptors
   - Add: Permission check before API calls
   - Why: Defense-in-depth, better UX (fail fast)

8. **Permission-Based Menu Filtering**
   - Files: Navigation components
   - Add: Hide menu items based on roles/permissions
   - Why: Cleaner UI for users

9. **Team Hierarchy Validation**
   - File: WorktimeUsage composables
   - Add: Validate supervisor can only access subordinate teams
   - Why: Match old project's team access control

---

## 7. BACKEND API ASSUMPTIONS

The new frontend assumes the **backend API enforces all authorization**:

### API Endpoints (Assumed Protected):
- `POST /webapi/clock/section` - Returns 403 if user not authorized for team
- `POST /webapi/clock/employee` - Returns 403 if user not authorized for employee
- `GET /webapi/profile/verifyToken` - Returns user with roles/permissions
- `GET /webapi/setting/permissions` - Returns company permissions

### Risk Without Frontend Authorization:
1. **Poor UX:** User sees features, clicks them, gets 403 error
2. **Security by obscurity:** Relying only on backend = single point of failure
3. **Data leakage:** Frontend might fetch and cache unauthorized data before API rejects

---

## 8. RECOMMENDED IMPLEMENTATION STEPS

### Step 1: Create Authorization Infrastructure (Week 1)

```bash
# Create files
touch src/composables/useAuthorization.ts
touch src/enums/permissions.enum.ts
touch src/enums/roles.enum.ts
touch src/views/Unauthorized.vue
```

**Implementation:**
1. Define `ERoles` and `EPermissions` enums
2. Create `useAuthorization()` composable with role/permission helpers
3. Create Unauthorized.vue page
4. Update TypeScript types for route meta

### Step 2: Add Router Guards (Week 1)

**File:** `src/router/index.ts`

```typescript
// Add to beforeEach guard
if (to.meta.requiresRole) {
  const { hasRole } = useAuthorization();
  const hasRequiredRole = Array.isArray(to.meta.requiresRole)
    ? to.meta.requiresRole.some(role => hasRole(role))
    : hasRole(to.meta.requiresRole);

  if (!hasRequiredRole) {
    return next({ name: ERouteNames.Unauthorized });
  }
}
```

### Step 3: Protect WorktimeUsage (Week 1)

**File:** `src/router/routes.ts`

```typescript
{
  path: '/worktimeUsage',
  name: 'WorktimeUsage',
  component: WorktimeUsage,
  meta: {
    requiresAuth: true,
    requiresRole: [ERoles.MANAGER, ERoles.EMPLOYEE], // NEW
    title: 'WorktimeUsage',
  },
}
```

### Step 4: Component-Level Authorization (Week 2)

**Files:** WorktimeUsage components

```vue
<script setup lang="ts">
import { useAuthorization } from '@/composables/useAuthorization';
const { isManager, hasPermission } = useAuthorization();
</script>

<template>
  <!-- Supervisor-only features -->
  <div v-if="isManager">
    <!-- Team views, Download button, etc. -->
  </div>

  <!-- Permission-based features -->
  <div v-if="hasPermission(EPermissions.VIEW_WELLBEING)">
    <!-- Well-being tab -->
  </div>
</template>
```

### Step 5: Testing (Week 2)

1. Test with Admin user (should NOT access WorktimeUsage)
2. Test with Manager user (should access team views)
3. Test with Employee user (should access individual view only)
4. Test with HR user (permissions vary)

---

## 9. EXAMPLE CODE IMPLEMENTATIONS

### Example 1: useAuthorization Composable

**File:** `src/composables/useAuthorization.ts`

```typescript
import { computed } from 'vue';
import { useCommonUsersStore } from '@/stores/common/users';
import { ERoles } from '@/enums/roles.enum';
import type { EPermissions } from '@/enums/permissions.enum';

export function useAuthorization() {
  const usersStore = useCommonUsersStore();

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: ERoles | string): boolean => {
    const roles = usersStore.user?.Wizard?.Roles || [];
    return roles.includes(role);
  };

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: EPermissions | string): boolean => {
    const permissions = usersStore.user?.Wizard?.Permissions || [];
    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: Array<ERoles | string>): boolean => {
    return roles.some(role => hasRole(role));
  };

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = (roles: Array<ERoles | string>): boolean => {
    return roles.every(role => hasRole(role));
  };

  // Computed role checks
  const isAdmin = computed(() => hasRole(ERoles.ADMIN));
  const isManager = computed(() => usersStore.user?.Wizard?.IsManager || false);
  const isHR = computed(() => usersStore.user?.Wizard?.IsHR || false);
  const isEmployee = computed(() => usersStore.user?.Wizard?.IsEmployee || false);

  /**
   * Check if user can access worktime usage
   * Admins don't have clock access (business rule from old project)
   */
  const canAccessWorktime = computed(() => {
    return !isAdmin.value && (isManager.value || isEmployee.value);
  });

  return {
    // Methods
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,

    // Computed properties
    isAdmin,
    isManager,
    isHR,
    isEmployee,
    canAccessWorktime,
  };
}
```

---

### Example 2: Permission & Role Enums

**File:** `src/enums/roles.enum.ts`

```typescript
export enum ERoles {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SUPERVISOR = 'Supervisor',
  HR = 'HR',
  EMPLOYEE = 'Employee',
}
```

**File:** `src/enums/permissions.enum.ts`

```typescript
export enum EPermissions {
  // WorktimeUsage
  VIEW_WORKTIME_USAGE = 'VIEW_WORKTIME_USAGE',
  VIEW_TEAM_WORKTIME = 'VIEW_TEAM_WORKTIME',
  DOWNLOAD_WORKTIME_REPORTS = 'DOWNLOAD_WORKTIME_REPORTS',

  // Employees
  VIEW_EMPLOYEES = 'VIEW_EMPLOYEES',
  MANAGE_EMPLOYEES = 'MANAGE_EMPLOYEES',

  // Well-being (matches old "calisan-refahi")
  VIEW_WELLBEING = 'VIEW_WELLBEING',

  // HR
  MANAGE_ANNUAL_LEAVE = 'MANAGE_ANNUAL_LEAVE',
  VIEW_SALARY = 'VIEW_SALARY',

  // Admin
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  MANAGE_COMPANY = 'MANAGE_COMPANY',
  MANAGE_LICENSE = 'MANAGE_LICENSE',
}
```

---

### Example 3: Enhanced Route Meta

**File:** `src/router/routes.ts` (Updated types)

```typescript
import type { ERoles } from '@/enums/roles.enum';
import type { EPermissions } from '@/enums/permissions.enum';

// Extend RouteMeta interface
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresRole?: ERoles | ERoles[] | string | string[];
    requiresPermission?: EPermissions | EPermissions[] | string | string[];
    title?: string;
  }
}

// Updated route definition
export default [
  {
    path: '/worktimeUsage',
    name: ERouteNames.WorktimeUsage,
    component: () => import('@/views/worktimeUsage/index.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: [ERoles.MANAGER, ERoles.EMPLOYEE],
      title: 'Worktime Usage',
    },
  },
  {
    path: '/settings',
    name: ERouteNames.Settings,
    component: () => import('@/views/settings/index.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: ERoles.ADMIN,
      title: 'Settings',
    },
  },
] as RouteRecordRaw[];
```

---

### Example 4: Enhanced Router Guard

**File:** `src/router/index.ts` (Add to beforeEach)

```typescript
router.beforeEach(async (to, from, next) => {
  const usersStore = useCommonUsersStore();
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth === true;
  const requiresUnAuth = to.meta.requiresAuth === false;
  const requiresRole = to.meta.requiresRole;
  const requiresPermission = to.meta.requiresPermission;

  const token = localStorage.getItem(EStorageKeys.TOKEN);
  const hasToken = !!token;

  const { logout } = useLogout();

  // Set token for OpenAPI
  if (hasToken && !OpenAPI.TOKEN) {
    OpenAPI.TOKEN = token;
  }

  if (requiresAuth) {
    if (!hasToken) {
      return next({ name: ERouteNames.Login });
    }

    // Skip token refresh if coming from login page
    const comingFromLogin = from.name === ERouteNames.Login;

    if (!usersStore.isAuthenticated && !isRefreshing && !comingFromLogin) {
      isRefreshing = true;

      try {
        await authStore.refreshToken();
        isRefreshing = false;
      } catch (err) {
        console.error('Token refresh failed:', err);
        isRefreshing = false;
        return logout();
      }
    }

    // NEW: Role-based authorization
    if (requiresRole) {
      const { hasRole, hasAnyRole } = useAuthorization();

      const hasRequiredRole = Array.isArray(requiresRole)
        ? hasAnyRole(requiresRole as ERoles[])
        : hasRole(requiresRole as ERoles);

      if (!hasRequiredRole) {
        console.warn(`User lacks required role: ${requiresRole}`);
        return next({ name: ERouteNames.Unauthorized });
      }
    }

    // NEW: Permission-based authorization
    if (requiresPermission) {
      const { hasPermission } = useAuthorization();

      const hasRequiredPermission = Array.isArray(requiresPermission)
        ? requiresPermission.some(perm => hasPermission(perm as EPermissions))
        : hasPermission(requiresPermission as EPermissions);

      if (!hasRequiredPermission) {
        console.warn(`User lacks required permission: ${requiresPermission}`);
        return next({ name: ERouteNames.Unauthorized });
      }
    }

    return next();
  }

  if (requiresUnAuth && hasToken) {
    return next(false);
  }

  return next();
});
```

---

### Example 5: Unauthorized Page

**File:** `src/views/Unauthorized.vue`

```vue
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center p-8">
      <i class="pi pi-ban text-6xl text-red-500 mb-4"></i>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        {{ $t('common.unauthorized.title') }}
      </h1>
      <p class="text-gray-600 mb-6">
        {{ $t('common.unauthorized.message') }}
      </p>
      <Button
        :label="$t('common.goBack')"
        icon="pi pi-arrow-left"
        @click="goBack"
        class="mr-2"
      />
      <Button
        :label="$t('common.goHome')"
        icon="pi pi-home"
        @click="goHome"
        severity="secondary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push({ name: ERouteNames.WorktimeUsage });
};
</script>
```

---

## 10. SUMMARY CHECKLIST

### ✅ What Exists in New Project:
- [x] JWT Token authentication
- [x] User profile with roles/permissions data
- [x] Basic route authentication guard (token check)
- [x] Permission management UI for admins
- [x] User store with role indicators

### ❌ What's Missing in New Project:
- [ ] `useAuthorization()` composable
- [ ] Role-based route guards
- [ ] Permission-based route guards
- [ ] Component-level role/permission checks
- [ ] Permission/Role enums and constants
- [ ] Unauthorized page
- [ ] WorktimeUsage access control
- [ ] Conditional UI rendering based on roles
- [ ] Pre-request permission validation
- [ ] Team hierarchy validation

### 🎯 Impact Analysis:

| Missing Feature | Security Risk | UX Impact | Priority |
|----------------|---------------|-----------|----------|
| Role-based route guards | 🔴 HIGH | 🔴 HIGH | CRITICAL |
| useAuthorization composable | 🔴 HIGH | 🟡 MEDIUM | CRITICAL |
| WorktimeUsage protection | 🔴 HIGH | 🔴 HIGH | CRITICAL |
| Component permission checks | 🟡 MEDIUM | 🔴 HIGH | HIGH |
| Permission enums | 🟢 LOW | 🟢 LOW | HIGH |
| Unauthorized page | 🟢 LOW | 🔴 HIGH | HIGH |
| Pre-request validation | 🟢 LOW | 🟡 MEDIUM | MEDIUM |
| Team hierarchy validation | 🟡 MEDIUM | 🟡 MEDIUM | MEDIUM |

---

## Conclusion

The **new Flexytime-Fe project needs a complete frontend authorization layer** to match the old project's security and user experience. While the authentication foundation is solid, the **lack of role/permission enforcement at the frontend creates both security and UX risks**.

**Recommended Action Plan:**
1. Week 1: Implement critical infrastructure (`useAuthorization`, router guards, protect WorktimeUsage)
2. Week 2: Add component-level authorization and polish UX
3. Week 3+: Add advanced features (team hierarchy, pre-request validation)

**Estimated Effort:** ~2-3 weeks for full parity with old project's authorization system.

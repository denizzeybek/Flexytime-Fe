# Routing & Auth

Vue Router 4 + Pinia auth store. OpenAPI client holds the token (`OpenAPI.TOKEN`) — no custom axios interceptor.

---

## 1. File layout

```
src/router/
  index.ts            ← createRouter + global guards
  routes.ts           ← route tree
  routeNames.enum.ts  ← ERouteNames (single source of truth for route names)
```

- `ERouteNames` enum values are **display labels** (e.g. `"Worktime Usage"`). They're used both as the route `name` and as the page title shown in the layout.
- Every `<RouterLink :to="{ name: ... }" />` must reference an `ERouteNames` member — never a raw string.

---

## 2. Adding a route — the repo pattern

### Current convention: eager imports

All route components are imported at the top of `src/router/routes.ts` and passed directly to `component`:

```ts
import Login from '@/views/auth/Login.vue'
import Timesheets from '@/views/timesheets/_views/TimeSheets.vue'
import UnclassifiedTimeEntries from '@/views/timesheets/_views/UnclassifiedTimeEntries.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/timesheets',
        name: ERouteNames.Timesheets,
        component: Timesheets,
        meta: {
          title: ERouteNames.Timesheets,
          name: ERouteNames.Timesheets,
        },
        children: [
          {
            path: 'unclassified',
            name: ERouteNames.TimeEntriesUnclassified,
            component: UnclassifiedTimeEntries,
            meta: {
              title: ERouteNames.TimeEntriesUnclassified,
              name: ERouteNames.TimeEntriesUnclassified,
            },
          },
        ],
      },
    ],
  },
]
```

**Do not switch to dynamic `import()` lazy-loading for existing routes.** The bundle already has manual chunks configured in `vite.config.ts`; changing the import style without a perf plan breaks that. If you want to lazy-load a new heavy route, bring it up with the team first and update this rule.

### Adding a route: checklist

- [ ] Add the enum member in `routeNames.enum.ts` (display-label string).
- [ ] Import the view at the top of `routes.ts`.
- [ ] Place the route under the right parent (`DefaultLayout` for authenticated, auth-only layout for guest).
- [ ] Set `meta.requiresAuth` (inherited from `DefaultLayout` by default).
- [ ] Set `meta.name` + `meta.title` to the `ERouteNames` member.
- [ ] If role-gated, configure it via `useAuthorization()` in the component, **not** via a `meta.roles` check inside the route config (the router guard doesn't read `meta.roles`; the component does).

---

## 3. Route meta fields used by the repo

| Key | Purpose |
|---|---|
| `requiresAuth` | Guard redirects unauthenticated users to Login |
| `name` | Used by the layout to render breadcrumbs / page headers |
| `title` | Mirror of `name`; keep both equal |

Don't invent new `meta` keys without updating the guard / layout that reads them.

---

## 4. Auth flow

`src/stores/auth.ts` owns auth. The guard in `src/router/index.ts` orchestrates refresh + profile hydration.

### Login

```ts
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()

await authStore.login({ username, password, grant_type: EGrantType.PASSWORD })
await profileStore.filter()

router.push({ name: profileStore.isAdmin ? ERouteNames.SettingsCompanies : ERouteNames.WorktimeUsage })
```

### Token storage

- `localStorage[EStorageKeys.TOKEN]` — JWT.
- `OpenAPI.TOKEN` — set on login and refresh so every generated service request is authenticated.
- Never read or write the token string directly from a component. Use the auth store.

### Refresh

`authStore.refreshToken()` calls `ProfileApiService.profileApiVerifyToken()`, updates `OpenAPI.TOKEN` and storage, and is driven by the router guard. Don't reimplement this flow.

### Logout

Use the `useLogout()` composable — it calls `$reset` on the stores and clears storage. Don't manually wipe localStorage.

---

## 5. Authorization — roles & permissions

Gate UI via `useAuthorization()`:

```ts
import { useAuthorization } from '@/composables/useAuthorization'
import { EPermission } from '@/enums/permission.enum'
import { ERole } from '@/enums/role.enum'

const { hasRole, hasAnyRole, hasAllRoles, hasPermission } = useAuthorization()
```

```vue
<Button
  v-if="hasPermission(EPermission.WORKTIME_USAGE_VIEW)"
  :label="$t('worktimeUsage.viewButton')"
/>
```

### Rules

- Roles come from `ERole`, permissions from `EPermission` — never raw strings in components.
- Sibling views use role/permission checks **inside the component**, not in route `meta`. Follow that.
- The guard's `findFirstAccessibleRoute()` handles smart redirects when a user can't access a requested route. Add new routes to its priority list if they should be a possible landing page.

---

## 6. Programmatic navigation

```ts
import { useRouter } from 'vue-router'

import { ERouteNames } from '@/router/routeNames.enum'

const router = useRouter()
router.push({ name: ERouteNames.Login })
router.replace({ name: ERouteNames.WorktimeUsage })
```

- `name`-based routing only. `path`-based `router.push('/foo')` is forbidden — it breaks when paths are edited.
- Use `router.replace` for redirects that shouldn't pollute history (OAuth callbacks, forced logouts).

---

## 7. Forbidden

- 🚫 Route `component: () => import(...)` in new code without a discussion (see § 2).
- 🚫 `<RouterLink :to="'/foo'">` or `router.push('/foo')`. Always `{ name: ERouteNames.X }`.
- 🚫 Raw string route names anywhere in the codebase.
- 🚫 Reading / writing the token outside `stores/auth.ts` or `useLogout()`.
- 🚫 Creating custom axios interceptors for auth — the generated client handles it.
- 🚫 Bypassing a guard with manual `router.push` hacks. Fix the guard or `meta` instead.
- 🚫 Role-string checks in templates (`user.role === 'admin'`). Use `hasRole(ERole.ADMIN)`.

---

## 8. Checklist before committing route/auth changes

- [ ] New route added to `routeNames.enum.ts`, `routes.ts`, and (if applicable) `findFirstAccessibleRoute`.
- [ ] `ERouteNames` used everywhere — no raw strings.
- [ ] `meta.requiresAuth` set correctly (or inherited from parent layout).
- [ ] Role/permission gating via `useAuthorization()`.
- [ ] Token flow untouched unless it was the explicit goal.
- [ ] Manually verified login → protected route → logout round-trip.

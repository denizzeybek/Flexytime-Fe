# State, Services & Types

How data flows in this repo. **Important:** services are not hand-written — they are OpenAPI-generated in `@/client`.

---

## 1. Data-flow layers

```
component ──► composable / Pinia store ──► @/client or @/customClient ──► backend
```

- Components never call the API directly.
- Stores/composables call `@/client/services/*ApiService`.
- The OpenAPI client owns its own auth header via `OpenAPI.TOKEN`. There is **no axios interceptor** for auth — don't add one.

---

## 2. The generated API client — `@/client`

Everything under `src/client/` is **generated** (see the `openapi-typescript-codegen` banner). Never edit files there by hand.

### Services

Import the service you need directly — each backend group has one:

```ts
import {
  AccountApiService,
  ClockApiService,
  ProfileApiService,
  TimesheetApiService,
  WizardApiService,
} from '@/client'
```

Usage (from `stores/worktimeUsage/section.ts`):

```ts
import { ClockApiService } from '@/client'

const fetchSection = async (payload: ClockSectionRequest) => {
  const response = await ClockApiService.clockApiGetSection(payload)
  // response is fully typed
}
```

### Types — also from `@/client`

All request/response DTOs are there — import as `type`:

```ts
import type {
  ClockSectionRequest,
  ClockSection2Response,
  TimeEntryModifyViewModel,
  WebClockModifyModel,
} from '@/client'
```

### OpenAPI config

- Base URL is set in `main.ts`: `OpenAPI.BASE = import.meta.env.VITE_API_URL`.
- Token is set in the auth store on login and reset on logout: `OpenAPI.TOKEN = token`.
- Don't mutate `OpenAPI` from components or random services. Auth-related mutation belongs in `src/stores/auth.ts`.

---

## 3. Custom endpoints — `@/customClient`

`src/customClient/` is a sibling folder for endpoints that don't fit the generated schema (today: `LoginService`). Keep additions rare and follow the same shape:

- A new file in `customClient/services/`.
- Typed request/response models in `customClient/models/`.
- Export from `customClient/index.ts`.

Before adding here, check if the backend provides an OpenAPI-backed alternative.

---

## 4. `src/services/` is intentionally empty

You'll see `src/services/` referenced in older docs. It's empty by design now — everything moved to `@/client` / `@/customClient`. **Don't create new files there.** If you catch yourself writing `src/services/foo.service.ts`, stop — the API call belongs in a store, consuming a generated service.

---

## 5. Pinia stores

### Where they live

- `src/stores/<domain>/<storeName>.ts`
- Shared/global stores directly in `src/stores/` (`auth.ts`, `users.ts`).
- Store IDs come from `src/stores/storeNames.enum.ts` — enum name `EStoreNames`:

  ```ts
  export enum EStoreNames {
    AUTH = 'auth',
    WORKTIME_USAGE = 'worktimeUsage',
    WORKTIME_USAGE_SECTION = 'section',
    TIMESHEETS_TIME_ENTIES = 'timeEntries',
    // …
  }
  ```

  When you add a new store, add an entry here. Never inline a string id.

### Two valid defineStore shapes — match the neighbors

#### Shape A — setup store (preferred for new code)

Used by `stores/auth.ts`:

```ts
import { computed } from 'vue'
import { defineStore } from 'pinia'

import { EStoreNames } from '@/stores/storeNames.enum'

export const useAuthStore = defineStore(EStoreNames.AUTH, () => {
  const usersStore = useUsersStore()
  const isAuth = computed(() => !!usersStore.user)

  const login = async (payload: LoginRequest) => {
    const response = await LoginService.login(payload)
    if (response.access_token) {
      localStorage.setItem(EStorageKeys.TOKEN, response.access_token)
      OpenAPI.TOKEN = response.access_token
    }
    return response
  }

  return { isAuth, login }
})
```

#### Shape B — options store (when you need typed `state`)

Used by `stores/worktimeUsage/section.ts`:

```ts
interface State {
  Card: CardViewModel
  Individuals?: ClockSectionIndividual[]
  isLoading: boolean
}

export const useSectionsStore = defineStore(EStoreNames.WORKTIME_USAGE_SECTION, {
  state: (): State => ({
    Card: {} as CardViewModel,
    Individuals: [],
    isLoading: false,
  }),
  actions: {
    async fetchSection(payload: ClockSectionRequest) {
      this.isLoading = true
      try {
        const response = await ClockApiService.clockApiGetSection(payload)
        this.Card = response.Card
        // …
      } finally {
        this.isLoading = false
      }
    },
  },
})
```

### Rules for stores

- Mutations and API calls happen **inside the store**, not in components. Components call actions.
- Derived data → `computed` / getters. Don't recompute in components.
- Never import a component into a store. Data flows outward only.
- Cross-store composition is fine (see `authStore` → `usersStore`) but watch for circular imports.
- Cache carefully — the worktime stores intentionally cache responses. Don't refetch on every mount if the store already has fresh data.

---

## 6. Types

### Layer rules

| Where | What |
|---|---|
| `@/client` (generated) | API request/response models (e.g. `TimeEntryModifyViewModel`) |
| `src/types/` | App-wide shared types |
| `src/views/<feature>/_types/` or `./_etc/` | Feature-local UI/domain types |
| Same SFC | Types used by only that component |

### Naming

- Prefer `I`-prefixed interfaces for component API (`IProps`, `IEmits`) and domain models (`IEmployee`, `ITreeNode`).
- Existing mixed patterns (`TimeEntryPayload`, `FormTimeClock`) are tolerated when extending a generated type — don't rename retroactively.
- Interfaces for object shapes; `type` for unions / mapped / conditional types.

### Do

- ✅ `import type { X } from '@/client'` for API types.
- ✅ Extend generated models when the backend lacks a field — leave a `TODO: Update OpenAPI spec` comment so it's not forgotten (see `EnterTime.vue` / `TimeEntryPayload`).

### Don't

- ❌ Redefine a type that's already in `@/client`.
- ❌ Sprinkle one-off types across stores. Promote to `src/types/` if used in ≥ 2 files.

---

## 7. Storage & side-channels

- Local storage keys live in `src/constants/storageKeys.ts` — enum `EStorageKeys`:

  ```ts
  export enum EStorageKeys {
    TOKEN = 'token',
    USER = 'user',
    AUTHENTICATION = 'authentication',
    REFRESH_TOKEN = 'refresh_token',
    LANGUAGE = 'language',
    THEME = 'theme',
  }
  ```
- Read/write via the enum: `localStorage.setItem(EStorageKeys.TOKEN, token)`.
- Never hand-type `localStorage.getItem('token')`.
- Token access outside the auth store is a smell — add a getter or action instead.

---

## 8. Error handling

- API error shape comes from the generated `ApiError`. Toast errors with `useFToast`:

  ```ts
  const { showErrorMessage } = useFToast()

  try {
    await store.save(payload)
  } catch (error) {
    showErrorMessage(error as Error) // useFToast extracts `body.message` or `message`
  }
  ```
- Don't swallow errors silently. Either handle (retry, fallback) or surface to the user.
- Loading and error state belongs in the store when the data is store-backed (see `IErrorState`, `ILoadingState` in `worktimeStore`).

---

## 9. Forbidden

- 🚫 `axios.get/post/...` from a component, composable, or store. OpenAPI services cover the common path; `customClient` covers the rest.
- 🚫 Editing any file under `src/client/*` — it's regenerated.
- 🚫 Adding a new file under `src/services/` — that folder is deprecated.
- 🚫 Inlining a Pinia store id string (`defineStore('myStore', …)`). Use `EStoreNames`.
- 🚫 `localStorage.getItem('token')` / hardcoded storage key strings.
- 🚫 Component mutating store state: `store.items.push(x)`. Go through an action.
- 🚫 Direct mutation of `OpenAPI.TOKEN` outside `stores/auth.ts`.

---

## 10. Checklist before committing a store/service change

- [ ] All API calls go through `@/client` or `@/customClient`.
- [ ] Store id is an `EStoreNames` enum member.
- [ ] Action names are imperative verbs (`fetchSection`, `saveEntry`, `$reset`).
- [ ] Loading and error state exposed when the UI needs it.
- [ ] Types imported (`import type`) when used only for typing.
- [ ] No `axios` import in the diff (grep to confirm).

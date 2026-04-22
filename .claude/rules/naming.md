# Naming Conventions

The repo already has a convention for every kind of symbol. Match it — don't invent a new style.

---

## 1. Quick reference

| Kind | Convention | Example |
|---|---|---|
| Vue SFC file | `PascalCase.vue` | `TimerControls.vue`, `EmployeeProductivityTable.vue`, `UnclassifiedTimeEntries.vue` |
| Feature root folder | `camelCase` | `worktimeUsage`, `hrSettings`, `timeSheets`, `classification` |
| Underscore-prefixed sub-folders | `_camelCase` | `_views`, `_components`, `_composables`, `_modals`, `_etc`, `_types` |
| Composable file | `useXxx.ts` — file name matches function name exactly | `useAuthorization.ts` → `useAuthorization()` |
| Pinia store file | `<storeName>.ts` inside `src/stores/<domain>/` | `stores/auth.ts`, `stores/worktimeUsage/section.ts` |
| Store function | `useXxxStore` | `useAuthStore`, `useSectionsStore`, `useTimesheetsTimeEntriesStore` |
| Store id | `EStoreNames` enum member | `EStoreNames.WORKTIME_USAGE_SECTION` |
| Generated API service | From `@/client` as-is | `ClockApiService`, `ProfileApiService` |
| Interface | `I`-prefixed PascalCase | `IProps`, `IEmits`, `IEmployee`, `ITreeNode` |
| Type alias | PascalCase (sometimes `T`-prefixed if disambiguation helps) | `Layout`, `MessageSchema` |
| Enum | `E`-prefixed PascalCase, `UPPER_SNAKE_CASE` members | `ERouteNames`, `ERole`, `EPermission`, `EStorageKeys`, `ELayout` |
| Constant | `UPPER_SNAKE_CASE` | `DATE_FORMATS`, `STORAGE_KEYS` |
| Helper / util file | `camelCase.ts` with `camelCase` exports | `helpers/date.ts` → `formatDateToInterval()` |
| Prop (TS) | `camelCase` | `modelValue`, `taskOptions` |
| Prop (template) | `kebab-case` when passed | `:model-value="…"`, `:task-options="…"` |
| Boolean prop | positive phrasing, no `is` prefix | `disabled`, `loading`, `rounded`, `unstyled` |
| Emit name | `kebab-case`, verb-first | `update:modelValue`, `row-click`, `add-task` |
| i18n key | `dot.case`, hierarchical | `pages.auth.login.form.email.label` |
| i18n key segment | `camelCase` | `forgotPassword`, `googleLogin`, `noOptionFound` |
| Route name (display) | `ERouteNames` enum | `ERouteNames.WorktimeUsage` |
| CSS semantic token | `kebab-case` under `--color-*` | `--color-surface-primary`, `--color-content-secondary` |
| Branch name | `<type>/<short-kebab-desc>` | `feat/teams-api`, `fix/dark-mode-toggle` |

---

## 2. Files & folders

### SFC file name = exported component

```
TimerControls.vue         ← component exported as TimerControls
useEnterTimeTimer.ts      ← composable exported as useEnterTimeTimer
```

### Feature folder layout (repo-standard)

```
src/views/<feature>/
  index.vue                ← page entry (only for root features like worktimeUsage)
  _views/                  ← sub-routes
  _components/             ← feature-local child components
  _composables/            ← feature-local composables
  _etc/                    ← feature-local enums/types/constants
  _modals/                 ← dialog components (sometimes nested under _components)
  _types/                  ← feature-local TS types (if the feature has many)
```

Rules:

- Feature folder name: `camelCase` (`worktimeUsage`, not `WorktimeUsage` or `worktime-usage`).
- Underscore-prefixed sub-folders are **always** `_snake` / `_camelCase`.
- Don't create `components/` / `utils/` / `hooks/` inside a feature when an underscore-prefixed equivalent already exists.
- Don't mirror the feature-local convention at the repo root — top-level `src/components/`, `src/composables/`, `src/helpers/`, `src/stores/` have **no** underscore prefix.

---

## 3. Global `F*` components

Components under `src/components/ui/global/*.vue` are auto-registered with an `F` prefix (see `plugins/globalComponents.ts`).

- File: `Input.vue` → template usage: `<FInput>`.
- **Never** import these manually — they're globally available.
- **Never** name a non-global component with an `F` prefix — it's reserved.

---

## 4. Interfaces & types

- Default to `I`-prefixed interfaces (`IProps`, `IEmits`, `IEmployee`).
- Exceptions exist in the codebase (`TimeEntryPayload`, `FormTimeClock`) — these extend generated types and kept the upstream naming. When extending a generated type, either:
  - Prefix with `I` for the extension, or
  - Match the naming of the base type if it reads better.
  Stay consistent within the file.
- Don't prefix `type` aliases with `I`. Use `T` only if the name would otherwise collide (`TEmployeeStatus` if `EmployeeStatus` is taken by an enum).
- Never use Hungarian suffixes (`EmployeeInterface`) — `I`-prefix is the rule.

---

## 5. Enums — `E` prefix is mandatory

Every enum in the repo is `E`-prefixed:

```
ERouteNames, ERole, EPermission, EStorageKeys, EStoreNames,
EGrantType, ELayout, EHeader
```

Members are `UPPER_SNAKE_CASE`:

```ts
export enum EStorageKeys {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh_token',
  LANGUAGE = 'language',
}
```

When adding a new enum: `E<Name>`, `UPPER_SNAKE_CASE` members. Member values are usually lowercase/camel strings matching the backend.

---

## 6. Props / emits / refs

### Props (inside `defineProps`)

- Name in TS: `camelCase` (`modelValue`, `taskOptions`, `isBillable`).
- When passing in a template: `kebab-case` (`:task-options="…"`).
- Boolean props: **positive** phrasing, no `is` prefix on the public name: `disabled`, `loading`, `rounded`, `unstyled`. Internal/computed booleans can use `is` (`isManualLayout`).

### Emits

- Always `kebab-case`, verb-first: `row-click`, `task-save`, `add-project`, `update:modelValue`.
- `update:<camelPropName>` for `v-model` / `defineModel` two-way binding.

### Template refs

- Component ref: `<componentName>Ref` (`inputRef`, `dialogRef`).
- `const inputRef = ref<InstanceType<typeof InputText> | null>(null)`.

---

## 7. i18n keys

- Dot-case, hierarchical, matching the existing tree in `src/locales/en.json`.
- Each **segment** is `camelCase`: `pages.auth.login.form.email.label`, `components.input.noOptionFound`.
- Never invent a top-level bucket. Use `pages.*`, `common.*`, `components.*`, `languages.*` etc. Grep first.

---

## 8. Routes

- Route `name` → `ERouteNames` enum (display label).
- Enum member name: PascalCase with underscores for sub-routes: `Register_CompanyDetails`, `ClassificationWebAddresses`. Match surrounding members.
- Never use a raw string for `name` anywhere.

---

## 9. Branches

- `<type>/<short-kebab-desc>`: `feat/teams-api`, `fix/dark-mode-toggle`, `refactor/stores-split`, `chore/tsconfig-cleanup`.
- One concern per branch.
- Avoid personal names (`deniz/foo`) — commit metadata already captures the author.

---

## 10. Tie-breakers

- When a file exports exactly one default thing, name the file after that thing.
- When a folder holds one component's internals, name the folder PascalCase to match the component; otherwise camelCase.
- Abbreviations: keep them consistent (`API`, `URL`, `ID`) — either all-caps or camel (`userId`, not `userID`). Repo mixes `timeEntries` and `TimesheetApiService` — match the layer: camelCase for variables, PascalCase for API service class names.

---

## 11. Forbidden

- 🚫 snake_case file names (except locale JSON & assets).
- 🚫 kebab-case TS files (`my-helper.ts`). Use `myHelper.ts`.
- 🚫 Non-`E`-prefixed enums.
- 🚫 Non-`I`-prefixed interfaces **for new code** (existing exceptions from generated types excluded).
- 🚫 Inline string enums where an `E*` enum already exists.
- 🚫 Boolean props named `isDisabled` / `isLoading` — use `disabled` / `loading`.
- 🚫 Event names in camelCase — always kebab.
- 🚫 `F`-prefixed components that aren't in `src/components/ui/global/`.

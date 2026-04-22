# TypeScript

Vue 3 + TS strict-ish. `tsconfig.app.json` extends `@vue/tsconfig/tsconfig.dom.json`. **`noImplicitAny` is currently `false`** in this project — that's technical debt, not a license to write untyped code.

---

## 1. Non-negotiables

- Every `<script setup>` uses `lang="ts"`. No exceptions.
- Every `.ts` file under `src/` compiles cleanly with `yarn type-check`.
- Public surface of a module is **explicitly typed**: component props/emits, composable returns, store state, exported helpers/services.
- Run `yarn type-check` after non-trivial TS changes.

---

## 2. Props & emits — interface-first

Always type via `interface` above the macro. Use `withDefaults` for optional props.

```ts
interface IProps {
  modelValue: string
  label?: string
  disabled?: boolean
  options?: IOption[]
}

interface IEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'save'): void
  (e: 'row-click', row: IRow): void
}

const props = withDefaults(defineProps<IProps>(), {
  label: '',
  disabled: false,
  options: () => [],
})

const emit = defineEmits<IEmits>()
```

- Prop defaults for arrays/objects must be returned from a factory (`() => []`, `() => ({})`).
- Emit names are `kebab-case`; `update:<camelPropName>` for `v-model` / `defineModel`.
- Don't use the runtime object form (`defineProps({ modelValue: { type: String } })`) — generic form is required.

---

## 3. Composables — name your return type

Composables always return an object. Annotate when the shape isn't obvious:

```ts
interface IUseEnterTimeTimer {
  elapsedTime: Ref<number>
  isRunning: Ref<boolean>
  formattedElapsedTime: ComputedRef<string>
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
}

export const useEnterTimeTimer = (): IUseEnterTimeTimer => {
  // …
  return { elapsedTime, isRunning, formattedElapsedTime, startTimer, stopTimer, resetTimer }
}
```

For trivial composables (one or two refs) inference is fine. Anything exported and reused across features must have a named return type.

---

## 4. Services & API types

- Request/response DTOs come from `@/client`. Import as type-only:

  ```ts
  import type { ClockSectionRequest, TimeEntryModifyViewModel } from '@/client'
  ```
- Don't redefine API types locally. If the backend is missing a field, extend the generated type and leave a `TODO: Update OpenAPI spec`:

  ```ts
  interface TimeEntryPayload extends TimeEntryModifyViewModel {
    RecordDate?: string
    time?: string
  }
  ```
- Services from `@/client` are fully typed — consumers should never need a cast. If you're casting a response, the backend schema is wrong — fix it there.

---

## 5. Store typing

### Setup store

Refs/computed infer their types from the initializer. Expose a minimal surface:

```ts
export const useAuthStore = defineStore(EStoreNames.AUTH, () => {
  const isAuth = computed(() => !!usersStore.user)

  const login = async (payload: LoginRequest) => { /* … */ }

  return { isAuth, login }
})
```

### Options store — declare the `State` interface

```ts
interface State {
  Card: CardViewModel
  Individuals?: ClockSectionIndividual[]
  isLoading: boolean
}

export const useSectionsStore = defineStore(EStoreNames.WORKTIME_USAGE_SECTION, {
  state: (): State => ({ Card: {} as CardViewModel, Individuals: [], isLoading: false }),
  actions: { /* … */ },
})
```

The `{} as CardViewModel` placeholder is accepted when the backend always returns a full object on first fetch — don't use this pattern for optional data.

---

## 6. `any` — the hard line

Even with `noImplicitAny: false` repo-wide, **do not introduce new `any`**.

- Prefer `unknown` + narrowing.
- Precise union types over `any`.
- If truly unavoidable, annotate with a one-line reason:

  ```ts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- <reason>
  const x: any = libWithNoTypes()
  ```

Existing `any` usage (e.g. `error: any` in catch) is tech-debt. When you touch that line, prefer narrowing:

```ts
try {
  await store.save(payload)
} catch (error) {
  showErrorMessage(error as Error) // useFToast handles Error | ApiError shape
}
```

---

## 7. Non-null assertions & ignores

- 🚫 `value!` to silence the compiler. Narrow via `?.`, early return, or assert meaningfully.
- 🚫 `@ts-ignore`. If you must, use `@ts-expect-error` with a one-line note — the compiler will surface it when the underlying issue is fixed.
- 🚫 Double-casting: `value as unknown as X`. If you need this, the source type is wrong.

Exception: template refs must allow `null`:

```ts
const inputRef = ref<InstanceType<typeof InputText> | null>(null)
onMounted(() => inputRef.value?.focus())
```

---

## 8. Interface vs type — when to use which

- **`interface`** for object shapes, especially the ones meant to be extended (props, API payloads, domain entities).
- **`type`** for unions, intersections, mapped/conditional types, and aliases of primitives/tuples.

```ts
interface IEmployee { id: string; name: string }
interface IActiveEmployee extends IEmployee { lastSeen: string }

type Layout = 'timer' | 'manual'
type Id<T extends { id: string }> = T['id']
```

---

## 9. Enums

- Use `enum` for a **fixed** domain of labels that appear across the app and need an importable identifier (`ERole`, `EPermission`, `EStorageKeys`, `EStoreNames`, `ERouteNames`, `ELayout`).
- Prefix repo convention: **`E` for enums** (`EStoreNames`, `ERouteNames`). Match that.
- Inline string unions are fine for local, never-exported values: `type Layout = 'timer' | 'manual'`.

---

## 10. Generics

- Name them meaningfully when they carry meaning: `<TItem>`, `<TResponse>`. Single-letter `T` is acceptable for obvious single-generic helpers.
- Default generics to the most common caller type when possible:

  ```ts
  export const useField = <TValue = string>(name: string): UseField<TValue> => { /* … */ }
  ```

---

## 11. Utility types — reach for built-ins first

- `Partial<T>`, `Required<T>`, `Readonly<T>` — mutation helpers.
- `Pick<T, K>`, `Omit<T, K>` — reshaping.
- `Record<K, V>` — dictionaries.
- `ReturnType<F>`, `Parameters<F>`, `Awaited<T>` — working with functions.
- `NonNullable<T>`, `Extract<T, U>`, `Exclude<T, U>` — narrowing.

Prefer built-in utilities to one-off mapped types.

---

## 12. `import type` — use it

Type-only imports keep the output bundle clean and are required for type-only exports (e.g. `@/client` models):

```ts
import { ClockApiService } from '@/client'

import type { ClockSectionRequest } from '@/client'
```

The lint config auto-groups value imports from type-only imports — let `yarn lint` sort them.

---

## 13. Forbidden

- 🚫 `any` or `as any` in new code.
- 🚫 Non-null `!` to silence errors (except template refs).
- 🚫 `@ts-ignore` without `-- reason`.
- 🚫 Redefining types already exported by `@/client`.
- 🚫 Runtime `defineProps({ … })` / `defineEmits([...])` forms in new components.
- 🚫 `Promise<any>` from a service or store action — type the payload.
- 🚫 Casting a service response to patch an upstream bug — fix the type at the source (or extend it with a `TODO`).

---

## 14. Checklist before committing TS changes

- [ ] `yarn type-check` passes.
- [ ] `yarn lint` passes.
- [ ] No new `any`, no new `!`, no new `@ts-ignore`.
- [ ] Public API (props, emits, composable returns, store state) explicitly typed.
- [ ] Enums prefixed with `E`; unions typed with `type`.
- [ ] Type-only imports use `import type`.

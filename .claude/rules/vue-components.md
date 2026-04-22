# Vue Components

Hard rules for every `.vue` file in this repo. Component reviews start here.

---

## 1. File shell

- `<template>` → `<script setup lang="ts">` → `<style scoped lang="scss">`. This order is enforced by `yarn lint:order`.
- `lang="ts"` on `<script setup>` is mandatory. Plain `<script>` or missing `lang` fails review.
- One component per file. Helpers used by only this file go in the same SFC; helpers reused elsewhere go to `helpers/`, `composables/`, or a sibling component.
- File name matches the exported component: `PascalCase.vue`.

```vue
<template>…</template>

<script setup lang="ts">…</script>

<style scoped lang="scss">…</style>
```

---

## 2. Size limit — 300 lines

**Soft limit: 200 lines. Hard limit: 300 lines.** Counted on the whole SFC (template + script + style).

When a file is about to cross 300 lines, **do not** ship the bloated version. Split instead:

1. **Template too big** → extract child components into `./_components/` next to the parent.
2. **Script too big** → extract a **composable** (`useXxx`) into `./_composables/` or the shared `src/composables/`.
3. **Repeated blocks** in the same template → `<template v-for>` + a tiny list-item component.
4. **Types too big** → move interfaces/enums to `./_etc/<thing>.enum.ts` or `src/types/`.
5. **Style too big** → move SCSS to a sibling `ComponentName.scss` and `@import` it, or lift shared tokens to `tailwind.css`.

Real examples already in the repo:

- `src/views/timesheets/_components/timeEntries/EnterTime.vue` extracts `TimerControls`, `TaskNameInput`, `ProjectTagSelectors`, `ManualTimeInputs` + the `useEnterTimeTimer` composable.
- `src/views/timesheets/_composables/useTimer.ts` owns timer state so components stay thin.

Follow this pattern. If you catch yourself writing a 400-line SFC, stop and split.

---

## 3. Folder layout around a feature view

Use the repo's existing `_`-prefixed convention:

```
src/views/<feature>/
  index.vue                ← page entry
  _views/                  ← sub-routes under the feature
  _components/             ← feature-local child components
  _composables/            ← feature-local composables (useXxx.ts)
  _etc/                    ← feature-local enums/types/constants
  _modals/                 ← dialog components, often nested under _components
```

Do not invent new conventions (`components/`, `utils/`, `hooks/`) when an underscore-prefixed folder already exists at the target level.

---

## 4. DRY — before you write, search

Before adding anything, grep:

| Before adding… | Search here |
|---|---|
| a date / time helper | `src/helpers/date.ts`, `src/helpers/time.ts`, `src/composables/useDateFormat.ts` |
| a toast | `src/composables/useFToast.ts` — never call PrimeVue `useToast` directly |
| a form input | `src/components/ui/global/Input.vue`, `Select.vue`, `Checkbox.vue`, `DateTimePicker.vue`, `Password.vue`, `Switch.vue`, `TimeInput.vue`, `TimeRange.vue`, `MultiSelect.vue`, `EmailList.vue` |
| a table / skeleton / error state | `src/components/ui/global/` and `src/components/ui/local/` |
| a validation message | existing `yup` schemas + `src/locales/*.json` |
| a composable | `src/composables/` (see `useAuthorization`, `useLanguage`, `useLogout`, `useOperationFeedback`, `useModalFormInit`) |

If an existing thing is 80% right, **extend it**, don't fork it. If you're forking, leave a line in the commit body explaining why.

---

## 5. Template rules

### Block order inside `<template>`

Every template should read top-down in this order:

1. Outermost wrapper (layout container / form).
2. Loading / skeleton state (early-return with `v-if="loading"`).
3. Error / empty state.
4. Header / title / toolbar region.
5. Main content.
6. Footer / action buttons.
7. Portaled UI (modals, overlays, toast anchors) — last.

### Template dos

- Use `<template v-if="…">` / `<template v-for="…">` to group without wrapper div.
- Key every `v-for`: `:key="item.id"` — never `:key="index"` unless the list is truly static.
- Prefer PrimeVue components (auto-imported) over re-skinning native HTML.
- Pass i18n through `$t('…')` — see `i18n.md`.
- Keep a line comment above non-obvious blocks: `<!-- Timer / manual layout switch -->`.

### Template don'ts

- ❌ `v-if` + `v-for` on the same element. Wrap with `<template v-if>`.
- ❌ Inline complex expressions. Move to a `computed`.
  ```vue
  <!-- ❌ -->
  <p>{{ user.roles.filter(r => r.active).map(r => r.name).join(', ') }}</p>
  <!-- ✅ -->
  <p>{{ activeRoleNames }}</p>
  ```
- ❌ Inline style objects in a template — use classes + semantic tokens.
- ❌ Raw strings. Everything user-facing goes through i18n.
- ❌ Manual PrimeVue imports — they are auto-imported by Vite.

### Attribute order (enforced by ESLint)

Roughly: structural (`v-if`, `v-for`, `v-show`) → `ref` / `key` → `v-model` → props → events → attrs → class/style. Let `yarn lint` sort it; don't hand-fight it.

---

## 6. `<script setup>` rules

### Fixed top-to-bottom order

This order is **mandatory** and checked by `yarn lint:order`. Match it exactly.

```ts
// 1. Imports — grouped and sorted:
//    a) Vue / vue-router / vue-i18n / pinia
//    b) Third-party (dayjs, yup, vee-validate, primevue/*)
//    c) Local aliases (@/client, @/composables, @/stores, @/services, @/helpers)
//    d) Relative imports (./_components/*, ./_composables/*)
//    e) Type-only imports last
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import dayjs from 'dayjs'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'

import { useFToast } from '@/composables/useFToast'
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries'

import ChildComponent from './_components/ChildComponent.vue'
import { useEnterTimeTimer } from './_composables/useEnterTimeTimer'

import type { TimeEntryModifyViewModel } from '@/client'

// 2. Interfaces & types
interface IProps {
  modelValue: string
  disabled?: boolean
}
interface IEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'save'): void
}
type Layout = 'timer' | 'manual'

// 3. defineProps
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
})

// 4. defineEmits
const emit = defineEmits<IEmits>()

// 5. Composables & stores (i18n / toast / router / stores first, then custom composables)
const { t } = useI18n()
const { showSuccessMessage } = useFToast()
const store = useTimesheetsTimeEntriesStore()
const { elapsedTime, startTimer, stopTimer } = useEnterTimeTimer()

// 6. Refs / reactive state
const layout = ref<Layout>('timer')
const isBillable = ref(false)

// 7. Computed
const isManual = computed(() => layout.value === 'manual')
const displayTime = computed(() => formatElapsed(elapsedTime.value))

// 8. Functions (arrow only)
const handleStart = () => {
  startTimer()
  emit('save')
}

const handleStop = async (): Promise<void> => {
  stopTimer()
  await store.persist()
}

// 9. Watchers
watch(() => props.modelValue, (next) => {
  layout.value = next as Layout
})

// 10. Lifecycle hooks
onMounted(() => {
  store.fetchInitial()
})
```

### Hard rules on the order

- **No `function` declarations** inside `<script setup>`. Use arrow: `const fn = () => {}`. For async: `const fn = async () => {}`.
- **Return type annotations** on non-trivial arrow functions (`: void`, `: Promise<User>`, `: string`). Trivial getters can be inferred.
- **Functions (step 8) must be after computed (step 7) and before watchers (step 9).** Don't interleave.
- **Watchers (step 9) must be after functions.** A watcher referencing a function declared below is a lint failure.
- **Lifecycle hooks (step 10) last.** Never scatter `onMounted` in the middle of the file.
- **Multiple lifecycle hooks** in declaration order: `onBeforeMount` → `onMounted` → `onBeforeUpdate` → `onUpdated` → `onBeforeUnmount` → `onUnmounted` → `onActivated` → `onDeactivated` → `onErrorCaptured`.

### Props rules

- Props are typed through an `interface IProps` — never the object-literal runtime form.
- Use `withDefaults` for optional props.
- **Never mutate props.** Emit `update:<name>` or use `defineModel` for two-way binding.
- Boolean props: positive phrasing, no `is` prefix in the public name (`disabled`, `loading`, not `isDisabled`).

### Emits rules

- Type emits through `interface IEmits` with the `(e: '…', …): void` call-signature form.
- Event names are `kebab-case`, verb-first (`row-click`, `task-save`, `update:modelValue`).
- Always declare the emit shape — never emit arbitrary events.

### Template refs

- Typed: `const inputRef = ref<InstanceType<typeof InputText> | null>(null)`.
- Access in `onMounted` or user events, never during setup synchronously.

---

## 7. `<style scoped lang="scss">` rules

- Prefer Tailwind utilities in the template. Reach for `<style>` only when utilities genuinely can't express it (deep selectors into PrimeVue, keyframes, complex pseudo-elements).
- Always `scoped`. Global styles belong in `tailwind.css` or `src/assets/styles/`.
- Use `:deep()` instead of deprecated `::v-deep`.
- Keep the style block under ~60 lines. Above that, extract to a sibling SCSS file or push the abstraction into `tailwind.css`.
- Never hardcode colors here either — use CSS vars bound to the semantic tokens.

---

## 8. DRY checklist before committing

Before you push a component, answer these:

- [ ] Is any block > 15 lines **repeated** inside this file? → extract to a local component or a `computed`.
- [ ] Is any function > 20 lines doing **more than one thing**? → split it.
- [ ] Is there state/logic that another component will also need soon? → composable.
- [ ] Is there a helper I wrote that already exists in `src/helpers/`? → use the existing one, delete mine.
- [ ] Are my types duplicated in another file? → move to `src/types/` or `./_etc/`.
- [ ] Does my file cross 300 lines? → split before merging, not "next sprint".

---

## 9. Example: good vs bad

### ❌ Bad (real anti-pattern shape)

```vue
<script setup lang="ts">
// 420 lines total, everything in one file:
// - 6 API calls with raw axios
// - inline yup schema with hardcoded error strings
// - date math using `new Date`
// - 4 nested `watch` chains with side effects
// - business rules sprinkled in handlers
// - `function handleSave()`, `function handleCancel()`
// - `onMounted` placed between computed and functions
</script>
```

### ✅ Good

```vue
<!-- EnterTime.vue, < 200 lines -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFToast } from '@/composables/useFToast'
import { useTimesheetsTimeEntriesStore } from '@/stores/timeSheets/timeEntries'

import TaskNameInput from './_components/TaskNameInput.vue'
import TimerControls from './_components/TimerControls.vue'
import { useEnterTimeTimer } from './_composables/useEnterTimeTimer'

interface IProps { initialTask?: string }
const props = withDefaults(defineProps<IProps>(), { initialTask: '' })

const { t } = useI18n()
const { showSuccessMessage } = useFToast()
const store = useTimesheetsTimeEntriesStore()
const { isRunning, startTimer, stopTimer } = useEnterTimeTimer()

const taskName = ref(props.initialTask)
const isBillable = ref(false)

const canStart = computed(() => taskName.value.trim().length > 0)

const handleStart = (): void => {
  if (!canStart.value) return
  startTimer()
}

const handleStop = async (): Promise<void> => {
  await store.saveEntry({ taskName: taskName.value, billable: isBillable.value })
  stopTimer()
  showSuccessMessage(t('timesheets.entries.saved'))
}

onMounted(() => {
  store.fetchTaskOptions()
})
</script>
```

---

## 10. Done-for-this-file check

Before marking a component change complete:

- [ ] File ≤ 300 lines.
- [ ] Order (template / script / style) correct, script sections in the fixed order above.
- [ ] No `function` declarations inside `<script setup>`.
- [ ] Props/emits typed via `interface IProps` / `interface IEmits`.
- [ ] No duplicated logic that has an existing helper/composable.
- [ ] No raw PrimeVue imports, no `axios` imports, no hardcoded colors, no hardcoded strings.
- [ ] `yarn lint` + `yarn type-check` green.

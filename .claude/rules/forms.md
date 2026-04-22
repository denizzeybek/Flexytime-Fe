# Forms & Validation

Stack: `vee-validate` + `yup` + `vue-i18n` + the repo's `F*` form components (globally registered from `src/components/ui/global/*.vue`).

---

## 1. Global `F*` components (auto-registered)

`src/plugins/globalComponents.ts` registers every SFC under `src/components/ui/global/` with an `F` prefix. They're available in any template **without importing**:

| Tag | File | Purpose |
|---|---|---|
| `<FInput>` | `Input.vue` | Text input with `useField`, error display, optional datalist/options |
| `<FPassword>` | `Password.vue` | Password input |
| `<FSelect>` | `Select.vue` | Single-select dropdown |
| `<FMultiSelect>` | `MultiSelect.vue` | Multi-select |
| `<FCheckbox>` | `Checkbox.vue` | Checkbox |
| `<FSwitch>` | `Switch.vue` | Toggle |
| `<FDateTimePicker>` | `DateTimePicker.vue` | Date / datetime picker (uses `useDateFormat`) |
| `<FTimeInput>` | `TimeInput.vue` | Time (hh:mm) input |
| `<FTimeRange>` | `TimeRange.vue` | Start–end time range |
| `<FSelectSwitchButton>` | `SelectSwitchButton.vue` | Segmented switch |
| `<FEmailList>` | `EmailList.vue` | Chip-style email list |
| `<FText>` | `Text.vue` | Typography helper |
| `<FAvatar>` | `Avatar.vue` | Avatar |

**Use these first.** Don't reach for raw PrimeVue or native inputs unless the F-component is genuinely insufficient.

### Required props for every F form input

`id`, `name` (the vee-validate field name), `label`, `placeholder`. Example from `Login.vue`:

```vue
<FInput
  id="email"
  name="email"
  type="email"
  :label="$t('pages.auth.login.form.email.label')"
  :placeholder="$t('pages.auth.login.form.email.placeholder')"
/>

<FPassword
  id="password"
  name="password"
  :label="$t('pages.auth.login.form.password.label')"
  :placeholder="$t('pages.auth.login.form.password.placeholder')"
/>
```

The F-input wires `useField` internally, so you get validation + error display for free.

---

## 2. Form skeleton — the repo pattern

From `src/views/auth/Login.vue`:

```vue
<template>
  <form class="space-y-4" @submit="submitHandler">
    <FInput id="email" name="email" :label="…" :placeholder="…" />
    <FPassword id="password" name="password" :label="…" :placeholder="…" />

    <Button
      type="submit"
      :loading="isSubmitting"
      :disabled="isSubmitting"
      :label="$t('pages.auth.login.form.submit')"
      class="w-full"
    />
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useForm } from 'vee-validate'
import { object, string } from 'yup'

import { useFToast } from '@/composables/useFToast'
import { type MessageSchema } from '@/plugins/i18n'

const { t } = useI18n<{ message: MessageSchema }>()
const { showErrorMessage } = useFToast()

const validationSchema = object({
  email: string().email().required().label(t('pages.auth.login.form.email.label')),
  password: string().required().label(t('pages.auth.login.form.password.label')),
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema })

const submitHandler = handleSubmit(async (values) => {
  try {
    await authStore.login({ username: values.email, password: values.password })
  } catch (error) {
    showErrorMessage(error as Error)
  }
})
</script>
```

Key points:

- `useForm({ validationSchema })` returns `handleSubmit` and `isSubmitting`.
- Wrap the submit handler with `handleSubmit(async (values) => …)` — `values` is typed from the schema.
- Bind the returned function to `@submit` on the `<form>` (not on the button).
- `:disabled` **and** `:loading` on the submit button use `isSubmitting`.

---

## 3. Schemas — two valid styles

### Style A — `.label()` (short form)

Used when yup's default message + a localized field name is enough:

```ts
const validationSchema = object({
  email: string().email().required().label(t('pages.auth.login.form.email.label')),
  password: string().required().label(t('pages.auth.login.form.password.label')),
})
```

### Style B — explicit messages with interpolation

Used when you want custom wording, or conditional validation. From `EnterTime.vue`:

```ts
const validationSchema = computed(() =>
  object({
    taskName: string()
      .required(t('common.validation.mixed.required', { field: t('common.validation.fields.task') }))
      .label(t('common.validation.fields.task')),
    date: date()
      .when([], {
        is: () => activeLayout.value === ELayout.MANUAL,
        then: (schema) =>
          schema.required(t('common.validation.mixed.required', { field: t('common.validation.fields.date') })),
        otherwise: (schema) => schema.nullable(),
      })
      .label(t('common.validation.fields.date')),
  }),
)
```

### When to wrap in `computed`

Wrap in `computed(() => …)` if:

- The schema depends on reactive state (`activeLayout`, feature flag).
- You want the messages to update live when the locale changes.

Static schemas with only `.label()` don't need it.

---

## 4. Modals with forms

Use PrimeVue `Dialog` + the same `useForm` pattern. There's a `vue-modal` skill / `useModalFormInit` composable for the common "reset on close, seed on open" flow — grep before rolling your own.

- Reset the form on `@hide`/close, not on open. (Opening should seed initial values from props.)
- Don't hold form values in the parent — `useForm` owns them.

---

## 5. Error presentation

- F-components render the `useField` error under the input automatically — don't duplicate it.
- Use `useFToast` for form-level errors:

  ```ts
  const { showSuccessMessage, showErrorMessage } = useFToast()

  showSuccessMessage(t('timesheets.entries.saved'))
  showErrorMessage(error as Error)
  ```
- `showErrorMessage` already unwraps `ApiError.body.message` and `Error.message` — just pass the caught error.

---

## 6. Boolean and select fields

```vue
<FCheckbox
  id="billable"
  name="isBillable"
  :label="$t('timesheets.entries.billable')"
/>

<FSelect
  id="project"
  name="projectId"
  :label="$t('timesheets.entries.project')"
  :options="projectOptions"
  optionLabel="name"
  optionValue="id"
/>
```

- `options` array items should have clear `label` / `value` keys (or map with `optionLabel` / `optionValue`).
- For async-loaded options, fetch in `onMounted` or a store action — not in a computed (avoid side-effects in computed).

---

## 7. Don'ts

- 🚫 Rolling your own `errors` / `touched` reactive refs when `useForm`/`useField` already expose them.
- 🚫 Validation messages as hardcoded strings — always i18n keys.
- 🚫 Submitting on a button `@click` instead of `<form @submit>`; the enter-key submit breaks otherwise.
- 🚫 Forgetting `:disabled="isSubmitting"` on the submit button — users can double-submit.
- 🚫 Raw `<input>` / `<InputText>` when an `<FInput>` exists. Extend the F-component if it's missing a prop.
- 🚫 Mixing v-model on a PrimeVue input inside a vee-validate form. Use `useField` or an F-component.
- 🚫 Putting a schema declaration inside a function that runs on every render.

---

## 8. Checklist before committing a form

- [ ] Every field uses an F-component (or a documented reason why not).
- [ ] `useForm({ validationSchema })` wires the schema.
- [ ] Submit via `handleSubmit(...)` bound to `<form @submit>`.
- [ ] Submit button gets `:loading="isSubmitting"` and `:disabled="isSubmitting"`.
- [ ] All labels, placeholders, and validation messages are i18n keys present in `en.json` + `tr.json`.
- [ ] Error path shows a toast via `useFToast`.
- [ ] No duplicate error state stored alongside vee-validate.

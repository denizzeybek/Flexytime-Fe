# Anti-patterns — Reject on Sight

If any of these show up in a diff, fix them before shipping. No exceptions.

## Styling

- 🚫 `bg-white`, `bg-gray-*`, `bg-slate-*`, `text-gray-*`, `border-gray-*` — raw palette colors.
- 🚫 Inline hex / rgb colors in `<style>` or `style=""`.
- 🚫 Theme-aware element without `transition-colors`.
- 🚫 Plain-CSS `!important`. Use Tailwind `!` prefix only to override PrimeVue internals.

## i18n

- 🚫 Hardcoded user-facing strings in templates, toasts, validation, table headers, placeholders, aria-labels.
- 🚫 New key added to `en.json` but missing in `tr.json` (or vice versa).
- 🚫 String concatenation instead of interpolation.

## Vue / script

- 🚫 `<script>` without `setup` / without `lang="ts"`.
- 🚫 `function foo() {}` inside `<script setup>` — use arrow functions.
- 🚫 Options API usage.
- 🚫 `v-if` + `v-for` on the same element.
- 🚫 Manually importing a PrimeVue component (they're auto-imported).

## Data / state

- 🚫 `axios.get(...)` / `axios.post(...)` from a `.vue` file.
- 🚫 `localStorage.getItem('token')` in components/services.
- 🚫 Mutating Pinia state directly from a component.
- 🚫 Duplicated endpoint call across multiple services.

## TypeScript

- 🚫 `any`, `as any`.
- 🚫 Non-null `!` to silence the compiler.
- 🚫 `@ts-ignore` / `@ts-expect-error` without a comment.
- 🚫 `Promise<any>` from a service.

## Dates

- 🚫 `moment(...)`.
- 🚫 `date-fns`.
- 🚫 `new Date(a) - new Date(b)` math.
- 🚫 `toLocaleDateString()` for user-visible strings.

## Process / hygiene

- 🚫 `console.log`, `console.warn`, `debugger` left in.
- 🚫 Commit message in past tense or without a type prefix.
- 🚫 New helper/composable that duplicates one already in `src/helpers/` or `src/composables/` — search first.
- 🚫 `--no-verify` on commit without explicit user approval.
- 🚫 Force-push to `dev` / `main`.

# Done Checklist

Run this every time before declaring a task complete. If a box can't be checked, say so in the reply — don't silently skip.

## Code quality

- [ ] `yarn lint` passes (includes `lint:order`).
- [ ] `yarn type-check` passes.
- [ ] No `any`, non-null `!`, `@ts-ignore`, `console.log`, or `debugger` added.
- [ ] No dead code, no commented-out blocks, no leftover TODOs without a ticket.

## UI

- [ ] Verified in **light** mode.
- [ ] Verified in **dark** mode.
- [ ] Verified at mobile breakpoint (≤ `md`).
- [ ] No hardcoded `bg-white` / `text-gray-*` / raw palette colors — semantic tokens only.
- [ ] `transition-colors` on theme-aware elements.

## i18n

- [ ] No hardcoded user-facing strings.
- [ ] New keys present in **both** `src/locales/en.json` and `src/locales/tr.json`.
- [ ] Turkish translations are real, not placeholders.

## State / data

- [ ] No `axios` called directly from a component.
- [ ] Store mutations happen through actions.
- [ ] No direct `localStorage` token reads.

## Forms (if applicable)

- [ ] `vee-validate` + `yup` used.
- [ ] Validation messages come from i18n keys.

## Dates (if applicable)

- [ ] All date/time ops via `dayjs` (no `moment`, no native `Date` math, no `toLocaleString`).

## Summary to the user

When reporting done, state what changed and what was verified — not the full checklist. One to three sentences.

# Dates, Times & Numbers

Everything time-related flows through `dayjs`. `moment` and `date-fns` are not dependencies — don't add them.

---

## 1. Setup in this repo

`src/helpers/date.ts` owns the dayjs configuration:

```ts
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import type { Language } from '@/plugins/i18n'

dayjs.extend(LocalizedFormat)

const map = {
  en: () => import('dayjs/locale/en'),
  tr: () => import('dayjs/locale/tr'),
}

export const changeDayjsLocale = async (locale: Language) => {
  await map[locale]()
  dayjs.locale(locale)
}
```

- **`LocalizedFormat` is extended globally** — `LL`, `LLL`, `LT` etc. respect the active locale.
- Locale swap is triggered from `setI18nLanguage` (in `plugins/i18n.ts`). Don't call `dayjs.locale` manually from a component.
- If you need a new plugin (`utc`, `relativeTime`, `duration`), register it once in `helpers/date.ts` and leave a note. Never extend dayjs from inside a component.

---

## 2. Usage patterns

### Import

```ts
import dayjs from 'dayjs'
```

That's it — no per-file plugin extends.

### Format (locale-aware via `LocalizedFormat`)

```ts
dayjs(value).format('LL')      // e.g. "April 23, 2026" / "23 Nisan 2026"
dayjs(value).format('LLL')     // date + time
dayjs(value).format('LT')      // time only, locale-aware
dayjs(value).format('HH:mm')   // explicit 24-hour
```

### Parse / compare / arithmetic

```ts
const start = dayjs(values.startTime)
const end = dayjs(values.endTime)

const minutes = end.diff(start, 'minute')
const sameDay = start.isSame(end, 'day')
const nextWeek = dayjs().add(7, 'day')
```

### Formatting for API payloads

Several services expect `DD.MM.YYYY`. Use the helper:

```ts
import { formatDateToInterval } from '@/helpers/date'

formatDateToInterval(new Date()) // "23.04.2026"
```

Other payload formats live as helpers in `src/helpers/date.ts` / `src/helpers/time.ts` / `src/helpers/utils.ts`. Grep before adding a new one.

### Date-picker display format

PrimeVue `DatePicker` needs its own format string. Use the composable — it swaps based on locale:

```ts
import { useDateFormat } from '@/composables/useDateFormat'

const { dateFormat } = useDateFormat() // ref<'dd.mm.yy' | …>
```

```vue
<DatePicker :date-format="dateFormat" />
```

Don't hardcode `'dd.mm.yy'` in a component.

---

## 3. Forbidden

- 🚫 `moment(...)` — not installed. Don't add.
- 🚫 `date-fns` — same.
- 🚫 Native `Date` arithmetic: `new Date(b) - new Date(a)`. Use `dayjs(b).diff(a, 'minute')`.
- 🚫 `new Date().toLocaleDateString(...)` / `toLocaleString(...)` for user-visible strings. Use `dayjs(value).format('LL')` or the right helper.
- 🚫 Hardcoded `'dd.mm.yy'` / `'MM/DD/YYYY'` in a component — it breaks on locale switch. Use `useDateFormat`.
- 🚫 `dayjs.locale(...)` inside a component. Locale changes only via `setI18nLanguage`.
- 🚫 `dayjs.extend(...)` outside `helpers/date.ts`.
- 🚫 Mixing dayjs-mutable patterns. Every dayjs method is immutable — no `.set()` without assigning the return.

---

## 4. Duration formatting

For elapsed-time / "hh:mm:ss" style output the repo uses `helpers/utils.ts::calculateTimeDifferenceFromDates` and the `useTimer` / `useEnterTimeTimer` composables. Use those; don't write a new one.

---

## 5. Numbers, currency, percents

- Format numbers with `Intl.NumberFormat(locale.value, …)` **inside a helper**, not scattered in templates.
- Never hardcode currency symbols (`"$"`, `"₺"`). The symbol comes from `Intl.NumberFormat(locale, { style: 'currency', currency })`.
- Percentages: show the unit as part of the i18n message, not concatenated in code:

  ```json
  // en.json
  { "stats.productivity": "{value}% productivity" }
  ```
  ```ts
  t('stats.productivity', { value: 42 })
  ```

- Keep stored values precise. Round at the display layer.

---

## 6. UTC handling

UTC plugin is **not** currently registered. Backend timestamps are treated as local + ISO. If you need UTC handling:

1. Extend once in `helpers/date.ts`: `dayjs.extend(utc)`.
2. Update this rule file in the same PR.
3. Use `dayjs.utc(value)` / `.local()` explicitly in the call site.

Don't silently extend the plugin in a random component.

---

## 7. Checklist before committing date-related code

- [ ] All date/time ops go through `dayjs`.
- [ ] No `moment`, `date-fns`, or raw `Date` math introduced.
- [ ] No `toLocaleDateString` / `toLocaleString` for user-visible strings.
- [ ] Any new plugin registered in `helpers/date.ts`, not locally.
- [ ] Date-picker formats come from `useDateFormat`.
- [ ] Helpers in `helpers/date.ts` / `helpers/time.ts` / `helpers/utils.ts` searched before writing a new one.

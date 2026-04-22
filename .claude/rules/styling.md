# Styling

All new UI **must** be dark-mode compatible from day one. Tokens come from `src/tailwind.css`.

---

## 1. Why semantic tokens exist

Light mode and dark mode swap values behind the same token name:

- `bg-surface-primary` → `#ffffff` (light) / `#18181b` (dark)
- `text-content-primary` → `slate-900` / `zinc-50`
- `border-border-primary` → `slate-200` / dark border

If you use `bg-white` directly, dark mode breaks. Always use tokens.

---

## 2. Full token reference (from `src/tailwind.css`)

### Surface (backgrounds)

| Token | Light | Dark |
|---|---|---|
| `bg-surface-primary` | white | zinc-900 |
| `bg-surface-secondary` | slate-50 | zinc-800 |
| `bg-surface-tertiary` | slate-100 | zinc-700 |
| `bg-surface-elevated` | white | zinc-800 |
| `bg-surface-overlay` | black/40 | black/70 |

### Content (text & icons)

| Token | Light | Dark |
|---|---|---|
| `text-content-primary` | slate-900 | zinc-50 |
| `text-content-secondary` | slate-600 | zinc-400 |
| `text-content-tertiary` | slate-500 | zinc-500 |
| `text-content-muted` | slate-400 | zinc-600 |
| `text-content-inverted` | white | zinc-900 |

### Border

| Token | Light | Dark |
|---|---|---|
| `border-border-primary` | slate-200 | darker border |
| `border-border-secondary` | slate-100 | subtle border |
| `border-border-focus` | purple-600 | purple-600 |

### Brand (purple scale)

| Token | Value |
|---|---|
| `text-brand-primary` / `bg-brand-primary` | purple-600 |
| `text-brand-primary-hover` / `bg-brand-primary-hover` | purple-700 |
| `bg-brand-primary-active` | purple-800 |
| `bg-brand-primary-subtle` | purple-50 |

### State (success / warning / error / info)

Each has `text-state-<x>`, `bg-state-<x>-bg`, `border-state-<x>-border`:

- `state-success` → green-500 / green-50 / green-200
- `state-warning` → orange-500 / orange-50 / orange-200
- `state-error` → red-500 / red-50 / red-200
- `state-info` → sky-500 / sky-50 / sky-200

### Interactive

| Token | Usage |
|---|---|
| `bg-interactive-hover` | row / button hover |
| `bg-interactive-active` | pressed state |
| `bg-interactive-selected` | selected row / menu item |
| `border-interactive-selected-border` | selected border |

### Legacy `--color-f-*` aliases

The theme also exposes `f-primary`, `f-danger`, `f-success`, `f-warn`, `f-info`, `f-light-purple`, etc. These exist for older components; **prefer the semantic tokens above for new code**. Only use `f-*` when extending a component that already uses them.

---

## 3. How to style (correct usage)

### Card / panel

```vue
<div
  class="
    rounded-2xl shadow-xl border p-6
    bg-surface-primary dark:bg-surface-elevated
    border-border-secondary dark:border-border-primary
    transition-colors duration-300
  "
>
  …
</div>
```

### Typography

```vue
<h1 class="text-2xl font-bold text-content-primary">{{ $t('page.title') }}</h1>
<p class="text-sm text-content-secondary">{{ $t('page.subtitle') }}</p>
<small class="text-xs text-content-tertiary">{{ $t('common.meta') }}</small>
```

### Link / brand action

```vue
<RouterLink
  class="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
  :to="{ name: ERouteNames.ForgotPassword }"
>
  {{ $t('pages.auth.login.forgotPassword') }}
</RouterLink>
```

### Button (when you can't use PrimeVue `<Button>`)

```vue
<button
  class="
    flex items-center justify-center gap-3 rounded-lg py-2.5 px-4 font-medium
    bg-surface-primary dark:bg-surface-secondary
    border-2 border-border-primary hover:border-border-focus
    hover:bg-interactive-hover
    text-content-primary
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  …
</button>
```

### Divider with label

```vue
<div class="relative my-6">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-border-primary" />
  </div>
  <div class="relative flex justify-center text-sm">
    <span class="px-4 bg-surface-primary dark:bg-surface-elevated text-content-tertiary font-medium">
      {{ $t('common.or') }}
    </span>
  </div>
</div>
```

### State badge

```vue
<!-- Success -->
<span class="px-2 py-0.5 rounded text-xs text-state-success bg-state-success-bg border border-state-success-border">
  {{ $t('status.active') }}
</span>

<!-- Error -->
<span class="px-2 py-0.5 rounded text-xs text-state-error bg-state-error-bg border border-state-error-border">
  {{ $t('status.failed') }}
</span>
```

---

## 4. Dark mode rules

1. **Always add `transition-colors`** on theme-aware elements so the switch is smooth.
2. Semantic tokens already handle the swap. Only add an explicit `dark:` class when the token isn't sufficient (e.g. using `bg-surface-primary` in light and `bg-surface-elevated` in dark for stacked contrast).
3. For nested contrast, prefer a different surface level (`surface-secondary` inside `surface-primary`) instead of opacity hacks.
4. Never target `.dark` manually in a component. The theme is toggled on `html.dark` by `useTheme()` and cascades.
5. Test in **both** modes before marking a UI task complete — not optional.

---

## 5. PrimeVue overrides

PrimeVue auto-imports are enabled (see `vite.config.ts`). When you need to override styling from outside:

```vue
<Card class="!bg-surface-primary dark:!bg-surface-elevated !border !border-border-secondary dark:!border-border-primary">
```

- Use the Tailwind `!` prefix — never plain-CSS `!important`.
- Reach for `:deep()` in scoped SCSS only when a Tailwind override can't reach the internal element:

  ```vue
  <style scoped lang="scss">
  :deep(.p-datatable-header) {
    background: var(--color-surface-primary);
  }
  </style>
  ```

---

## 6. Forbidden

- ❌ `bg-white`, `bg-black`, `bg-gray-*`, `bg-slate-*`, `bg-zinc-*`, `bg-neutral-*`.
- ❌ `text-gray-*`, `text-slate-*`, `text-zinc-*` — including `text-gray-500` type utilities.
- ❌ `border-gray-*`, `border-slate-*`.
- ❌ Inline hex / rgb in templates: `style="color: #6d28d9"`.
- ❌ Inline hex in `<style>` blocks. Use `var(--color-…)` from the token set.
- ❌ Direct use of the `--color-*-50…950` palette names in components. They exist so tokens can reference them — not for component-level classes.
- ❌ `!important` in plain CSS. Tailwind `!` prefix is the only allowed escape hatch.
- ❌ A light-mode component without a dark-mode check. Test both.

---

## 7. Extending the token set

If a color is missing:

1. Open `src/tailwind.css`.
2. Add to the palette block if it's a new hue (rare — we already have 5 color scales).
3. Add the semantic token in the **Surface / Content / Border / Brand / State / Interactive** section with both light value and a dark override inside the `@media (prefers-color-scheme: dark)` / `.dark` override block (follow the surrounding pattern).
4. Reference the new token by name in your component — never hardcode the value.

Don't add one-off colors. If a designer asks for a unique shade for a single component, push back or add it to the legacy `--color-f-*` aliases.

---

## 8. Quick checks before committing a UI change

- [ ] No raw palette colors (`bg-white`, `text-gray-500`, …) — grep your diff.
- [ ] `transition-colors` present on theme-aware elements.
- [ ] Rendered correctly in **light** mode.
- [ ] Rendered correctly in **dark** mode.
- [ ] Mobile breakpoint checked.
- [ ] No plain-CSS `!important`.
- [ ] PrimeVue overrides use `!` prefix and semantic tokens.

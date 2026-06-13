# Comment Policy

Only the comments that pay for themselves stay. Everything else is noise.

---

## Allowed

- `/* ... */` block comments — including JSDoc (`/** ... */`).
- `// TODO`, `// FIXME`, `// HACK` (case-insensitive) — actionable markers.
- `// eslint-disable-*`, `// eslint-enable-*` — lint directives.
- `// @ts-expect-error`, `// @ts-ignore`, `// @ts-nocheck` — TypeScript directives. Pair with a one-line reason.
- `// prettier-ignore`, `// prettier-ignore-start/end`.
- `/// <reference ... />` triple-slash directives (only at top of `.d.ts` files).

## Forbidden

- 🚫 Single-line `//` comments that **describe what the code does**.
  - The well-named identifier already says that. The comment goes stale; the identifier does not.
- 🚫 Section header comments (`// === Section ===`, `// --- Functions ---`).
  - Use whitespace and structure, not banners.
- 🚫 Commented-out code blocks (`// const x = oldThing()`).
  - Delete it. Git remembers.
- 🚫 Restating the obvious (`// loop over users`).
- 🚫 Author / date markers (`// added by X on 2024-...`).
- 🚫 Bracketing comments (`// end of foo`, `// end if`).

## When a comment is worth writing

Ask the four-question filter — write the comment only if at least one is YES:

1. Does it explain **why** this code exists in a non-obvious way (workaround, invariant, legacy parity)?
2. Does it warn about a **non-obvious side effect** the reader will miss?
3. Does it preserve **context the codebase has already lost** (a deleted endpoint, a renamed field still flowing through)?
4. Does it carry a **machine-readable directive** (TODO with ticket, eslint-disable with reason)?

If none of those apply, the comment is decoration. Don't write it.

## Style for the ones that stay

- `// TODO:` and `// FIXME:` must reference a ticket or a clear next step:
  ```ts
  // TODO(#1842): regenerate @/client after backend ships ReportViewModel.
  ```
- `// @ts-expect-error` / `// eslint-disable-*` must include the **why** on the same line or above:
  ```ts
  // @ts-expect-error -- legacy api returns `any`; ticket #2010 to fix the swagger.
  ```
- JSDoc on public functions/composables exposes the contract for autocomplete. Keep them tight; don't restate parameter names.

## Enforcement

- A PreToolUse hook on `Edit`/`Write` rejects new non-allowlisted `//` comments in `*.ts`, `*.tsx`, `*.vue`, `*.js`. The hook is AST-aware (template literals and string literals are not scanned).
- This rule is project-wide; it overrides any "I want to leave a note" instinct. Put the note in the PR body or the commit message instead.

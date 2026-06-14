# Comment Policy

**The only content comment allowed in source code is `// TODO:`.** Everything else — `//` narration, `/* */` blocks, JSDoc `/** */`, Vue `<!-- -->` inside `<template>` — is noise and goes.

Tool directives (`eslint-*`, `@ts-*`, `prettier-ignore`, triple-slash references, the `// reason: ...` escape-hatch used for `: any`/`as any`/`!`) stay because they instruct the toolchain, not the reader.

The strict rule replaces the prior "four-question filter". The filter was right in theory and abused in practice — every commenter believed their note passed all four questions. We now have one bright line: TODO survives, everything else doesn't.

---

## Allowed

- `// TODO: ...` — the **only** content comment. Must reference a ticket or a concrete next step.
- `// eslint-disable-*`, `// eslint-enable-*`, `// eslint-disable-next-line`, `// eslint-disable-line` — lint directives.
- `// @ts-expect-error`, `// @ts-ignore`, `// @ts-nocheck` — TypeScript directives.
- `// prettier-ignore`, `// prettier-ignore-start`, `// prettier-ignore-end`.
- `// reason: ...` — the Rule-04 escape-hatch required immediately above `: any` / `as any` / `!`.
- `/// <reference ... />` triple-slash directives (only in `.d.ts` files).
- `/* generated using openapi-typescript-codegen -- do not edit */` and the rest of the codegen banner — these mark generated files; never edit, never strip.

Everything else is forbidden — including `// FIXME` and `// HACK`. The old surface had those as aliases for "I'll come back to this"; in practice they were never revisited. If something needs revisiting, it's a TODO.

## Forbidden

- 🚫 Any single-line `//` not on the allow-list above. That includes "I'll write a doc here later", "leaving this for context", "this is intentional", etc.
- 🚫 Any block `/* ... */` comment. Even if it carries a date / author / "explanation".
- 🚫 Any JSDoc `/** ... */` block. The FE has no equivalent of the BE's swagger-plugin exception; nothing reads JSDoc here. Identifiers + types do the documentation.
- 🚫 Vue `<!-- ... -->` comments inside `<template>`. They render through dev mode and add nothing.
- 🚫 Commented-out code (`// const x = oldImpl()`). Delete. Git remembers.
- 🚫 Section banners (`// === Setup ===`, `// --- Helpers ---`). Use whitespace.
- 🚫 Author / date markers (`// added by X on 2024-...`).
- 🚫 Bracketing markers (`// end of foo`, `// end if`).
- 🚫 `// FIXME`, `// HACK` (legacy aliases for TODO). Convert to `// TODO:` with a real next step or delete.

## Style for the ones that stay

- `// TODO:` must name **what** needs doing and **how to verify it's done**. The ticket is the preferred form:
  ```ts
  // TODO(#1842): regenerate @/client after backend ships ReportViewModel.
  ```
  If there's no ticket, give a concrete trigger:
  ```ts
  // TODO: drop this fallback once `@/client` ships TimeEntryGroupViewModel.
  ```
- `// @ts-expect-error` / `// eslint-disable-*` must include the **why** on the same line or above:
  ```ts
  // @ts-expect-error -- legacy api returns `any`; tracking https://github.com/x/y/issues/123
  ```
- `// reason:` is a directive, not a freeform note. One sentence on why the `: any` is unavoidable:
  ```ts
  // reason: stripe-node v17 ships an outdated type for the events payload.
  const eventType = (raw.type as any).split('.')[0];
  ```

## Where the rule is enforced

- **PreToolUse hook** on `Edit`/`Write` rejects new non-allow-listed `//` comments in `*.ts`, `*.tsx`, `*.vue`, `*.js`. The hook is AST-aware (template literals and string literals are not scanned).
- **Bulk cleanup**: `/strip-comments` runs the same allow-list across `src/**` to clear the history of decorative narration. Re-run after upstream drops survive.
- **CI**: `yarn lint` flags the violations the hook can't see at edit time (e.g. comments inside HTML strings).

## Why the rule is this strict

Comments rot. Identifiers don't. The codebase has been through enough refactors that "what does this do" comments are routinely lying by the time the next reader sees them. The PR description, the commit message, and the test name are where the **why** goes — they're versioned alongside the code that justifies them. The TODO is the only comment that has a built-in next action and therefore an exit strategy. Everything else is forever, even when wrong.

If you find yourself wanting to write a comment that isn't a TODO, the answer is one of:

1. Rename the identifier so it says what the comment would have said.
2. Extract a helper whose name carries the intent.
3. Put the explanation in the test name (`it('returns ... because ...')`).
4. Put the explanation in the commit message.
5. Put the explanation in the PR body.

Source code is for the compiler and the next reader. The next reader will read the identifiers, not the surrounding paragraph.

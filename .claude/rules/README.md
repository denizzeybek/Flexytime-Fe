# Flexytime Claude Rules

Machine-readable project rules for Claude Code. Every file here is a focused rule set; `CLAUDE.md` at the repo root links to them.

| File | Scope |
|---|---|
| [vue-components.md](./vue-components.md) | SFC structure, script setup, Composition API order |
| [styling.md](./styling.md) | Tailwind semantic tokens, dark mode, forbidden colors |
| [i18n.md](./i18n.md) | No hardcoded strings, `en.json` + `tr.json` parity |
| [state-services.md](./state-services.md) | Pinia stores, services, axios usage |
| [forms.md](./forms.md) | vee-validate + yup patterns |
| [dates.md](./dates.md) | dayjs only, UTC plugin, no moment/native Date math |
| [routing-auth.md](./routing-auth.md) | Router guards, route meta, lazy loading |
| [typescript.md](./typescript.md) | No `any`, no non-null `!`, explicit public APIs |
| [naming.md](./naming.md) | Files, folders, composables, stores, props, emits, keys |
| [commits.md](./commits.md) | Conventional Commits rules with examples |
| [branches-prs.md](./branches-prs.md) | Branch naming, PR format, review checklist |
| [done-checklist.md](./done-checklist.md) | What to verify before marking a task done |
| [anti-patterns.md](./anti-patterns.md) | Things to reject on sight |

## How Claude should use these

1. Read `CLAUDE.md` first for architecture and tech-stack context.
2. When touching a specific concern (styling, i18n, forms…) load the matching rule file.
3. All rules are **mandatory** unless the user explicitly overrides in conversation.
4. If two rules conflict, the more specific file wins (e.g. `styling.md` beats a generic note in `CLAUDE.md`).

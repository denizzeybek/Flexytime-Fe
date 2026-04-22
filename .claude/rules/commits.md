# Commit Conventions

[Conventional Commits](https://www.conventionalcommits.org/) in English. Scope is optional.

## Types used in this repo

`feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`.

## Format

```
<type>: <imperative summary>

<optional body, wrapped ~80 chars, explains WHY>
```

- Subject ≤ 72 chars, no trailing period.
- Imperative mood: "Add", "Fix", "Remove" — never past tense.
- Capitalize the first letter after the colon.
- One logical change per commit. Bundle only when the steps are truly atomic.

## Good examples (from this repo)

```
feat: Add Teams API integration and manager assignment
fix: Handle multiple time value formats in worktimeUsage tables
refactor: Standardize Title/Team dropdowns to use dedicated stores
chore: Remove settings.local.json from git tracking
```

## Bad examples

```
updates                       # no type, not descriptive
fix: fixed the bug            # past tense, vague
feat: added new feature.      # past tense + trailing period
WIP                           # never push WIP to shared branches
```

## Breaking changes

Add `!` after the type or a `BREAKING CHANGE:` footer:

```
feat!: Drop support for legacy auth endpoint
```

## Never

- Don't commit `.env`, credentials, tokens, or `settings.local.json`.
- Don't `--amend` or force-push a commit that's already on a shared branch.
- Don't skip hooks (`--no-verify`) unless the user explicitly asks you to.

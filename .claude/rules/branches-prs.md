# Branches & Pull Requests

## Branches

- Branch off `dev`. `main` is release-only.
- Name: `<type>/<short-kebab-desc>` — `feat/teams-api`, `fix/dark-mode-toggle`, `refactor/stores-split`.
- One concern per branch. If scope balloons mid-work, split into a follow-up.

## Before opening a PR

1. Rebase on latest `dev`.
2. `yarn lint` passes (includes composition-order check).
3. `yarn type-check` passes.
4. Manually verified in both **light and dark mode** for any UI change.
5. New i18n keys exist in both `en.json` and `tr.json`.
6. No `console.log` / `debugger` / commented-out code left behind.

## PR title

Same format as a commit subject:

```
feat: Add Teams API integration and manager assignment
```

## PR description (English)

```
## Summary
- 1–3 bullets describing what changed and why.

## Test plan
- [ ] Light & dark mode verified
- [ ] Tested on mobile viewport
- [ ] <feature-specific checks>
```

Attach before/after screenshots for any UI change.

## Size

Keep PRs small. If the diff touches more than ~10 files across unrelated areas, split it. Big PRs = bad reviews.

## Review etiquette

- Address every comment — either fix or reply why not.
- Resolve conversations only when the reviewer agrees.
- Rebase > merge-commit on top of `dev`.

## Force pushes

- ✅ `--force-with-lease` on your own feature branch is fine.
- ❌ Never force-push to `dev` or `main`.

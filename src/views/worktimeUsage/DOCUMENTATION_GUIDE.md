# Worktime Usage - Documentation Guide

## 📚 Documentation Organization

The Worktime Usage module documentation has been reorganized for better clarity and navigation. Instead of one large README, the documentation is now split into focused, category-based documents.

## 🚀 Quick Start

### For New Developers
Start here to understand the module:
- **[VIEW_README.md](./VIEW_README.md)** - High-level architecture overview and getting started guide

### For Existing Developers
Jump directly to what you need:
- **[README.md](./README.md)** - Comprehensive technical documentation (original)
- **[components/INDEX.md](./components/INDEX.md)** - Complete component index and navigation

## 📖 Documentation Structure

### Main Documentation

| File | Purpose | Audience |
|------|---------|----------|
| **VIEW_README.md** | Module overview, architecture, data flow, getting started | New developers, Product managers |
| **README.md** | Detailed technical documentation, API specs, patterns | Developers working on features |
| **DOCUMENTATION_GUIDE.md** | This file - guides you to the right documentation | Everyone |

### Component Documentation (in `components/` directory)

| File | Components Covered | When to Use |
|------|-------------------|-------------|
| **[INDEX.md](./components/INDEX.md)** | Navigation index for all components | Finding specific component docs |
| **[VIEWS_README.md](./components/VIEWS_README.md)** | WorktimeUsage.vue, WorktimeUsageEmployee.vue | Working on main view containers |
| **[NAVIGATION_README.md](./components/NAVIGATION_README.md)** | WorktimeButtonGroups.vue, UserBadge.vue | Working on navigation/layout |
| **[PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md)** | Team.vue, Individuals.vue, Graph.vue | Working on productivity views |
| **[DISTRIBUTION_README.md](./components/DISTRIBUTION_README.md)** | Distribution.vue | Working on distribution charts |
| **[SUMMARY_README.md](./components/SUMMARY_README.md)** | All summary components, composables | Working on summary/metrics |

## 🎯 Find What You Need

### By Task

| What You Want to Do | Go To |
|---------------------|-------|
| Understand the module architecture | [VIEW_README.md](./VIEW_README.md) |
| Add a new sub-view | [README.md](./README.md#adding-new-sub-view) |
| Modify navigation buttons | [NAVIGATION_README.md](./components/NAVIGATION_README.md#worktimebuttongroupsvue) |
| Add a new metric/badge | [SUMMARY_README.md](./components/SUMMARY_README.md#usestaticbadge) |
| Understand data flow | [VIEW_README.md - Data Flow](./VIEW_README.md#data-flow) |
| Modify table components | [PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md) |
| Work with charts | [DISTRIBUTION_README.md](./components/DISTRIBUTION_README.md) or [PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md#graphvue) |
| Find all components | [components/INDEX.md](./components/INDEX.md) |

### By Component File

| Component File | Documentation |
|----------------|---------------|
| `_views/WorktimeUsage.vue` | [VIEWS_README.md](./components/VIEWS_README.md#worktimeusagevue) |
| `_views/WorktimeUsageEmployee.vue` | [VIEWS_README.md](./components/VIEWS_README.md#worktimeusageemployeevue) |
| `_components/WorktimeButtonGroups.vue` | [NAVIGATION_README.md](./components/NAVIGATION_README.md#worktimebuttongroupsvue) |
| `_components/UserBadge.vue` | [NAVIGATION_README.md](./components/NAVIGATION_README.md#userbadgevue) |
| `_components/subPages/productivity/Team.vue` | [PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md#teamvue) |
| `_components/subPages/productivity/Individuals.vue` | [PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md#individualsvue) |
| `_components/subPages/productivity/Graph.vue` | [PRODUCTIVITY_README.md](./components/PRODUCTIVITY_README.md#graphvue) |
| `_components/subPages/distribution/Distribution.vue` | [DISTRIBUTION_README.md](./components/DISTRIBUTION_README.md) |
| `_components/summary/*` | [SUMMARY_README.md](./components/SUMMARY_README.md) |
| `_composables/useStaticBadge.ts` | [SUMMARY_README.md](./components/SUMMARY_README.md#usestaticbadge) |
| `_etc/severityMap.ts` | [SUMMARY_README.md](./components/SUMMARY_README.md#severitymap) |

## 🗂️ Directory Structure

```
src/views/worktimeUsage/
│
├── 📄 DOCUMENTATION_GUIDE.md    ← You are here
├── 📄 VIEW_README.md            ← Start here for overview
├── 📄 README.md                 ← Original comprehensive docs
│
├── 📁 components/               ← Component-specific documentation
│   ├── INDEX.md                 ← Component navigation index
│   ├── VIEWS_README.md
│   ├── NAVIGATION_README.md
│   ├── PRODUCTIVITY_README.md
│   ├── DISTRIBUTION_README.md
│   └── SUMMARY_README.md
│
├── 📁 _views/                   ← View components
├── 📁 _components/              ← UI components
├── 📁 _composables/             ← Composable functions
└── 📁 _etc/                     ← Constants and utilities
```

## 💡 Tips

### Reading Path for New Developers

1. **Start**: [VIEW_README.md](./VIEW_README.md) - Understand the big picture
2. **Deep Dive**: [README.md](./README.md) - Learn the technical details
3. **Components**: [components/INDEX.md](./components/INDEX.md) - Explore individual components
4. **Hands-on**: Pick a component and read its specific README

### Quick Reference for Experienced Developers

- **Component Index**: [components/INDEX.md](./components/INDEX.md)
- **Architecture Diagram**: [VIEW_README.md - Architecture](./VIEW_README.md#architecture)
- **Common Patterns**: [VIEW_README.md - Best Practices](./VIEW_README.md#best-practices)
- **Data Flow**: [VIEW_README.md - Data Flow](./VIEW_README.md#data-flow)

## 🔍 Search Tips

Each README has a **Table of Contents** for easy navigation:
- Use `Ctrl/Cmd + F` to search within a document
- Look for `##` headings for main sections
- Look for `###` headings for subsections

## 📝 Contributing to Documentation

When updating components, please:

1. Update the relevant component README in `components/`
2. Update [components/INDEX.md](./components/INDEX.md) if adding/removing components
3. Keep examples up to date with actual code
4. Add any common issues you encounter with solutions

## 🔗 Related Documentation

- **Project-wide guidelines**: See `/CLAUDE.md` in project root
- **Router configuration**: `src/router/routes.ts`
- **Store documentation**: `src/stores/worktimeUsage/section.ts`
- **Type definitions**: `src/interfaces/worktimeUsage/`

---

**Need help?** Start with [VIEW_README.md](./VIEW_README.md) or use [components/INDEX.md](./components/INDEX.md) to find specific component documentation.

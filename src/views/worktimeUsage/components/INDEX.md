# Worktime Usage - Component Documentation Index

Welcome to the comprehensive component documentation for the Worktime Usage module. This documentation has been organized by component category for easy navigation.

## Quick Start

- **New to the module?** Start with [VIEW_README.md](../VIEW_README.md) for a high-level overview
- **Looking for a specific component?** Use the [Component Index](#component-index) below
- **Need technical details?** Check the [Main README](../README.md) for in-depth information

---

## Documentation Structure

### 📄 Main Documentation

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[VIEW_README.md](../VIEW_README.md)** | High-level view architecture and getting started guide | Starting point for understanding the module |
| **[README.md](../README.md)** | Comprehensive technical documentation | Deep dive into implementation details |

### 📁 Component Categories

| Category | Document | Components Covered |
|----------|----------|-------------------|
| **Main Views** | [VIEWS_README.md](./VIEWS_README.md) | WorktimeUsage.vue, WorktimeUsageEmployee.vue |
| **Navigation** | [NAVIGATION_README.md](./NAVIGATION_README.md) | WorktimeButtonGroups.vue, UserBadge.vue |
| **Productivity** | [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md) | Team.vue, Individuals.vue, Graph.vue |
| **Distribution** | [DISTRIBUTION_README.md](./DISTRIBUTION_README.md) | Distribution.vue |
| **Summary** | [SUMMARY_README.md](./SUMMARY_README.md) | Index.vue, SBadge.vue, SBadgeGroup.vue, SBadgeIcon.vue, SBreadcrumb.vue, SActions.vue |

---

## Component Index

### Main View Containers

#### WorktimeUsage.vue
**File**: `src/views/worktimeUsage/_views/WorktimeUsage.vue`
**Purpose**: Main dashboard container for team-level worktime analytics
**Documentation**: [VIEWS_README.md](./VIEWS_README.md#worktimeusagevue)

**Key Features**:
- Team-level data management
- Provides `handlePerspective` to child components
- Route management for team/individual views
- Query parameter management

#### WorktimeUsageEmployee.vue
**File**: `src/views/worktimeUsage/_views/WorktimeUsageEmployee.vue`
**Purpose**: Individual employee dashboard container
**Documentation**: [VIEWS_README.md](./VIEWS_README.md#worktimeusageemployeevue)

**Key Features**:
- Employee-specific data management
- Simplified perspective handling
- Different API endpoint than team view

---

### Navigation Components

#### WorktimeButtonGroups.vue
**File**: `src/views/worktimeUsage/_components/WorktimeButtonGroups.vue`
**Purpose**: Dynamic navigation system for switching between views
**Documentation**: [NAVIGATION_README.md](./NAVIGATION_README.md#worktimebuttongroupsvue)

**Key Features**:
- Context-aware button display
- Active state management
- Teams vs Employees toggle
- Responsive layout

#### UserBadge.vue
**File**: `src/views/worktimeUsage/_components/UserBadge.vue`
**Purpose**: User profile display card
**Documentation**: [NAVIGATION_README.md](./NAVIGATION_README.md#userbadgevue)

**Key Features**:
- User avatar and name display
- Loading skeleton
- Responsive (hidden on mobile)

---

### Productivity Components

#### Team.vue
**File**: `src/views/worktimeUsage/_components/subPages/productivity/Team.vue`
**Purpose**: Team/member productivity data table
**Documentation**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#teamvue)

**Key Features**:
- Dual mode (teams/members)
- Interactive row navigation
- Time metrics display
- Pagination and sorting

#### Individuals.vue
**File**: `src/views/worktimeUsage/_components/subPages/productivity/Individuals.vue`
**Purpose**: Individual employees data table (read-only)
**Documentation**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#individualsvue)

**Key Features**:
- Employee-centric display
- Tags system
- Team association
- Read-only (no navigation)

#### Graph.vue
**File**: `src/views/worktimeUsage/_components/subPages/productivity/Graph.vue`
**Purpose**: Productivity graph visualization
**Documentation**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#graphvue)

**Key Features**:
- Stacked bar chart
- 24-hour timeline
- Color-coded categories
- Chart.js integration

---

### Distribution Components

#### Distribution.vue
**File**: `src/views/worktimeUsage/_components/subPages/distribution/Distribution.vue`
**Purpose**: Time distribution visualization with pie charts
**Documentation**: [DISTRIBUTION_README.md](./DISTRIBUTION_README.md)

**Key Features**:
- Multiple doughnut charts
- Application breakdown lists
- Color-coded segments
- Empty state handling

---

### Summary Components

#### Index.vue (Summary Container)
**File**: `src/views/worktimeUsage/_components/summary/Index.vue`
**Purpose**: Container for summary information
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#indexvue)

**Key Features**:
- Layout orchestration
- Combines breadcrumb, actions, and badges

#### SBadgeGroup.vue
**File**: `src/views/worktimeUsage/_components/summary/SBadgeGroup.vue`
**Purpose**: Collection of metric badges
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#sbadgegroupvue)

**Key Features**:
- Responsive grid layout
- Data transformation
- Badge rendering

#### SBadge.vue
**File**: `src/views/worktimeUsage/_components/summary/SBadge.vue`
**Purpose**: Individual metric badge
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#sbadgevue)

**Key Features**:
- Severity-based styling
- Color-coded borders and text
- Icon integration

#### SBadgeIcon.vue
**File**: `src/views/worktimeUsage/_components/summary/SBadgeIcon.vue`
**Purpose**: Icon component for badges
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#sbadgeiconvue)

**Key Features**:
- Circular avatar
- Color-coded backgrounds
- Tooltip support

#### SBreadcrumb.vue
**File**: `src/views/worktimeUsage/_components/summary/SBreadcrumb.vue`
**Purpose**: Hierarchical navigation path
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#sbreadcrumbvue)

**Key Features**:
- Navigation history
- Clickable path items
- Loading state

#### SActions.vue
**File**: `src/views/worktimeUsage/_components/summary/SActions.vue`
**Purpose**: Action controls (filters, date picker)
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#sactionsvue)

**Key Features**:
- Date range picker
- Perspective selector
- Download button
- Form validation

---

## Composables & Utilities

### useStaticBadge
**File**: `src/views/worktimeUsage/_composables/useStaticBadge.ts`
**Purpose**: Maps statistic types to badge configurations
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#usestaticbadge)

**Usage**:
```typescript
const { mapStatisticTypeToBadge } = useStaticBadge();
const badge = mapStatisticTypeToBadge('work', '8h 30m');
```

### severityMap
**File**: `src/views/worktimeUsage/_etc/severityMap.ts`
**Purpose**: Severity-to-class mapping constants
**Documentation**: [SUMMARY_README.md](./SUMMARY_README.md#severitymap)

**Usage**:
```typescript
import { SeverityMap } from '@/views/worktimeUsage/_etc/severityMap';
const className = `card-border-${SeverityMap[severity]}`;
```

---

## Component Relationships

### View Hierarchy

```
WorktimeUsage.vue (Team View)
├── UserBadge.vue
├── Summary (Index.vue)
│   ├── SBreadcrumb.vue
│   ├── SActions.vue
│   └── SBadgeGroup.vue
│       └── SBadge.vue
│           └── SBadgeIcon.vue
├── WorktimeButtonGroups.vue
└── <router-view>
    ├── Team.vue (productivity-team)
    ├── Individuals.vue (productivity-individuals)
    ├── Distribution.vue (distribution)
    └── Graph.vue (productivity-graph)
```

```
WorktimeUsageEmployee.vue (Employee View)
├── UserBadge.vue
├── Summary (Index.vue)
│   └── ... (same as team view)
├── WorktimeButtonGroups.vue
└── <router-view>
    ├── Distribution.vue (distribution)
    └── Graph.vue (productivity-graph)
```

### Data Flow

```
Store (useSectionsStore)
    ↓
Main Views (WorktimeUsage / WorktimeUsageEmployee)
    ↓
    ├→ UserBadge (Card data)
    ├→ Summary (Summary data)
    │   ├→ SBreadcrumb (Breadcrumb data)
    │   ├→ SActions (handles filtering)
    │   └→ SBadgeGroup (Summary data)
    │       └→ useStaticBadge (transforms data)
    │           └→ SBadge (displays badge)
    │               └→ SBadgeIcon (displays icon)
    └→ Child Views
        ├→ Team.vue (Teamset data)
        ├→ Individuals.vue (Individuals data)
        ├→ Distribution.vue (Distributions data)
        └→ Graph.vue (Graphs data)
```

---

## Common Tasks

### Finding Documentation for a Component

1. **Identify the component location**:
   - `_views/` → [VIEWS_README.md](./VIEWS_README.md)
   - `_components/` → [NAVIGATION_README.md](./NAVIGATION_README.md) (UserBadge, WorktimeButtonGroups)
   - `_components/subPages/productivity/` → [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md)
   - `_components/subPages/distribution/` → [DISTRIBUTION_README.md](./DISTRIBUTION_README.md)
   - `_components/summary/` → [SUMMARY_README.md](./SUMMARY_README.md)

2. **Search by feature**:
   - Navigation: [NAVIGATION_README.md](./NAVIGATION_README.md)
   - Data tables: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md)
   - Charts: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#graphvue) or [DISTRIBUTION_README.md](./DISTRIBUTION_README.md)
   - Metrics: [SUMMARY_README.md](./SUMMARY_README.md)

### Adding a New Component

1. **Identify the category**: Productivity, Distribution, Summary, etc.
2. **Read the relevant README**: Follow patterns from existing components
3. **Update the README**: Add documentation for your new component
4. **Update this index**: Add entry to the appropriate section

### Understanding Data Flow

1. Start with [VIEW_README.md - Data Flow](../VIEW_README.md#data-flow)
2. Review [VIEWS_README.md](./VIEWS_README.md) for parent component behavior
3. Check specific component README for data handling details

---

## Quick Reference

### File Paths

```
src/views/worktimeUsage/
├── README.md                          # Technical documentation
├── VIEW_README.md                     # View-level documentation
├── components/
│   ├── INDEX.md                       # This file
│   ├── VIEWS_README.md                # Main views
│   ├── NAVIGATION_README.md           # Navigation components
│   ├── PRODUCTIVITY_README.md         # Productivity components
│   ├── DISTRIBUTION_README.md         # Distribution components
│   └── SUMMARY_README.md              # Summary components
├── _views/
│   ├── WorktimeUsage.vue              # Team view
│   └── WorktimeUsageEmployee.vue      # Employee view
├── _components/
│   ├── UserBadge.vue                  # User profile
│   ├── WorktimeButtonGroups.vue       # Navigation buttons
│   ├── subPages/
│   │   ├── productivity/
│   │   │   ├── Team.vue               # Team table
│   │   │   ├── Individuals.vue        # Individuals table
│   │   │   └── Graph.vue              # Productivity graph
│   │   └── distribution/
│   │       └── Distribution.vue       # Distribution charts
│   └── summary/
│       ├── Index.vue                  # Summary container
│       ├── SBadge.vue                 # Metric badge
│       ├── SBadgeGroup.vue            # Badge collection
│       ├── SBadgeIcon.vue             # Badge icon
│       ├── SBreadcrumb.vue            # Navigation breadcrumb
│       └── SActions.vue               # Filter controls
├── _composables/
│   └── useStaticBadge.ts              # Badge mapping
└── _etc/
    └── severityMap.ts                 # Severity constants
```

---

## Navigation Tips

### By Component Type

- **Container Components**: [VIEWS_README.md](./VIEWS_README.md)
- **Navigation UI**: [NAVIGATION_README.md](./NAVIGATION_README.md)
- **Data Tables**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md)
- **Charts**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#graphvue), [DISTRIBUTION_README.md](./DISTRIBUTION_README.md)
- **Metrics Display**: [SUMMARY_README.md](./SUMMARY_README.md)

### By Feature

- **Routing**: [VIEWS_README.md](./VIEWS_README.md)
- **Data Fetching**: [VIEWS_README.md](./VIEWS_README.md), [SUMMARY_README.md](./SUMMARY_README.md#sactionsvue)
- **Navigation**: [NAVIGATION_README.md](./NAVIGATION_README.md)
- **Visualization**: [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#graphvue), [DISTRIBUTION_README.md](./DISTRIBUTION_README.md)
- **Filtering**: [SUMMARY_README.md](./SUMMARY_README.md#sactionsvue)

### By Development Task

- **Adding a new view**: [VIEWS_README.md](./VIEWS_README.md)
- **Adding a new chart**: [DISTRIBUTION_README.md](./DISTRIBUTION_README.md), [PRODUCTIVITY_README.md](./PRODUCTIVITY_README.md#graphvue)
- **Adding a new metric**: [SUMMARY_README.md](./SUMMARY_README.md#usestaticbadge)
- **Modifying navigation**: [NAVIGATION_README.md](./NAVIGATION_README.md#worktimebuttongroupsvue)

---

## Additional Resources

- **Project Guidelines**: See `/CLAUDE.md` in project root
- **Router Configuration**: See `src/router/routes.ts`
- **Store Documentation**: See `src/stores/worktimeUsage/section.ts`
- **Type Definitions**: See `src/interfaces/worktimeUsage/`

---

## Feedback & Updates

This documentation is maintained as part of the Worktime Usage module. When making changes to components:

1. Update the relevant component README
2. Update this index if adding/removing components
3. Keep code examples up to date with actual implementation
4. Add common issues and solutions as they're discovered

**Last Updated**: 2025-10-29

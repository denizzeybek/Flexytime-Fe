# Worktime Usage - View Level Documentation

## Overview

The Worktime Usage module provides a comprehensive dashboard for tracking, visualizing, and analyzing employee work time data. It supports both team-level and individual-level perspectives with multiple visualization modes.

## Quick Navigation

- **[Component Documentation](#component-documentation)** - Detailed component-specific READMEs
- **[Architecture](#architecture)** - High-level structure and design patterns
- **[Data Flow](#data-flow)** - How data moves through the application
- **[Getting Started](#getting-started)** - Quick start guide for developers

---

## Architecture

### Technology Stack

- **Framework**: Vue 3 Composition API with `<script setup>`
- **UI Components**: PrimeVue 4.x (DataTable, Chart, Card, etc.)
- **State Management**: Pinia store (`useSectionsStore`)
- **Routing**: Vue Router 4 with provide/inject pattern
- **Styling**: Tailwind CSS + component-scoped styles

### Module Structure

```
src/views/worktimeUsage/
├── _views/                    # Top-level route containers
│   ├── WorktimeUsage.vue      # Team dashboard container
│   └── WorktimeUsageEmployee.vue  # Employee dashboard container
│
├── _components/               # Reusable components
│   ├── UserBadge.vue          # User profile display
│   ├── WorktimeButtonGroups.vue   # Navigation buttons
│   │
│   ├── subPages/              # Sub-view components
│   │   ├── productivity/      # Productivity visualizations
│   │   │   ├── Team.vue       # Team/member data table
│   │   │   ├── Individuals.vue    # Individual employees table
│   │   │   └── Graph.vue      # Productivity graph charts
│   │   └── distribution/      # Distribution visualizations
│   │       └── Distribution.vue   # Time distribution pie charts
│   │
│   └── summary/               # Summary components
│       ├── Index.vue          # Summary container
│       ├── SActions.vue       # Action buttons
│       ├── SBadge.vue         # Metric badges
│       ├── SBadgeGroup.vue    # Badge groups
│       ├── SBadgeIcon.vue     # Badge icons
│       └── SBreadcrumb.vue    # Breadcrumb navigation
│
├── _composables/              # Shared composable functions
│   └── useStaticBadge.ts      # Badge mapping utility
│
├── _etc/                      # Constants and utilities
│   └── severityMap.ts         # Severity color mappings
│
├── composables/               # (Additional composables if needed)
├── types/                     # TypeScript type definitions
└── utils/                     # Utility functions
```

---

## Component Documentation

### Core Views

- **[WorktimeUsage.vue](./components/VIEWS_README.md#worktimeusagevue)** - Main team dashboard
- **[WorktimeUsageEmployee.vue](./components/VIEWS_README.md#worktimeusageemployeevue)** - Individual employee dashboard

### Navigation & Layout

- **[WorktimeButtonGroups.vue](./components/NAVIGATION_README.md#worktimebuttongroupsvue)** - View navigation system
- **[UserBadge.vue](./components/LAYOUT_README.md#userbadgevue)** - User profile card

### Productivity Components

- **[Team.vue](./components/PRODUCTIVITY_README.md#teamvue)** - Team/member data table
- **[Individuals.vue](./components/PRODUCTIVITY_README.md#individualsvue)** - Employee data table
- **[Graph.vue](./components/PRODUCTIVITY_README.md#graphvue)** - Productivity charts

### Distribution Components

- **[Distribution.vue](./components/DISTRIBUTION_README.md)** - Time distribution visualizations

### Summary Components

- **[Summary Components](./components/SUMMARY_README.md)** - All summary-related components

---

## Data Flow

### State Management

The module uses a centralized Pinia store: `useSectionsStore`

**Store Location**: `src/stores/worktimeUsage/section.ts`

**Key State Properties**:
```typescript
{
  Card: ICard;                    // User profile information
  Individuals: IIndividuals[];    // Individual employee data
  Summary: ISummary[];            // Summary statistics
  Breadcrumb: IBreadcrumb[];      // Navigation breadcrumbs
  Distributions: IDistributions[]; // Distribution chart data
  Graphs: IGraphs[];              // Graph visualization data
  Teamset: ITeamset;              // Team/member hierarchical data
  isLoading: boolean;             // Loading state
}
```

**Key Actions**:
- `filter(payload)` - Fetch team/section data
- `filterEmployee(payload)` - Fetch individual employee data
- `filterSection(payload)` - Alternative section filtering

### Data Flow Pattern

```
User Action (Click/Navigation)
    ↓
handlePerspective() in parent view
    ↓
Update route query parameters
    ↓
Store action triggered (filter/filterEmployee)
    ↓
API call to backend
    ↓
Store state updated
    ↓
Components reactively re-render
```

### Provide/Inject Pattern

The parent views (`WorktimeUsage.vue`, `WorktimeUsageEmployee.vue`) provide the `handlePerspective` function to all child components:

```typescript
// Parent provides
provide('handlePerspective', handlePerspective);

// Children inject
const handlePerspective = inject('handlePerspective') as (event: any) => void;
```

This allows deep component communication without prop drilling.

---

## Routing Structure

### Team Routes (`/clock/section/:id?`)

| Route Name | Component | Purpose |
|------------|-----------|---------|
| `WorktimeUsage` | `WorktimeUsage.vue` | Main container |
| `WorktimeUsageProductivityTeam` | `Team.vue` | Team productivity table |
| `WorktimeUsageProductivityIndividuals` | `Individuals.vue` | Individual employees table |
| `WorktimeUsageDistribution` | `Distribution.vue` | Distribution charts |
| `WorktimeUsageProductivityGraph` | `Graph.vue` | Productivity graphs |

### Employee Routes (`/clock/employee/:id?`)

| Route Name | Component | Purpose |
|------------|-----------|---------|
| `WorktimeUsageEmployee` | `WorktimeUsageEmployee.vue` | Main container |
| `WorktimeUsageDistributionEmployee` | `Distribution.vue` | Distribution charts |
| `WorktimeUsageProductivityGraphEmployee` | `Graph.vue` | Productivity graphs |

### Query Parameters

**Team View**:
```typescript
{
  perspective: number,  // View perspective identifier
  interval: string,     // Time interval filter
  teamId: string        // Selected team ID
}
```

**Individual View**:
```typescript
{
  perspective: number,  // View perspective identifier
  interval: string,     // Time interval filter
  memberId: string      // Selected member ID
}
```

---

## Getting Started

### Prerequisites

- Understanding of Vue 3 Composition API
- Familiarity with PrimeVue components
- Basic knowledge of Pinia state management

### Adding a New Sub-View

1. **Create the component** in `_components/subPages/[category]/`
2. **Register the route** in `src/router/routes.ts`
3. **Add navigation button** in `WorktimeButtonGroups.vue`
4. **Update store** if new data structure is needed

See [README.md](./README.md#adding-new-sub-view) for detailed examples.

### Common Development Patterns

#### Component Structure

```vue
<template>
  <Card>
    <template #content>
      <!-- Your content -->
    </template>
  </Card>
</template>

<script setup lang="ts">
// 1. Imports
import { computed } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';

// 2. Store composition
const sectionsStore = useSectionsStore();

// 3. Computed properties
const data = computed(() => sectionsStore.SomeData);

// 4. Event handlers
const handleAction = () => { /* ... */ };
</script>
```

#### Loading States

Always handle loading states with skeletons:

```vue
<template v-if="sectionsStore.isLoading">
  <Skeleton width="100%" height="100%" />
</template>
<template v-else-if="data?.length">
  <!-- Data content -->
</template>
<template v-else>
  <!-- Empty state -->
</template>
```

---

## API Integration

### Endpoints

- **Team/Section Data**: `/webapi/clock/section`
- **Individual Employee Data**: `/webapi/clock/employeev2`

### Request Payloads

**Team Section**:
```typescript
{
  interval: string;      // Time interval filter
  perspective: number;   // View perspective
  teamId: string | null; // Team identifier
}
```

**Employee**:
```typescript
{
  interval: string;      // Time interval filter
  perspective: number;   // View perspective
  memberId: string;      // Employee identifier
}
```

---

## Best Practices

### 1. Route Parameter Handling

```typescript
// ✅ Safe with validation
const teamId = route.query.teamId ?? '';
const perspective = Number(route.query.perspective) || 0;

// ❌ Dangerous - may cause type errors
const teamId = route.query.teamId;
```

### 2. Navigation Loop Prevention

```typescript
// ✅ Check current state before navigating
const handleTeamRoute = (data) => {
  const currentTeamId = route.query.teamId;
  if (!currentTeamId || currentTeamId !== data.ID) {
    handlePerspective(payload);
  }
};
```

### 3. Data Validation

```typescript
// ✅ Always validate data before rendering
<template v-if="distribution.applications?.length">
  <Chart :data="distribution.chart" />
</template>
<div v-else>
  <!-- No data state -->
</div>
```

### 4. Type Safety with Inject

```typescript
// ✅ Type assertion with fallback
const handlePerspective = inject('handlePerspective') as (event: any) => void;

// Or with validation
if (!handlePerspective) {
  console.error('handlePerspective not provided');
  return;
}
```

---

## Testing Considerations

- **Route Parameter Validation**: Test with missing/invalid query parameters
- **Data Loading States**: Verify skeleton components during API calls
- **Navigation Flow**: Test team → individual → team transitions
- **Chart Rendering**: Validate with empty/malformed chart data
- **Responsive Design**: Test UserBadge visibility on different screen sizes
- **Error Handling**: Test API failure scenarios
- **Provide/Inject**: Verify parent-child communication works correctly

---

## Troubleshooting

### Common Issues

1. **handlePerspective is undefined**
   - Ensure parent view provides it via `provide('handlePerspective', handlePerspective)`
   - Verify child components inject it correctly

2. **Data not loading**
   - Check query parameters are being passed correctly
   - Verify store action is being called
   - Check browser console for API errors

3. **Navigation not working**
   - Verify route names match those in `src/router/routeNames.enum.ts`
   - Check query parameters are in correct format

4. **Charts not rendering**
   - Ensure data is in correct format for Chart.js
   - Check for null/undefined data
   - Verify chart options are properly configured

---

## Related Documentation

- **[Main README](./README.md)** - Comprehensive technical documentation
- **[Component READMEs](./components/)** - Detailed component documentation
- **[Project CLAUDE.md](../../CLAUDE.md)** - Project-wide development guidelines

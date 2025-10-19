# Worktime Usage Module

This module manages the core functionality for tracking, visualizing, and analyzing employee work time data. It provides comprehensive dashboards for both team-level and individual-level productivity insights with multiple visualization modes (productivity tables, distribution charts, and graphs).

## Directory Structure

```
src/views/worktimeUsage/
├── _views/
│   ├── WorktimeUsage.vue          # Main team dashboard container
│   └── WorktimeUsageEmployee.vue  # Individual employee dashboard container
├── _components/
│   ├── UserBadge.vue              # User profile card display
│   ├── WorktimeButtonGroups.vue   # Navigation buttons for different views
│   ├── subPages/
│   │   ├── productivity/
│   │   │   ├── Team.vue           # Team productivity data table
│   │   │   ├── Individuals.vue    # Individual employees data table
│   │   │   └── Graph.vue          # Productivity graph visualization
│   │   └── distribution/
│   │       └── Distribution.vue   # Time distribution pie charts
│   └── summary/
│       ├── Index.vue              # Summary container component
│       ├── SActions.vue           # Action buttons for summary
│       ├── SBadge.vue             # Individual summary badge
│       ├── SBadgeGroup.vue        # Group of summary badges
│       ├── SBadgeIcon.vue         # Icon component for badges
│       └── SBreadcrumb.vue        # Navigation breadcrumb
├── _composables/
│   └── useStaticBadge.ts          # Utility for mapping statistic types to UI badges
└── _etc/
    └── severityMap.ts             # Severity color mapping constants
```

## File Responsibilities

### Main Views

#### `WorktimeUsage.vue`
**Purpose**: Main dashboard container for team-level worktime analytics

**Key Features**:
- Displays warning messages and notifications
- Renders user profile badge and summary components
- Provides navigation between different sub-views via `<router-view>`
- Manages perspective switching between team and individual views
- Handles query parameters for filtering (perspective, interval, teamId)

**Data Flow**:
- Uses `useSectionsStore` for team-level data management
- Provides `handlePerspective` function to child components via Vue's provide/inject
- Manages navigation between team and individual routes based on perspective

#### `WorktimeUsageEmployee.vue`
**Purpose**: Individual employee dashboard container

**Key Features**:
- Similar structure to team dashboard but focused on individual employee data
- Handles employee-specific data filtering and navigation
- Uses different API endpoint (`/webapi/clock/employeev2`) for individual data

### Core Components

#### `UserBadge.vue`
**Purpose**: Displays current user's profile information

**Features**:
- Shows user avatar, name, and basic info
- Implements loading skeleton during data fetch
- Responsive design (hidden on small screens)
- Data sourced from `sectionsStore.Card`

#### `WorktimeButtonGroups.vue`
**Purpose**: Dynamic navigation system for different worktime views

**Key Features**:
- Conditional button rendering based on current route (section vs employee)
- Toggle between "Employees" and "Teams" via SelectButton
- Automatic route switching when perspective changes
- Dynamic button states (active/outlined) based on current path

**Navigation Logic**:
```typescript
// Route determination based on context
const isSection = computed(() => route.path.includes('section'));

// Dynamic button configuration
const buttonProps = computed(() => {
  return [
    ...(isSection.value ? [/* Productivity button */] : []),
    { /* Distribution button */ },
    { /* Graph button */ }
  ];
});
```

### Sub-Page Components

#### `productivity/Team.vue`
**Purpose**: Displays team or individual productivity data in table format

**Key Features**:
- DataTable with pagination and sorting
- Conditional columns based on team vs individual view
- Clickable rows for navigation to deeper levels
- Time-based metrics display (Start, End, Work, Leisure, Meeting, Unclassified)
- Loading states with skeleton components

**Navigation Pattern**:
```typescript
const handleTeamRoute = (data) => {
  const payload = {
    perspective: route.query?.perspective,
    interval: route.query?.interval,
    teamId: data.ID,
  };
  handlePerspective(payload);
};

const handleIndividualRoute = (data) => {
  const payload = {
    perspective: route.query?.perspective,
    interval: route.query?.interval,
    memberId: data.ID,
    isIndividual: true
  };
  handlePerspective(payload);
};
```

#### `productivity/Individuals.vue`
**Purpose**: Displays individual employees in table format

**Features**:
- Employee-focused data table with team information
- Tags system for employee categorization
- Time metrics identical to team view
- Read-only view (no navigation clicks)

#### `distribution/Distribution.vue`
**Purpose**: Visualizes time distribution using pie charts

**Key Features**:
- Multiple doughnut charts for different statistic types
- Chart.js integration with custom styling
- Application breakdown alongside charts
- Dynamic color schemes for chart segments
- No data state handling with illustrations

**Chart Data Transformation**:
```typescript
const transformDataToChartFormat = (rawData) => {
  const colors = ['#06b6d4', '#FFC165', '#6b7280', ...];
  const labels = rawData.map(item => item.label);
  const data = rawData.map(item => item.value);
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: colors.slice(0, rawData.length),
      hoverBackgroundColor: hoverColors.slice(0, rawData.length),
    }],
  };
};
```

### Summary Components

#### `summary/Index.vue`
**Purpose**: Container for summary information display

**Layout Structure**:
- Header with breadcrumb navigation and action buttons
- Flexible layout with badge groups for metrics
- Card-based design for consistent UI

#### Summary Sub-Components
- **`SActions.vue`**: Action buttons for summary operations
- **`SBadge.vue`**: Individual metric badge display
- **`SBadgeGroup.vue`**: Groups multiple badges together
- **`SBadgeIcon.vue`**: Icon representation for different statistic types
- **`SBreadcrumb.vue`**: Navigation breadcrumb for current context

## Data Flow & State Management

### Store Integration

#### `useSectionsStore` (Primary Store)
**Location**: `src/stores/worktimeUsage/section.ts`

**State Structure**:
```typescript
interface State {
  Card: ICard;                    // User profile information
  Individuals?: IIndividuals[];   // Individual employee data
  Summary?: ISummary[];           // Summary statistics
  Breadcrumb?: IBreadcrumb[];     // Navigation breadcrumbs
  Distributions?: IDistributions[]; // Distribution chart data
  Graphs?: IGraphs[];             // Graph visualization data
  Teamset?: ITeamset;             // Team/member hierarchical data
  isLoading: boolean;             // Loading state
}
```

**API Actions**:
- `filter(payload)` - Team/section data via `/webapi/clock/section`
- `filterEmployee(payload)` - Individual data via `/webapi/clock/employeev2`
- `filterSection(payload)` - Alternative section filtering

### Data Flow Pattern

1. **Route Navigation** → Query parameters updated
2. **Component receives perspective change** → `handlePerspective` called
3. **Store action triggered** → API call with payload
4. **State updated** → Components reactively re-render
5. **Loading states managed** → Skeleton components during fetch

### Query Parameter Management

**Team View Parameters**:
```typescript
{
  perspective: number,    // View perspective identifier
  interval: string,      // Time interval filter
  teamId: string        // Selected team ID
}
```

**Individual View Parameters**:
```typescript
{
  perspective: number,    // View perspective identifier
  interval: string,      // Time interval filter
  memberId: string       // Selected member ID
}
```

## Routing & Navigation

### Route Structure

**Team Routes** (`/clock/section/:id?`):
- Base: `WorktimeUsage` → `WorktimeUsageProductivityTeam`
- Productivity Individuals: `WorktimeUsageProductivityIndividuals`
- Distribution: `WorktimeUsageDistribution`
- Graph: `WorktimeUsageProductivityGraph`

**Employee Routes** (`/clock/employee/:id?`):
- Base: `WorktimeUsageEmployee` → `WorktimeUsageDistributionEmployee`
- Graph: `WorktimeUsageProductivityGraphEmployee`

### Navigation Pattern

**Provide/Inject Pattern for Perspective Handling**:
```typescript
// Parent provides
provide('handlePerspective', handlePerspective);

// Children inject
const handlePerspective = inject('handlePerspective') as (event: any) => void;
```

This pattern allows deep component communication without prop drilling.

## Development Patterns

### Component Composition

**Standard Component Structure**:
```vue
<template>
  <!-- PrimeVue Card wrapper -->
  <Card>
    <template #content>
      <!-- DataTable or Chart content -->
    </template>
  </Card>
</template>

<script setup lang="ts">
// 1. Imports
// 2. Store composition
// 3. Computed properties
// 4. Event handlers
// 5. Reactive data transformations
</script>
```

### State Management Pattern

**Reactive Store Integration**:
```typescript
// Store composition
const sectionsStore = useSectionsStore();

// Reactive computed properties
const teams = computed(() => 
  isTeam.value ? sectionsStore.Teamset?.Teams : sectionsStore.Teamset?.Members
);

// Loading state management
const isLoading = computed(() => sectionsStore.isLoading);
```

### Data Transformation Pattern

**API Response to UI Data**:
```typescript
// Chart data transformation
const chartData = computed(() => {
  const distributions = sectionsStore.Distributions;
  return distributions?.map((distribution) => ({
    ...distribution,
    applications: distribution.Applications,
    chart: transformDataToChartFormat(distribution.Chart),
  }));
});
```

## Common Pitfalls

### 1. ⚠️ Route Parameter Handling
**Problem**: Query parameters can be undefined or strings when expecting numbers
```typescript
// ❌ Dangerous - may cause type errors
const teamId = route.query.teamId;

// ✅ Safe with validation
const teamId = route.query.teamId ?? '';
const perspective = Number(route.query.perspective) || 0;
```

### 2. 🔄 Navigation Loop Prevention
**Problem**: Clicking the same item repeatedly triggers unnecessary API calls
```typescript
// ✅ Check current state before navigating
const handleTeamRoute = (data) => {
  const currentTeamId = route.query.teamId;
  if (!currentTeamId || currentTeamId !== data.ID) {
    // Only navigate if different from current
    handlePerspective(payload);
  }
};
```

### 3. 📊 Chart Data Validation
**Problem**: Charts fail when data is undefined or malformed
```typescript
// ✅ Always validate data before rendering
<template v-if="distribution.applications?.length">
  <Chart :data="distribution.chart" />
</template>
<div v-else>
  <!-- No data state -->
</div>
```

### 4. 🎯 Inject/Provide Type Safety
**Problem**: Injected functions may be undefined
```typescript
// ✅ Type assertion with fallback
const handlePerspective = inject('handlePerspective') as (event: any) => void;

// Or with validation
const handlePerspective = inject('handlePerspective');
if (!handlePerspective) {
  console.error('handlePerspective not provided');
  return;
}
```

### 5. 🔄 Loading State Management
**Problem**: Components render empty state during loading
```typescript
// ✅ Always handle loading states
<template v-if="sectionsStore.isLoading">
  <Skeleton width="100%" height="100%" />
</template>
<template v-else-if="teams?.length">
  <!-- Data content -->
</template>
<template v-else>
  <!-- Empty state -->
</template>
```

## Code Examples

### Adding New Statistic Type

1. **Update Interface**:
```typescript
// src/interfaces/worktimeUsage/section.ts
export interface ISummary {
  statisticType: 'work' | 'meeting' | 'leisure' | 'unclassified' | 'newType';
  // ...
}
```

2. **Add Badge Mapping**:
```typescript
// src/views/worktimeUsage/_composables/useStaticBadge.ts
const mapping: Record<string, Omit<BadgeData, 'value'>> = {
  // ... existing mappings
  newType: {
    severity: 'info',
    title: 'New Type',
    icon: 'pi pi-star',
  },
};
```

3. **Update Severity Map** (if needed):
```typescript
// src/views/worktimeUsage/_etc/severityMap.ts
export const SeverityMap = {
  // ... existing
  newSeverity: 'new-severity',
};
```

### Creating New Sub-View

1. **Create Component**:
```vue
<!-- src/views/worktimeUsage/_components/subPages/newView/NewView.vue -->
<template>
  <Card>
    <template #content>
      <!-- Your content -->
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';

const sectionsStore = useSectionsStore();
const data = computed(() => sectionsStore.SomeData);
</script>
```

2. **Add Route**:
```typescript
// src/router/routes.ts - within WorktimeUsage children
{
  path: 'new-view',
  name: ERouteNames.WorktimeUsageNewView,
  component: NewView,
  meta: {
    title: ERouteNames.WorktimeUsage,
    name: ERouteNames.WorktimeUsage,
  }
}
```

3. **Update Button Groups**:
```typescript
// src/views/worktimeUsage/_components/WorktimeButtonGroups.vue
const buttonProps = computed(() => [
  // ... existing buttons
  {
    label: 'New View',
    routes: ['new-view'],
    icon: 'pi pi-new-icon',
    handleClick: () => {
      router.push({ name: ERouteNames.WorktimeUsageNewView });
    },
  },
]);
```

### Custom Chart Implementation

```vue
<template>
  <Card>
    <template #content>
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="w-full h-96"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Chart from 'primevue/chart';

const chartData = computed(() => {
  // Transform your store data
  return {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Work Hours',
      data: [65, 59, 80],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      tension: 0.4
    }]
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}));
</script>
```

## API Integration

### Request Payload Structure

**Team Section Request**:
```typescript
interface SectionPayload {
  interval: string;      // Time interval filter
  perspective: number;   // View perspective
  teamId: string | null; // Team identifier
}
```

**Employee Request**:
```typescript
interface EmployeePayload {
  interval: string;      // Time interval filter
  perspective: number;   // View perspective
  memberId: string;      // Employee identifier
}
```

### Response Data Structure

**Section Response** (`ISection`):
- `Card`: User profile information
- `Summary`: Metric summary badges
- `Individuals`: Individual employee data
- `Teamset`: Hierarchical team/member data
- `Distributions`: Time distribution charts
- `Breadcrumb`: Navigation context
- `WellBeings`: Wellness metrics
- `Invitations`: Team invitations
- `DownloadKey`: Export functionality

## Testing Considerations

- **Route Parameter Validation**: Test with missing/invalid query parameters
- **Data Loading States**: Verify skeleton components during API calls
- **Navigation Flow**: Test team → individual → team transitions
- **Chart Rendering**: Validate with empty/malformed chart data
- **Responsive Design**: Test UserBadge visibility on different screen sizes
- **Error Handling**: Test API failure scenarios
- **Provide/Inject**: Verify parent-child communication works correctly
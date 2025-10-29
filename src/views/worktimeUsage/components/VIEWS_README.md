# Main View Components

This document covers the top-level container components that serve as route entry points for the Worktime Usage module.

## Table of Contents

- [WorktimeUsage.vue](#worktimeusagevue)
- [WorktimeUsageEmployee.vue](#worktimeusageemployeevue)

---

## WorktimeUsage.vue

**File**: `src/views/worktimeUsage/_views/WorktimeUsage.vue`

### Purpose

Main dashboard container for **team-level** worktime analytics. This component serves as the entry point for all team-based views and provides the navigation structure for exploring team productivity, distribution, and graphs.

### Key Responsibilities

1. **Layout Management**: Renders the main layout with UserBadge, Summary, and navigation buttons
2. **Perspective Handling**: Provides `handlePerspective` function to all child components
3. **Route Management**: Handles navigation between team and individual views
4. **Data Fetching**: Triggers store actions to fetch team or individual data
5. **Query Parameter Management**: Manages URL query parameters for filtering

### Component Structure

```vue
<template>
  <!-- Warning/Info Messages Area -->
  <div id="messages-area">
    <Message severity="warn" icon="pi pi-exclamation-triangle">
      Info Message
    </Message>
  </div>

  <!-- User Profile & Summary Section -->
  <section>
    <div class="flex gap-4 h-full w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>

  <!-- Navigation Buttons -->
  <WorktimeButtonGroups />

  <!-- Child Route Views (Productivity, Distribution, Graph) -->
  <router-view />
</template>
```

### State Management

```typescript
const payload = ref({
  interval: '',       // Time interval filter
  perspective: 0,     // View perspective identifier
  teamId: null,       // Selected team ID (null for root level)
});
```

### Key Functions

#### `fetchSection()`

Fetches team/section data from the store.

```typescript
const fetchSection = async () => {
  try {
    await sectionsStore.filter(payload.value);
  } catch (error) {
    // Error handling
  }
};
```

#### `fetchIndividual()`

Fetches individual employee data from the store.

```typescript
const fetchIndividual = async () => {
  try {
    await sectionsStore.filterEmployee(payload.value);
  } catch (error) {
    // Error handling
  }
};
```

#### `handlePerspective(event)`

**Critical Function**: Handles navigation between different perspectives (team vs individual).

```typescript
const handlePerspective = (event: any) => {
  payload.value = event;
  payload.value.interval = ''; // TODO: remove when interval format changed

  let isIndividual = false;
  if (event.isIndividual) {
    isIndividual = true;
  }

  if (!isIndividual) {
    // Team perspective - stay on section routes
    const query = {
      perspective: event.perspective,
      interval: event.interval,
      teamId: event.teamId ?? '',
    };

    // Filter out empty values
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null && v !== '')
    );

    router.push({ query });
    fetchSection();
  } else {
    // Individual perspective - navigate to employee routes
    const query = {
      perspective: event.perspective,
      interval: event.interval,
      memberId: event.memberId ?? '',
    };

    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v != null && v !== '')
    );

    router.push({
      name: ERouteNames.WorktimeUsageDistributionEmployee,
      query,
    });
    fetchIndividual();
  }
};

// Provide to child components
provide('handlePerspective', handlePerspective);
```

### Data Flow

```
User clicks on a team/employee
    ↓
Child component calls handlePerspective({ teamId: 'xxx' })
    ↓
WorktimeUsage updates payload and query params
    ↓
Router navigates to new route
    ↓
fetchSection() or fetchIndividual() called
    ↓
Store fetches data from API
    ↓
Child components re-render with new data
```

### Child Routes

All these routes are nested under `WorktimeUsage.vue`:

| Route Name | Component | Query Params |
|------------|-----------|--------------|
| `WorktimeUsageProductivityTeam` | `Team.vue` | `perspective`, `interval`, `teamId` |
| `WorktimeUsageProductivityIndividuals` | `Individuals.vue` | `perspective`, `interval`, `teamId` |
| `WorktimeUsageDistribution` | `Distribution.vue` | `perspective`, `interval`, `teamId` |
| `WorktimeUsageProductivityGraph` | `Graph.vue` | `perspective`, `interval`, `teamId` |

### Dependencies

```typescript
import UserBadge from '@/views/worktimeUsage/_components/UserBadge.vue';
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';
import WorktimeButtonGroups from '@/views/worktimeUsage/_components/WorktimeButtonGroups.vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
```

### Usage Notes

1. **Query Parameter Format**: All query parameters are strings, convert numbers when needed
2. **Interval TODO**: There's a known TODO to handle interval format changes
3. **Route Switching**: When clicking an individual employee, the route changes to the employee path
4. **Provide/Inject**: This component provides `handlePerspective` to ALL descendant components

### Common Pitfalls

❌ **Don't**: Assume query parameters are numbers
```typescript
const teamId = route.query.teamId; // May be string or undefined
```

✅ **Do**: Validate and convert types
```typescript
const teamId = route.query.teamId ?? '';
const perspective = Number(route.query.perspective) || 0;
```

❌ **Don't**: Navigate without checking current state
```typescript
handlePerspective(payload); // May cause duplicate API calls
```

✅ **Do**: Check if navigation is needed
```typescript
if (currentTeamId !== newTeamId) {
  handlePerspective(payload);
}
```

### Related Components

- [UserBadge.vue](./LAYOUT_README.md#userbadgevue) - User profile display
- [Summary](./SUMMARY_README.md) - Summary badges and metrics
- [WorktimeButtonGroups](./NAVIGATION_README.md) - Navigation buttons

---

## WorktimeUsageEmployee.vue

**File**: `src/views/worktimeUsage/_views/WorktimeUsageEmployee.vue`

### Purpose

Individual employee dashboard container. This component serves as the entry point for **individual employee** analytics, showing personal productivity, distribution, and graphs.

### Key Differences from WorktimeUsage.vue

| Feature | WorktimeUsage.vue | WorktimeUsageEmployee.vue |
|---------|-------------------|---------------------------|
| **Route Path** | `/clock/section/:id?` | `/clock/employee/:id?` |
| **Data Source** | `/webapi/clock/section` | `/webapi/clock/employeev2` |
| **Query Param** | `teamId` | `memberId` |
| **Navigation** | Can navigate to teams or individuals | Only individual data |
| **Perspective Switching** | Supports team ↔ individual | Individual only |

### Component Structure

**Identical layout to `WorktimeUsage.vue`**:

```vue
<template>
  <!-- Warning/Info Messages Area -->
  <div id="messages-area">
    <Message severity="warn" icon="pi pi-exclamation-triangle">
      Info Message
    </Message>
  </div>

  <!-- User Profile & Summary Section -->
  <section>
    <div class="flex gap-4 h-full w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>

  <!-- Navigation Buttons -->
  <WorktimeButtonGroups />

  <!-- Child Route Views -->
  <router-view />
</template>
```

### State Management

```typescript
const payload = ref({
  interval: '2',      // Default interval
  perspective: 0,     // View perspective identifier
  teamId: null,       // Not used in employee view
});
```

### Key Functions

#### `fetchIndividual()`

Fetches individual employee data using the employee-specific endpoint.

```typescript
const fetchIndividual = async () => {
  try {
    await sectionsStore.filterEmployee(payload.value);
  } catch (error) {
    // Error handling
  }
};
```

#### `handlePerspective(event)`

**Simplified version** - only handles individual perspective:

```typescript
const handlePerspective = (event: any) => {
  payload.value = event;
  payload.value.interval = ''; // TODO: remove when interval format changed

  // Build query parameters
  const query = {
    perspective: event.perspective,
    interval: event.interval,
    memberId: event.memberId ?? '',
  };

  // Filter out empty values
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, v]) => v != null && v !== '')
  );

  // Update route and fetch data
  router.push({ query });
  fetchIndividual();
};

// Provide to child components
provide('handlePerspective', handlePerspective);
```

### Data Flow

```
User navigates to employee view
    ↓
WorktimeUsageEmployee receives memberId from route
    ↓
handlePerspective updates query params
    ↓
fetchIndividual() fetches employee data via store
    ↓
Store calls /webapi/clock/employeev2
    ↓
Child components render employee-specific data
```

### Child Routes

All these routes are nested under `WorktimeUsageEmployee.vue`:

| Route Name | Component | Query Params |
|------------|-----------|--------------|
| `WorktimeUsageDistributionEmployee` | `Distribution.vue` | `perspective`, `interval`, `memberId` |
| `WorktimeUsageProductivityGraphEmployee` | `Graph.vue` | `perspective`, `interval`, `memberId` |

**Note**: Employee view has **fewer child routes** than team view (no team/individuals tables).

### Dependencies

**Same as `WorktimeUsage.vue`**:

```typescript
import UserBadge from '@/views/worktimeUsage/_components/UserBadge.vue';
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';
import WorktimeButtonGroups from '@/views/worktimeUsage/_components/WorktimeButtonGroups.vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';
```

### API Endpoint

**Employee-specific endpoint**:
- **URL**: `/webapi/clock/employeev2`
- **Method**: POST
- **Payload**: `{ perspective, interval, memberId }`

**Response**: Same structure as team endpoint but with individual-specific data.

### Usage Notes

1. **Default Interval**: Sets `interval: '2'` by default (may need adjustment)
2. **No Team Navigation**: This view doesn't support navigating to team views
3. **Simplified Logic**: No need to check `isIndividual` flag
4. **Route Persistence**: Query parameters persist across sub-view navigation

### Common Use Cases

#### 1. Direct Employee Link

```typescript
// Navigate directly to an employee's dashboard
router.push({
  name: ERouteNames.WorktimeUsageDistributionEmployee,
  query: {
    perspective: 1,
    interval: '2',
    memberId: 'abc123'
  }
});
```

#### 2. From Team View

```typescript
// Triggered when clicking an employee in Team.vue
handlePerspective({
  perspective: route.query.perspective,
  interval: route.query.interval,
  memberId: 'abc123',
  isIndividual: true  // Triggers navigation to employee view
});
```

### Related Components

- [Distribution.vue](./DISTRIBUTION_README.md) - Shared with team view
- [Graph.vue](./PRODUCTIVITY_README.md#graphvue) - Shared with team view
- [WorktimeButtonGroups](./NAVIGATION_README.md) - Navigation (employee mode)

---

## Comparison Summary

| Aspect | WorktimeUsage.vue | WorktimeUsageEmployee.vue |
|--------|-------------------|---------------------------|
| **Purpose** | Team-level analytics | Individual employee analytics |
| **Route** | `/clock/section/:id?` | `/clock/employee/:id?` |
| **API Endpoint** | `/webapi/clock/section` | `/webapi/clock/employeev2` |
| **Query Param** | `teamId` | `memberId` |
| **Child Routes** | 4 (Team, Individuals, Distribution, Graph) | 2 (Distribution, Graph) |
| **Perspective Switching** | Team ↔ Individual | Individual only |
| **Default Interval** | Empty string `''` | `'2'` |
| **Navigation Logic** | Complex (checks isIndividual flag) | Simple (always individual) |

---

## Best Practices

### 1. Provide/Inject Pattern

Both views use the same pattern for `handlePerspective`:

```typescript
// Parent
provide('handlePerspective', handlePerspective);

// Child
const handlePerspective = inject('handlePerspective') as (event: any) => void;
```

**Why?**: Avoids prop drilling through multiple component layers.

### 2. Query Parameter Management

Always filter out empty values:

```typescript
const filteredQuery = Object.fromEntries(
  Object.entries(query).filter(([_, v]) => v != null && v !== '')
);
```

**Why?**: Prevents ugly URLs like `?teamId=&interval=&perspective=0`

### 3. Error Handling

Both views catch errors silently:

```typescript
try {
  await sectionsStore.filter(payload.value);
} catch (error) {
  // Silent error handling
}
```

**Consider**: Adding proper error states and user notifications.

### 4. Interval TODO

Both files have this TODO comment:

```typescript
payload.value.interval = ''; // TODO: remove here when interval format changed
```

**Action Needed**: Review interval format requirements and update accordingly.

---

## Testing Checklist

- [ ] Navigation from team to individual works
- [ ] Navigation from individual back to team works
- [ ] Query parameters persist correctly
- [ ] Data loads correctly for both team and employee views
- [ ] Loading states show during API calls
- [ ] Error states handle API failures gracefully
- [ ] Child components receive `handlePerspective` via inject
- [ ] Route changes trigger correct store actions
- [ ] Empty query parameters are handled correctly
- [ ] Default values work when no query params present

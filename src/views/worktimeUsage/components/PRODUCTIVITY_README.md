# Productivity Components

This document covers the productivity visualization components that display team and individual work time data.

## Table of Contents

- [Team.vue](#teamvue) - Team/member productivity table
- [Individuals.vue](#individualsvue) - Individual employees table
- [Graph.vue](#graphvue) - Productivity graph visualization

---

## Team.vue

**File**: `src/views/worktimeUsage/_components/subPages/productivity/Team.vue`

### Purpose

Displays team or member productivity data in an interactive table format. This component adapts its behavior based on whether it's showing teams or individual members within a team, allowing drill-down navigation through the organizational hierarchy.

### Key Features

1. **Dual Mode**: Shows either teams or members based on context
2. **Interactive Rows**: Click rows to navigate deeper into hierarchy
3. **Time Metrics**: Displays Start, End, Work, Leisure, Meeting, Unclassified times
4. **Pagination**: Built-in pagination with configurable page sizes
5. **Sorting**: Sortable columns for better data exploration
6. **Loading States**: Integrated with store loading state

### Component Structure

```vue
<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="sectionsStore.isLoading"
        :value="teams"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <!-- Columns... -->
      </DataTable>
    </template>
  </Card>
</template>
```

### Props & Emits

**No props or emits** - Component uses inject for `handlePerspective` and store for data.

### State & Computed

#### `sectionsStore`

```typescript
const sectionsStore = useSectionsStore();
```

#### `isTeam`

Determines if showing teams or members.

```typescript
const isTeam = computed(() => sectionsStore.Teamset?.IsTeam);
// true: Showing teams
// false: Showing members
```

#### `teams`

Returns appropriate data based on mode.

```typescript
const teams = computed(() =>
  isTeam.value
    ? sectionsStore.Teamset?.Teams
    : sectionsStore.Teamset?.Members
);
```

**Data Structure**:
```typescript
interface TeamMember {
  ID: string;
  Team: {
    Name: string;
    Abbreviation: string;
  };
  Employee?: {
    Name: string;
    Abbreviation: string;
  };
  Supervisor?: {
    Name: string;
    Abbreviation: string;
  };
  Start: { time: string };
  End: { time: string };
  Work: { time: string };
  Leisure: { time: string };
  Meeting: { time: string };
  Unclassified: { time: string };
}
```

#### `handlePerspective`

Injected from parent view.

```typescript
const handlePerspective = inject('handlePerspective') as (event: any) => void;
```

### Column Configuration

| Column | Shown | Sortable | Field | Behavior |
|--------|-------|----------|-------|----------|
| **Name** | Members only | ✅ | `Employee` | Click → Navigate to individual |
| **Team** | Always | ✅ | `Team` | Click → Navigate to team |
| **Supervisor** | Teams only | ✅ | `Supervisor` | Display only |
| **Start** | Always | ✅ | `Start` | Display time |
| **End** | Always | ❌ | `End` | Display time |
| **Work** | Always | ❌ | `Work` | Display time |
| **Leisure** | Always | ❌ | `Leisure` | Display time |
| **Meeting** | Always | ❌ | `Meeting` | Display time |
| **Unclassified** | Always | ❌ | `Unclassified` | Display time |

### Column Templates

#### Name Column (Members Only)

```vue
<Column v-if="!isTeam" sortable field="Employee" header="Name">
  <template #body="slotProps">
    <div @click="handleIndividualRoute(slotProps.data)" class="flex items-center gap-3 cursor-pointer">
      <FAvatar :label="slotProps.data.Employee?.Abbreviation ?? ''" />
      <FText>{{ slotProps.data.Employee.Name }}</FText>
    </div>
  </template>
</Column>
```

**Features**:
- Shows avatar with employee abbreviation
- Clickable - navigates to individual view
- Cursor pointer indicates interactivity

#### Team Column

```vue
<Column sortable field="Team" header="Team">
  <template #body="slotProps">
    <div @click="handleTeamRoute(slotProps.data)" class="flex items-center gap-3 cursor-pointer">
      <FAvatar
        v-if="slotProps.data.Team?.Abbreviation"
        :label="slotProps.data.Team?.Abbreviation ?? ''"
      />
      <FText>{{ slotProps.data.Team.Name }}</FText>
    </div>
  </template>
</Column>
```

**Features**:
- Shows team avatar (conditionally)
- Clickable - navigates to team detail
- Cursor pointer indicates interactivity

#### Supervisor Column (Teams Only)

```vue
<Column v-if="isTeam" sortable field="Supervisor" header="Supervisor">
  <template #body="slotProps">
    <div class="flex items-center gap-3">
      <FAvatar :label="slotProps.data.Supervisor?.Abbreviation ?? ''" />
      <FText>{{ slotProps.data.Supervisor.Name }}</FText>
    </div>
  </template>
</Column>
```

**Features**:
- Read-only (no click handler)
- Shows supervisor information

#### Time Columns

All time columns follow this pattern:

```vue
<Column field="Work" header="Work">
  <template #body="slotProps">
    <div class="flex items-center gap-3">
      <FText as="h6">{{ slotProps.data.Work.time }}</FText>
    </div>
  </template>
</Column>
```

**Time Format**: String (e.g., "8h 30m", "45m", "2h")

### Navigation Handlers

#### `handleTeamRoute(data)`

Navigates to a specific team's view.

```typescript
const handleTeamRoute = (data) => {
  const { ID } = data;
  const currentTeamId = route.query.teamId;

  // Prevent duplicate navigation
  if (!currentTeamId || currentTeamId !== ID) {
    const payload = {
      perspective: route.query?.perspective,
      interval: route.query?.interval,
      teamId: ID,
    };
    handlePerspective(payload);
  }
};
```

**Behavior**:
1. Extracts team ID from clicked row
2. Checks if already viewing this team (prevents duplicate API calls)
3. Builds payload with current query params + new teamId
4. Calls `handlePerspective` which updates route and fetches data

#### `handleIndividualRoute(data)`

Navigates to a specific employee's individual view.

```typescript
const handleIndividualRoute = (data) => {
  const { ID } = data;
  const currentTeamId = route.query.teamId;

  // Prevent duplicate navigation
  if (!currentTeamId || currentTeamId !== ID) {
    const payload = {
      perspective: route.query?.perspective,
      interval: route.query?.interval,
      memberId: ID,
      isIndividual: true  // Triggers switch to employee view
    };
    handlePerspective(payload);
  }
};
```

**Behavior**:
1. Extracts member ID from clicked row
2. Checks if already viewing this member
3. Builds payload with `isIndividual: true` flag
4. Calls `handlePerspective` which switches to employee route

### Table Footer

```vue
<template #footer>
  In total there are {{ teams ? teams.length : 0 }} teams.
</template>
```

Shows total count of items (teams or members).

### Pagination Configuration

```vue
<DataTable
  :rows="5"
  :rowsPerPageOptions="[5, 10, 20, 50]"
  paginator
>
```

**Options**:
- Default: 5 rows per page
- Selectable: 5, 10, 20, or 50 rows per page

### Loading State

```vue
<DataTable :loading="sectionsStore.isLoading">
```

**Visual**: PrimeVue DataTable shows a loading spinner overlay when `true`.

### Data Flow

```
User clicks on a team row
    ↓
handleTeamRoute(data) extracts team ID
    ↓
Check if different from current team
    ↓
Build payload: { perspective, interval, teamId }
    ↓
handlePerspective(payload) - injected from parent
    ↓
Parent updates route query: ?perspective=X&interval=Y&teamId=Z
    ↓
Parent calls sectionsStore.filter(payload)
    ↓
API fetches new team data
    ↓
Store updates Teamset with new data
    ↓
Component re-renders with new teams/members
```

### Usage Examples

#### Team View

**Data**:
```
┌─────────────┬────────────────┬────────┬─────────┬──────┐
│ Team        │ Supervisor     │ Start  │ End     │ Work │
├─────────────┼────────────────┼────────┼─────────┼──────┤
│ Engineering │ John Doe       │ 09:00  │ 18:00   │ 7h   │
│ Marketing   │ Jane Smith     │ 08:30  │ 17:30   │ 8h   │
└─────────────┴────────────────┴────────┴─────────┴──────┘
```

**Click "Engineering"** → Navigates to Engineering team details

#### Member View

**Data**:
```
┌──────────────┬─────────────┬────────┬─────────┬──────┐
│ Name         │ Team        │ Start  │ End     │ Work │
├──────────────┼─────────────┼────────┼─────────┼──────┤
│ Alice Brown  │ Engineering │ 09:15  │ 18:30   │ 7h   │
│ Bob Johnson  │ Engineering │ 08:45  │ 17:45   │ 8h   │
└──────────────┴─────────────┴────────┴─────────┴──────┘
```

**Click "Alice Brown"** → Navigates to Alice's individual dashboard

### Best Practices

✅ **Do**: Let the component manage its own navigation logic
```typescript
// Component handles click internally
<div @click="handleTeamRoute(data)">
```

✅ **Do**: Check for duplicate navigation
```typescript
if (!currentTeamId || currentTeamId !== ID) {
  handlePerspective(payload);
}
```

❌ **Don't**: Directly mutate store data
```typescript
// ❌ Don't do this
sectionsStore.Teamset.Teams = newData;

// ✅ Do this
sectionsStore.filter(payload); // Let store handle it
```

✅ **Do**: Preserve query parameters during navigation
```typescript
const payload = {
  perspective: route.query?.perspective,  // Preserve
  interval: route.query?.interval,        // Preserve
  teamId: ID,                             // New
};
```

### Common Issues

#### Issue 1: Rows Not Clickable

**Cause**: Missing `cursor-pointer` class or click handler.

**Solution**:
```vue
<div @click="handleTeamRoute(data)" class="cursor-pointer">
```

#### Issue 2: Duplicate API Calls

**Cause**: Clicking the same row multiple times.

**Solution**: Already handled by checking `currentTeamId !== ID`.

#### Issue 3: Time Data Not Showing

**Cause**: Time object structure doesn't match expected format.

**Expected**:
```typescript
{ time: "8h 30m" }
```

**Check**:
```typescript
console.log('Time data:', slotProps.data.Work);
```

#### Issue 4: Avatar Not Showing

**Cause**: `Abbreviation` field is empty or undefined.

**Solution**: Fallback already in place (`?? ''`), check if `FAvatar` component handles empty strings.

### Dependencies

```typescript
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useRoute } from 'vue-router';
import { computed, inject } from 'vue';
```

**External Components**:
- `FAvatar` - Custom avatar component
- `FText` - Custom text component
- PrimeVue `DataTable`, `Column`, `Card`

### Related Components

- [Individuals.vue](#individualsvue) - Read-only version of employee table
- [WorktimeUsage.vue](./VIEWS_README.md#worktimeusagevue) - Parent view providing `handlePerspective`

---

## Individuals.vue

**File**: `src/views/worktimeUsage/_components/subPages/productivity/Individuals.vue`

### Purpose

Displays individual employees in a **read-only** table format. Similar to `Team.vue` but focused on employee-centric data with tags and team information, without navigation functionality.

### Key Features

1. **Read-Only**: No click navigation (display only)
2. **Employee Focus**: Shows employee names and profiles
3. **Team Association**: Displays which team each employee belongs to
4. **Tags System**: Shows employee tags/categories
5. **Time Metrics**: Same time tracking as Team.vue
6. **Pagination & Sorting**: Configurable data table features

### Component Structure

```vue
<template>
  <Card>
    <template #content>
      <DataTable
        tableStyle="min-width: 50rem"
        paginator
        :loading="isLoading"
        :value="individuals"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
      >
        <!-- Columns... -->
      </DataTable>
    </template>
  </Card>
</template>
```

### Props

```typescript
interface IProps {
  isLoading: boolean;  // External loading state control
}

defineProps<IProps>();
```

**Note**: Unlike `Team.vue`, this component accepts a prop for loading state instead of reading from store.

### State & Computed

```typescript
const sectionsStore = useSectionsStore();

const individuals = computed(() => sectionsStore.Individuals);
```

**Data Structure**:
```typescript
interface Individual {
  ID: string;
  Employee: {
    Name: string;
    Abbreviation: string;
  };
  TeamName: string;  // String field, not object
  Tags: string[];
  Start: { time: string };
  End: { time: string };
  Work: { time: string };
  Leisure: { time: string };
  Meeting: { time: string };
  Unclassified: { time: string };
}
```

### Column Configuration

| Column | Sortable | Field | Display |
|--------|----------|-------|---------|
| **Name** | ✅ | `Employee` | Avatar + Name |
| **TeamName** | ✅ | `TeamName` | Text field |
| **Tags** | ✅ | `Tags` | Tag chips |
| **Start** | ❌ | `Start` | Time |
| **End** | ❌ | `End` | Time |
| **Work** | ❌ | `Work` | Time |
| **Leisure** | ❌ | `Leisure` | Time |
| **Meeting** | ❌ | `Meeting` | Time |
| **Unclassified** | ❌ | `Unclassified` | Time |

### Key Differences from Team.vue

| Feature | Team.vue | Individuals.vue |
|---------|----------|-----------------|
| **Click Navigation** | ✅ Yes | ❌ No (read-only) |
| **Cursor Style** | `cursor-pointer` | Default (no pointer) |
| **Loading State** | From store | From props |
| **Team Field** | Object (`Team.Name`) | String (`TeamName`) |
| **Tags Display** | ❌ Not shown | ✅ Shown |
| **Inject handlePerspective** | ✅ Yes | ❌ No (not needed) |

### Column Templates

#### Name Column

```vue
<Column sortable field="Employee" header="Name">
  <template #body="slotProps">
    <div class="flex items-center gap-3">
      <FAvatar :label="slotProps.data.Employee?.Abbreviation ?? ''" />
      <FText>{{ slotProps.data.Employee.Name }}</FText>
    </div>
  </template>
</Column>
```

**Note**: No `@click` handler - read-only display.

#### TeamName Column

```vue
<Column sortable field="TeamName" header="TeamName"></Column>
```

**Simple text field** - no custom template needed.

#### Tags Column

```vue
<Column sortable field="Tags" header="Tags">
  <template #body="slotProps">
    <div class="flex items-center gap-3">
      <Tag
        v-for="(tag, idx) in slotProps.data.Tags"
        :key="idx"
        :value="tag"
      />
    </div>
  </template>
</Column>
```

**Features**:
- Displays multiple tags as chips
- Uses PrimeVue `Tag` component
- Flex layout for horizontal spacing

#### Time Columns

Same structure as `Team.vue`:

```vue
<Column field="Work" header="Work">
  <template #body="slotProps">
    <div class="flex items-center gap-3">
      <FText as="h6">{{ slotProps.data.Work.time }}</FText>
    </div>
  </template>
</Column>
```

### Table Footer

```vue
<template #footer>
  In total there are {{ individuals ? individuals.length : 0 }} individuals.
</template>
```

### Usage Example

**Parent Component**:

```vue
<template>
  <Individuals :isLoading="sectionsStore.isLoading" />
</template>

<script setup lang="ts">
import Individuals from './productivity/Individuals.vue';
import { useSectionsStore } from '@/stores/worktimeUsage/section';

const sectionsStore = useSectionsStore();
</script>
```

### Data Display Example

```
┌──────────────┬─────────────┬─────────────┬────────┬──────┐
│ Name         │ TeamName    │ Tags        │ Start  │ Work │
├──────────────┼─────────────┼─────────────┼────────┼──────┤
│ Alice Brown  │ Engineering │ [Senior]    │ 09:15  │ 7h   │
│ Bob Johnson  │ Engineering │ [Junior]    │ 08:45  │ 8h   │
│ Carol White  │ Marketing   │ [Lead]      │ 09:00  │ 7.5h │
└──────────────┴─────────────┴─────────────┴────────┴──────┘
```

### Best Practices

✅ **Do**: Use this for display-only individual data
```vue
<Individuals :isLoading="isLoading" />
```

✅ **Do**: Pass loading state from parent
```vue
:isLoading="sectionsStore.isLoading"
```

❌ **Don't**: Expect navigation functionality
```typescript
// This component doesn't support click navigation
```

✅ **Do**: Ensure Tags is an array
```typescript
// Expected
Tags: ["Senior", "Frontend"]

// Not
Tags: "Senior, Frontend" // ❌ String won't render correctly
```

### Common Issues

#### Issue 1: Tags Not Rendering

**Cause**: Tags field is not an array.

**Solution**: Ensure API returns tags as array:
```typescript
Tags: string[] // ✅
```

#### Issue 2: TeamName vs Team Object

**Cause**: Confusing with `Team.vue` which uses `Team.Name`.

**Note**: This component uses flat `TeamName` string field.

```typescript
// Individuals.vue
TeamName: "Engineering" // ✅ String

// Team.vue
Team: { Name: "Engineering" } // Object
```

#### Issue 3: Loading State Not Working

**Cause**: Not passing `isLoading` prop.

**Solution**:
```vue
<Individuals :isLoading="sectionsStore.isLoading" />
```

### Dependencies

```typescript
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { computed } from 'vue';
```

**External Components**:
- `FAvatar`, `FText` - Custom components
- PrimeVue `DataTable`, `Column`, `Card`, `Tag`

### Related Components

- [Team.vue](#teamvue) - Interactive version with navigation
- [WorktimeUsage.vue](./VIEWS_README.md#worktimeusagevue) - Parent view

---

## Graph.vue

**File**: `src/views/worktimeUsage/_components/subPages/productivity/Graph.vue`

### Purpose

Visualizes productivity data over time using a **stacked bar chart**. Shows hourly breakdown of Work, Meeting, Leisure, and Unclassified time across a 24-hour period.

### Key Features

1. **Stacked Bar Chart**: Multiple datasets stacked vertically
2. **24-Hour Timeline**: X-axis shows hours from 00:00 to 23:00
3. **Color-Coded Categories**: Each activity type has distinct colors
4. **Responsive**: Maintains aspect ratio and adapts to container
5. **Dynamic Theming**: Uses PrimeVue theme colors
6. **Mock Data**: Currently using hardcoded data (TODO: integrate store)

### Component Structure

```vue
<template>
  <div class="card">
    <Chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      class="h-[30rem]"
    />
  </div>
</template>
```

### Props & Emits

**No props or emits** - Component manages its own data.

### State & Computed

```typescript
const sectionsStore = useSectionsStore();

const chartData = computed(() => {
  // TODO: Update to use store data
  // const data = sectionsStore.Graphs;
  // return setChartData(data as unknown as ChartInput);
  return setChartData(mockData);
});

const chartOptions = computed(() => setChartOptions());
```

### Data Structure

#### Mock Data Structure

```typescript
interface ChartDataset {
  label: string;              // Dataset name (e.g., "Work")
  data: number[];             // 24 values for each hour
  backgroundColor: string | string[];
  borderColor: string | string[];
}

interface ChartInput {
  labels: string[];           // 24-hour labels: ["00:00", "01:00", ...]
  datasets: ChartDataset[];   // Array of datasets
  Unit?: string;              // Unit of measurement (e.g., "Dakika")
}
```

#### Current Mock Data

```typescript
const mockData = {
  labels: [
    '00:00', '01:00', '02:00', ..., '23:00'
  ],
  datasets: [
    {
      label: 'Unclassified',
      data: [0, 0, 0, ...], // 24 values
      backgroundColor: 'rgba(141, 163, 255, 0.3)',
      borderColor: '#EFF2FF',
    },
    {
      label: 'Leisure',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 3.1, ...],
      backgroundColor: 'rgba(255, 62, 62, 0.3)',
      borderColor: '#FFECEC',
    },
    {
      label: 'Meeting',
      data: [0, 0, 0, ...],
      backgroundColor: 'rgba(255, 181, 71, 0.3)',
      borderColor: '#FFF4E4',
    },
    {
      label: 'Work',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 56.9, 60, ...],
      backgroundColor: 'rgba(48, 211, 94, 0.3)',
      borderColor: '#EBFBEF',
    },
  ],
  Unit: 'Dakika', // Minutes
};
```

### Color Scheme

| Dataset | Background Color | Border Color | Purpose |
|---------|------------------|--------------|---------|
| **Unclassified** | `rgba(141, 163, 255, 0.3)` | `#EFF2FF` | Purple/Blue - Unknown activities |
| **Leisure** | `rgba(255, 62, 62, 0.3)` | `#FFECEC` | Red - Non-work activities |
| **Meeting** | `rgba(255, 181, 71, 0.3)` | `#FFF4E4` | Orange - Meeting time |
| **Work** | `rgba(48, 211, 94, 0.3)` | `#EBFBEF` | Green - Productive work |

### Key Functions

#### `setChartData(source: ChartInput)`

Transforms raw data into Chart.js format.

```typescript
const setChartData = (source: ChartInput) => {
  return {
    labels: source.labels,
    datasets: source.datasets.map((ds) => ({
      ...ds,
      // Convert single color to array (one per data point)
      backgroundColor: Array.isArray(ds.backgroundColor)
        ? ds.backgroundColor
        : ds.data.map(() => ds.backgroundColor),
      borderColor: Array.isArray(ds.borderColor)
        ? ds.borderColor
        : ds.data.map(() => ds.borderColor),
      borderWidth: 1,
    })),
  };
};
```

**Purpose**: Ensures colors are properly formatted for Chart.js.

#### `setChartOptions()`

Configures chart appearance and behavior.

```typescript
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
          font: { weight: 500 }
        },
        grid: {
          display: false,
          drawBorder: false
        },
      },
      y: {
        stacked: true,
        ticks: { color: textColorSecondary },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        },
      },
    },
  };
};
```

**Key Settings**:
- **`stacked: true`**: Both X and Y axes - creates stacked bar effect
- **`maintainAspectRatio: false`**: Allows custom height (`h-[30rem]`)
- **Dynamic colors**: Reads from PrimeVue CSS variables
- **Grid**: Hidden on X-axis, visible on Y-axis

### Chart Configuration

#### Stacked Bar Chart

**Visual Example**:
```
         ┌─────────────────────────────┐
     60  │     ████████████████████    │ ← Work (green)
         │     ███████████████████     │
     40  │     ██████████████          │
         │     ████████████            │ ← Meeting (orange)
     20  │     ██████                  │
         │     ███                     │ ← Leisure (red)
      0  ├─────┴───┴───┴───┴───┴───┴──┤
            09:00 10:00 11:00 12:00 13:00
```

Each bar represents total time spent across all categories for that hour.

### Integration with Store (TODO)

**Current Code**:
```typescript
// TODO: update here
// const data = sectionsStore.Graphs;
// return setChartData(data as unknown as ChartInput);
return setChartData(mockData);
```

**To Enable Store Integration**:

1. Uncomment store data lines:
```typescript
const chartData = computed(() => {
  const data = sectionsStore.Graphs;
  if (!data || data.length === 0) {
    return setChartData(mockData); // Fallback
  }
  return setChartData(data as unknown as ChartInput);
});
```

2. Ensure `sectionsStore.Graphs` matches `ChartInput` interface:
```typescript
// Store should return
{
  labels: string[];        // 24-hour labels
  datasets: ChartDataset[]; // Work, Meeting, Leisure, Unclassified
  Unit: string;            // Time unit
}
```

3. Handle loading state:
```typescript
<template v-if="sectionsStore.isLoading">
  <Skeleton height="30rem" />
</template>
<template v-else>
  <Chart ... />
</template>
```

### Styling

```vue
<div class="card">
  <Chart class="h-[30rem]" />
</div>
```

**Height**: Fixed at `30rem` (480px) for consistent appearance.

### Usage Example

```vue
<template>
  <Graph />
</template>

<script setup lang="ts">
import Graph from './productivity/Graph.vue';
</script>
```

**No configuration needed** - component is self-contained.

### Best Practices

✅ **Do**: Ensure data has 24 values (one per hour)
```typescript
datasets: [{
  label: 'Work',
  data: Array(24).fill(0) // ✅ 24 values
}]
```

❌ **Don't**: Use incomplete data arrays
```typescript
data: [1, 2, 3] // ❌ Only 3 values - will break chart
```

✅ **Do**: Use rgba colors with transparency
```typescript
backgroundColor: 'rgba(48, 211, 94, 0.3)' // ✅ Transparent
```

✅ **Do**: Set stacked: true for both axes
```typescript
scales: {
  x: { stacked: true },
  y: { stacked: true }
}
```

### Common Issues

#### Issue 1: Chart Not Rendering

**Cause**: Data format doesn't match expected structure.

**Solution**: Validate data structure:
```typescript
console.log('Chart data:', chartData.value);
// Should have: labels (array), datasets (array)
```

#### Issue 2: Colors Not Showing

**Cause**: Missing backgroundColor or borderColor.

**Solution**: Ensure all datasets have color properties:
```typescript
{
  label: 'Work',
  data: [...],
  backgroundColor: 'rgba(48, 211, 94, 0.3)', // ✅
  borderColor: '#EBFBEF' // ✅
}
```

#### Issue 3: Chart Not Stacked

**Cause**: Missing `stacked: true` on scales.

**Solution**: Verify chart options:
```typescript
scales: {
  x: { stacked: true }, // Must be true
  y: { stacked: true }  // Must be true
}
```

#### Issue 4: Theme Colors Not Applied

**Cause**: PrimeVue CSS variables not available.

**Solution**: Ensure PrimeVue is properly initialized and theme is loaded.

### Future Enhancements

1. **Real Data Integration**
```typescript
// Remove mockData usage
const chartData = computed(() => {
  return setChartData(sectionsStore.Graphs);
});
```

2. **Loading State**
```vue
<template v-if="sectionsStore.isLoading">
  <Skeleton height="30rem" />
</template>
```

3. **Empty State**
```vue
<template v-else-if="!hasData">
  <EmptyState message="No graph data available" />
</template>
```

4. **Tooltips Enhancement**
```typescript
plugins: {
  tooltip: {
    callbacks: {
      label: (context) => {
        return `${context.dataset.label}: ${context.parsed.y} minutes`;
      }
    }
  }
}
```

5. **Export Functionality**
```typescript
const exportChart = () => {
  const canvas = chartRef.value.getCanvas();
  const url = canvas.toDataURL('image/png');
  // Download or share
};
```

### Dependencies

```typescript
import { computed } from 'vue';
import Chart from 'primevue/chart';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
```

**External Libraries**:
- **Chart.js** (via PrimeVue Chart component)
- PrimeVue theming system

### Related Components

- [Distribution.vue](./DISTRIBUTION_README.md) - Alternative visualization (pie charts)
- [Team.vue](#teamvue) - Tabular data view

---

## Summary Comparison

| Component | Purpose | Interactive | Data Source | Loading State |
|-----------|---------|-------------|-------------|---------------|
| **Team.vue** | Team/member table | ✅ Yes (navigation) | Store (Teamset) | Store |
| **Individuals.vue** | Employee table | ❌ No (read-only) | Store (Individuals) | Props |
| **Graph.vue** | Time visualization | ❌ No (display) | Mock data (TODO: Store) | Not implemented |

All three components work together to provide comprehensive productivity insights from different perspectives.

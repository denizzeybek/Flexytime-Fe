# Distribution Component

**File**: `src/views/worktimeUsage/_components/subPages/distribution/Distribution.vue`

## Purpose

Visualizes time distribution using **doughnut charts** (pie charts) with application breakdowns. Shows how time is spent across different categories (Work, Meeting, Leisure, Unclassified) and which applications were used during each category.

## Table of Contents

- [Key Features](#key-features)
- [Component Structure](#component-structure)
- [Data Flow](#data-flow)
- [Chart Configuration](#chart-configuration)
- [Layout](#layout)
- [Usage](#usage)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)

---

## Key Features

1. **Multiple Doughnut Charts**: One chart per statistic type (Work, Meeting, Leisure, Unclassified)
2. **Application Breakdown**: Lists applications used with time spent
3. **Color-Coded**: 9 predefined colors for different applications
4. **Responsive Grid**: 2-column layout on desktop, 1-column on mobile
5. **Empty State**: Shows "No Data Available" with illustration when no data
6. **Dynamic Badges**: Uses severity-based badges for category identification
7. **Hover Effects**: Lighter colors on hover for better UX

---

## Component Structure

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- One card per distribution type -->
    <template v-for="(distribution, idx) in chartData" :key="idx">
      <Card>
        <!-- Header: Category badge + total time -->
        <template #header>
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center gap-2">
              <SBadgeIcon ... />
              <FText as="h6" :innerText="title" />
            </div>
            <div class="flex items-center gap-2">
              <FText as="h6" innerText="Total Time:" />
              <FText as="h6" :innerText="totalTime" />
            </div>
          </div>
        </template>

        <!-- Content: Doughnut chart + application list -->
        <template #content>
          <template v-if="distribution.applications?.length">
            <div class="grid grid-cols-4 gap-4">
              <!-- Left: Doughnut chart -->
              <Chart
                type="doughnut"
                :data="distribution.chart"
                :options="chartOptions"
                class="w-full col-span-2"
              />

              <!-- Right: Application breakdown -->
              <div class="flex flex-col gap-2 bg-f-light-gray p-6 rounded-lg h-full col-span-2">
                <template v-for="(application, idx) in distribution.applications" :key="idx">
                  <div class="flex gap-2 justify-between">
                    <RText as="h6" :innerText="application.title" />
                    <RText :innerText="application.time" />
                  </div>
                </template>
              </div>
            </div>
          </template>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center gap-8">
            <img src="@/assets/images/noData.svg" />
            <RText innerText="No Data Available" />
          </div>
        </template>
      </Card>
    </template>
  </div>
</template>
```

---

## Data Flow

### Store Integration

```typescript
const sectionsStore = useSectionsStore();

const chartData = computed(() => {
  const distributions = sectionsStore.Distributions;
  return distributions?.map((distribution) => {
    return {
      ...distribution,
      applications: distribution.Applications,
      chart: transformDataToChartFormat(distribution.Chart),
    };
  });
});
```

### Data Structure

**Store Data** (`sectionsStore.Distributions`):
```typescript
interface IDistribution {
  statisticType: 'work' | 'meeting' | 'leisure' | 'unclassified';
  time: string;         // Total time (e.g., "8h 30m")
  Chart: Array<{
    label: string;      // Application name
    value: number;      // Time value
  }>;
  Applications: Array<{
    title: string;      // Application name
    time: string;       // Formatted time
  }>;
}
```

**Transformed Chart Data**:
```typescript
interface ChartData {
  labels: string[];            // Application names
  datasets: [{
    data: number[];            // Time values
    backgroundColor: string[]; // Colors for each segment
    hoverBackgroundColor: string[]; // Hover colors
  }];
}
```

---

## Chart Configuration

### Color Palette

The component uses a predefined set of 9 colors:

```typescript
const colors = [
  '#06b6d4',  // Cyan
  '#FFC165',  // Orange
  '#6b7280',  // Gray
  '#10b981',  // Green
  '#f472b6',  // Pink
  '#facc15',  // Yellow
  '#8b5cf6',  // Purple
  '#ef4444',  // Red
  '#14b8a6',  // Teal
];

const hoverColors = [
  '#22d3ee',  // Lighter cyan
  '#FFD580',  // Lighter orange
  '#9ca3af',  // Lighter gray
  '#34d399',  // Lighter green
  '#fb7185',  // Lighter pink
  '#fde047',  // Lighter yellow
  '#c4b5fd',  // Lighter purple
  '#f87171',  // Lighter red
  '#2dd4bf',  // Lighter teal
];
```

**Visual Example**:
```
Color 1: #06b6d4 (Cyan)       → Hover: #22d3ee
Color 2: #FFC165 (Orange)     → Hover: #FFD580
Color 3: #6b7280 (Gray)       → Hover: #9ca3af
...
```

### Transform Function

```typescript
const transformDataToChartFormat = (rawData) => {
  const labels = rawData.map((item) => item.label);
  const data = rawData.map((item) => item.value);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, rawData.length),
        hoverBackgroundColor: hoverColors.slice(0, rawData.length),
      },
    ],
  };
};
```

**Input**:
```typescript
[
  { label: "Chrome", value: 240 },      // 4 hours in minutes
  { label: "VSCode", value: 180 },      // 3 hours
  { label: "Slack", value: 60 }         // 1 hour
]
```

**Output**:
```typescript
{
  labels: ["Chrome", "VSCode", "Slack"],
  datasets: [{
    data: [240, 180, 60],
    backgroundColor: ['#06b6d4', '#FFC165', '#6b7280'],
    hoverBackgroundColor: ['#22d3ee', '#FFD580', '#9ca3af']
  }]
}
```

### Chart Options

```typescript
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,  // Use circles instead of squares
          color: textColor,     // Dynamic color from PrimeVue theme
        },
      },
    },
  };
});
```

**Features**:
- **`usePointStyle: true`**: Legend uses circular markers (matches doughnut shape)
- **Dynamic text color**: Adapts to PrimeVue theme (light/dark mode)

---

## Layout

### Grid System

```vue
<!-- Outer grid: 2 columns on desktop -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

  <!-- Each card -->
  <Card>
    <!-- Inner grid: Chart (2 cols) + App list (2 cols) -->
    <div class="grid grid-cols-4 gap-4">
      <Chart class="col-span-2" />
      <div class="col-span-2">...</div>
    </div>
  </Card>

</div>
```

**Responsive Behavior**:
- **Mobile** (`< lg`): 1 column - cards stack vertically
- **Desktop** (`≥ lg`): 2 columns - 2 cards per row

### Card Structure

**Header**:
```
┌─────────────────────────────────────┐
│ [Icon] Work         Total Time: 8h  │
└─────────────────────────────────────┘
```

**Content** (with data):
```
┌──────────────┬──────────────────────┐
│              │  Chrome         4h   │
│   Doughnut   │  VSCode         3h   │
│    Chart     │  Slack          1h   │
│              │                      │
└──────────────┴──────────────────────┘
```

**Empty State**:
```
┌─────────────────────────────────────┐
│                                     │
│          [No Data SVG]              │
│      No Data Available              │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Dependencies

### Imports

```typescript
import { computed } from 'vue';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
import { useStaticBadge } from '@/views/worktimeUsage/_composables/useStaticBadge';
import SBadgeIcon from '@/views/worktimeUsage/_components/summary/SBadgeIcon.vue';
```

### Composable Usage

```typescript
const { mapStatisticTypeToBadge } = useStaticBadge();
```

**Purpose**: Maps statistic types to badge configuration (severity, icon, title, value).

**Example**:
```typescript
mapStatisticTypeToBadge('work', '8h 30m')
// Returns: {
//   severity: 'success',
//   icon: 'pi pi-briefcase',
//   title: 'Work',
//   value: '8h 30m'
// }
```

---

## Usage

### Basic Usage

```vue
<template>
  <Distribution />
</template>

<script setup lang="ts">
import Distribution from './subPages/distribution/Distribution.vue';
</script>
```

**No props needed** - component reads directly from store.

### Expected Data Flow

1. **Parent view fetches data**:
```typescript
await sectionsStore.filter(payload);
```

2. **Store populates `Distributions`**:
```typescript
sectionsStore.Distributions = [
  {
    statisticType: 'work',
    time: '8h 30m',
    Chart: [
      { label: 'Chrome', value: 240 },
      { label: 'VSCode', value: 180 }
    ],
    Applications: [
      { title: 'Chrome', time: '4h' },
      { title: 'VSCode', time: '3h' }
    ]
  },
  // ... other types (meeting, leisure, unclassified)
];
```

3. **Component renders**:
   - Transforms chart data
   - Displays doughnut charts
   - Lists applications

---

## Display Examples

### Work Distribution Card

**Header**:
```
[💼] Work                    Total Time: 8h 30m
```

**Chart** (visual approximation):
```
        ╭───────╮
       ╱   42%   ╲      Chrome: 42% (4h)
      │           │     VSCode: 35% (3h)
       ╲   35%   ╱      Slack: 23% (2h)
        ╰───────╯
```

**Application List**:
```
Chrome          4h
VSCode          3h
Slack           2h
```

### Meeting Distribution Card

**Header**:
```
[📅] Meeting                Total Time: 2h 15m
```

**Chart**:
```
        ╭───────╮
       ╱   67%   ╲      Zoom: 67% (1h 30m)
      │           │     Teams: 33% (45m)
       ╲   33%   ╱
        ╰───────╯
```

**Application List**:
```
Zoom            1h 30m
Microsoft Teams 45m
```

---

## Best Practices

### ✅ Do's

1. **Ensure data completeness**:
```typescript
// Store should provide complete data
{
  statisticType: 'work',
  time: '8h',           // ✅ Required
  Chart: [...],         // ✅ Required
  Applications: [...]   // ✅ Required
}
```

2. **Handle empty states**:
```vue
<template v-if="distribution.applications?.length">
  <!-- Chart and list -->
</template>
<div v-else>
  <!-- Empty state -->
</div>
```

3. **Limit application count**:
```typescript
// Don't exceed 9 applications per chart (color limit)
if (distribution.Chart.length > 9) {
  // Group "Others" or show top 8 + "Others"
}
```

4. **Validate data before transformation**:
```typescript
const transformDataToChartFormat = (rawData) => {
  if (!rawData || rawData.length === 0) {
    return { labels: [], datasets: [] };
  }
  // ... rest of transformation
};
```

### ❌ Don'ts

1. **Don't mutate store data directly**:
```typescript
// ❌ Bad
sectionsStore.Distributions[0].time = '10h';

// ✅ Good
await sectionsStore.filter(newPayload);
```

2. **Don't exceed color palette**:
```typescript
// ❌ Will run out of colors
Chart: Array(15).fill({ label: 'App', value: 10 })

// ✅ Limit or group
Chart: topApplications.slice(0, 9)
```

3. **Don't forget optional chaining**:
```typescript
// ❌ May crash
distribution.applications.length

// ✅ Safe
distribution.applications?.length
```

---

## Common Issues

### Issue 1: Charts Not Rendering

**Cause**: Data structure doesn't match expected format.

**Solution**: Verify data structure:
```typescript
console.log('Distributions:', sectionsStore.Distributions);
// Should be array of objects with Chart and Applications
```

### Issue 2: Colors Not Applied

**Cause**: Too many data points (> 9).

**Solution**: Limit data or extend color palette:
```typescript
const colors = [
  // ... existing 9 colors
  '#94a3b8',  // Add more colors
  '#fb923c',
  // ...
];
```

### Issue 3: Empty State Always Showing

**Cause**: Applications array is empty or undefined.

**Debug**:
```typescript
console.log('Applications:', distribution.applications);
// Should be array with at least one item
```

**Check**:
- Store is fetching data correctly
- API returns Applications field
- Data transformation doesn't lose Applications

### Issue 4: Legend Not Showing

**Cause**: Chart options not configured correctly.

**Solution**: Ensure chartOptions is computed and passed:
```vue
<Chart :options="chartOptions" />
```

### Issue 5: Hover Colors Not Working

**Cause**: Missing `hoverBackgroundColor` in dataset.

**Solution**: Already handled in `transformDataToChartFormat` - verify function is called.

---

## Styling Notes

### Custom Classes

```vue
<div class="bg-f-light-gray p-6 rounded-lg">
  <!-- Application list background -->
</div>
```

**Purpose**: Light gray background for application list section.

### Gap Spacing

```vue
<div class="grid gap-12">        <!-- Outer grid: large gap -->
<div class="grid gap-4">         <!-- Inner grid: medium gap -->
<div class="flex gap-2">         <!-- Application row: small gap -->
```

**Hierarchy**: Larger gaps for major sections, smaller for related items.

---

## Future Enhancements

### 1. Export Functionality

```typescript
const exportChart = (distribution) => {
  const chartData = {
    category: distribution.statisticType,
    totalTime: distribution.time,
    applications: distribution.applications
  };
  // Export as CSV, PDF, or image
};
```

### 2. Interactive Chart

```typescript
const chartOptions = computed(() => ({
  // ... existing options
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const app = distribution.applications[index];
      // Show detailed view for this application
    }
  }
}));
```

### 3. Percentage Display

```vue
<div class="flex gap-2 justify-between">
  <RText as="h6" :innerText="application.title" />
  <div class="flex gap-2">
    <RText :innerText="application.percentage + '%'" class="text-gray-500" />
    <RText :innerText="application.time" />
  </div>
</div>
```

### 4. Time Period Comparison

```typescript
// Show previous period data for comparison
<div class="flex items-center gap-2">
  <RText :innerText="application.time" />
  <RText
    :innerText="application.change"
    :class="application.change > 0 ? 'text-green-500' : 'text-red-500'"
  />
</div>
```

### 5. Loading State

```vue
<template v-if="sectionsStore.isLoading">
  <Skeleton height="300px" />
</template>
<template v-else>
  <Chart ... />
</template>
```

---

## Testing Checklist

- [ ] Charts render with valid data
- [ ] Empty state shows when no applications
- [ ] Colors are applied correctly (up to 9 items)
- [ ] Hover effects work on chart segments
- [ ] Legend shows all application names
- [ ] Application list matches chart data
- [ ] Total time displays correctly
- [ ] Badge icon shows correct severity
- [ ] Responsive layout works on mobile
- [ ] Multiple distribution types display correctly

---

## Related Components

- [SBadgeIcon.vue](./SUMMARY_README.md#sbadgeiconvue) - Category icon badges
- [useStaticBadge](./SUMMARY_README.md#usestaticbadge) - Badge mapping composable
- [Graph.vue](./PRODUCTIVITY_README.md#graphvue) - Alternative visualization (bar chart)

---

## Summary

The Distribution component provides a visual breakdown of time spent across different categories using doughnut charts and application lists. It supports up to 9 applications per category with a predefined color palette and handles empty states gracefully. The component is fully responsive and integrates with the store for real-time data updates.

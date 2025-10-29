# Summary Components

This document covers all summary-related components that display aggregate metrics and navigation controls in the Worktime Usage module.

## Table of Contents

- [Index.vue](#indexvue) - Summary container component
- [SBadgeGroup.vue](#sbadgegroupvue) - Badge collection component
- [SBadge.vue](#sbadgevue) - Individual metric badge
- [SBadgeIcon.vue](#sbadgeiconvue) - Icon component for badges
- [SBreadcrumb.vue](#sbreadcrumbvue) - Navigation breadcrumb
- [SActions.vue](#sactionsvue) - Action controls (filters, date picker)
- [useStaticBadge](#usestaticbadge) - Badge mapping composable
- [severityMap](#severitymap) - Severity color constants

---

## Index.vue

**File**: `src/views/worktimeUsage/_components/summary/Index.vue`

### Purpose

Container component that orchestrates the layout of summary information. Combines breadcrumb navigation, action controls, and metric badges into a cohesive summary card.

### Component Structure

```vue
<template>
  <Card class="w-full h-fit">
    <template #content>
      <div class="flex flex-col h-full flex-1">
        <!-- Header: Breadcrumb + Actions -->
        <div class="flex md:flex-row flex-col justify-between md:items-center items-start gap-2 md:gap-0 w-full">
          <SBreadcrumb />
          <SActions />
        </div>

        <!-- Spacer (pushes badges to bottom) -->
        <div class="mt-auto mb-auto"></div>

        <!-- Footer: Badge Group -->
        <div>
          <SBadgeGroup />
        </div>
      </div>
    </template>
  </Card>
</template>
```

### Layout Structure

**Visual Representation**:
```
┌──────────────────────────────────────────────────┐
│ [Home > Team1 > Team2]    [🔽] [Date] [Filter]  │ ← Header
│                                                   │
│                   (spacer)                        │
│                                                   │
│ [Work: 8h] [Meeting: 2h] [Leisure: 1h] ...       │ ← Footer
└──────────────────────────────────────────────────┘
```

**Responsive Behavior**:
- **Desktop** (`md+`): Breadcrumb and actions side-by-side
- **Mobile** (`< md`): Stacked vertically

### Props & Emits

**No props or emits** - Container component only.

### Child Components

1. **SBreadcrumb** - Shows navigation path
2. **SActions** - Provides filtering and date selection
3. **SBadgeGroup** - Displays metric badges

### Usage

```vue
<template>
  <div class="flex gap-4">
    <UserBadge />
    <Summary />  <!-- Index.vue -->
  </div>
</template>

<script setup lang="ts">
import Summary from '@/views/worktimeUsage/_components/summary/Index.vue';
</script>
```

### Styling Notes

- **Flexbox Layout**: Vertical flex container with auto margins for spacing
- **Card Sizing**: `w-full` (full width), `h-fit` (fit content height)
- **Responsive Gap**: `gap-2` on mobile, `gap-0` on desktop

---

## SBadgeGroup.vue

**File**: `src/views/worktimeUsage/_components/summary/SBadgeGroup.vue`

### Purpose

Displays a collection of metric badges in a responsive grid. Transforms store's Summary data into badge components using the `useStaticBadge` composable.

### Component Structure

```vue
<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
    <SBadge
      v-for="(item, idx) in badgeList"
      :key="idx"
      :severity="item.severity"
      :title="item.title"
      :value="item.value"
      :icon="item.icon"
    />
  </div>
</template>
```

### Props & Emits

**No props or emits** - Reads data directly from store.

### State & Computed

```typescript
const sectionsStore = useSectionsStore();
const { mapStatisticTypeToBadge } = useStaticBadge();

const badgeList = computed<BadgeData[]>(() => {
  const summary = sectionsStore.Summary ?? [];
  return summary
    .map((summary) =>
      mapStatisticTypeToBadge(summary.statisticType, summary.time)
    )
    .filter((item): item is BadgeData => item !== null);
});
```

**Data Flow**:
```
Store Summary → map to badges → filter nulls → render SBadges
```

### Data Structure

**Store Input** (`sectionsStore.Summary`):
```typescript
interface ISummary {
  statisticType: 'work' | 'meeting' | 'leisure' | 'unclassified' | 'starttime' | 'endtime';
  time: string;  // e.g., "8h 30m"
}
```

**Transformed Output** (`BadgeData`):
```typescript
interface BadgeData {
  severity: string;  // 'success', 'warn', 'danger', etc.
  title: string;     // 'Work', 'Meeting', etc.
  icon: string;      // 'pi pi-wrench', etc.
  value: any;        // '8h 30m'
}
```

### Grid Layout

```vue
<div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
```

**Responsive Behavior**:
- **Mobile** (`< lg`): 2 columns - badges stack in pairs
- **Desktop** (`≥ lg`): 6 columns - all badges in one row

**Example Layout**:

Mobile:
```
┌────────────┬────────────┐
│ Work: 8h   │ Meeting: 2h│
├────────────┼────────────┤
│ Leisure:1h │ Start: 9am │
└────────────┴────────────┘
```

Desktop:
```
┌──────┬─────────┬─────────┬──────┬──────┬──────┐
│ Work │ Meeting │ Leisure │ Un.. │Start │ End  │
└──────┴─────────┴─────────┴──────┴──────┴──────┘
```

### Mapping Process

```typescript
// Store data
[
  { statisticType: 'work', time: '8h' },
  { statisticType: 'meeting', time: '2h' }
]

// After mapping
[
  { severity: 'success', title: 'Work', icon: 'pi pi-wrench', value: '8h' },
  { severity: 'warn', title: 'Meeting', icon: 'pi pi-crown', value: '2h' }
]
```

### Usage

Used within `Index.vue`:

```vue
<template>
  <div>
    <SBadgeGroup />
  </div>
</template>
```

### Best Practices

✅ **Do**: Ensure store has Summary data
```typescript
if (sectionsStore.Summary && sectionsStore.Summary.length > 0) {
  // Badges will render
}
```

✅ **Do**: Filter null results (already handled)
```typescript
.filter((item): item is BadgeData => item !== null)
```

❌ **Don't**: Render without data validation
```typescript
// Component handles this internally
```

---

## SBadge.vue

**File**: `src/views/worktimeUsage/_components/summary/SBadge.vue`

### Purpose

Individual metric badge that displays a single statistic with color-coded borders and icons. Uses severity-based styling to visually differentiate metrics.

### Component Structure

```vue
<template>
  <Card class="summary-badge h-fit" :class="borderClass">
    <template #content>
      <div class="flex items-center justify-center gap-2">
        <SBadgeIcon :severity="severity" :title="title" :icon="icon" />
        <span :class="textClass">{{ value }}</span>
      </div>
    </template>
  </Card>
</template>
```

### Props

```typescript
interface IProps {
  severity: string;  // 'success', 'warn', 'danger', 'info', 'primary', 'secondary'
  title: string;     // Badge title (for tooltip)
  icon: string;      // PrimeIcons class
  value: any;        // Display value (e.g., "8h 30m")
}
```

### Computed Classes

#### `borderClass`

Dynamically generates border color class based on severity.

```typescript
const borderClass = computed(() =>
  `card-border-${SeverityMap[props.severity] || 'default'}`
);
```

**Examples**:
- `success` → `card-border-success` → `border-f-success`
- `warn` → `card-border-warn` → `border-f-warn`
- `danger` → `card-border-danger` → `border-f-danger`

#### `textClass`

Dynamically generates text color class based on severity.

```typescript
const textClass = computed(() =>
  `card-text-${SeverityMap[props.severity] || 'default'}`
);
```

**Examples**:
- `success` → `card-text-success` → `text-f-success`
- `warn` → `card-text-warn` → `text-f-warn`

### Styling

#### Custom Tailwind Classes

```css
/* Border colors */
.card-border-success { @apply border border-f-success; }
.card-border-danger { @apply border border-f-danger; }
.card-border-warn { @apply border border-f-warn; }
.card-border-secondary { @apply border border-f-secondary; }
.card-border-info { @apply border border-f-info; }
.card-border-primary { @apply border border-f-primary; }

/* Text colors */
.card-text-success { @apply text-f-success; }
.card-text-danger { @apply text-f-danger; }
.card-text-warn { @apply text-f-warn; }
.card-text-secondary { @apply text-f-secondary; }
.card-text-info { @apply text-f-info; }
.card-text-primary { @apply text-f-primary; }
```

#### Card Customization

```css
.summary-badge .p-card-body {
  @apply !px-2;  /* Reduced horizontal padding */
}
```

### Visual Examples

**Work Badge** (success):
```
┌─────────────────┐
│ 🔧  8h 30m      │  ← Green border & text
└─────────────────┘
```

**Meeting Badge** (warn):
```
┌─────────────────┐
│ 👑  2h 15m      │  ← Orange/yellow border & text
└─────────────────┘
```

**Leisure Badge** (danger):
```
┌─────────────────┐
│ 📅  1h          │  ← Red border & text
└─────────────────┘
```

### Color Mapping

| Severity | Border Color | Text Color | Use Case |
|----------|-------------|------------|----------|
| **success** | Green | Green | Work time |
| **warn** | Orange | Orange | Meeting time |
| **danger** | Red | Red | Leisure time |
| **secondary** | Gray | Gray | Unclassified time |
| **info** | Blue | Blue | Start time |
| **primary** | Brand | Brand | End time |

### Usage

```vue
<SBadge
  severity="success"
  title="Work"
  icon="pi pi-wrench"
  value="8h 30m"
/>
```

### Dependencies

- **SBadgeIcon** - Icon component
- **SeverityMap** - Severity-to-class mapping

---

## SBadgeIcon.vue

**File**: `src/views/worktimeUsage/_components/summary/SBadgeIcon.vue`

### Purpose

Renders a circular avatar icon with color-coded background based on severity. Includes a tooltip showing the badge title on hover.

### Component Structure

```vue
<template>
  <Avatar
    v-tooltip.top="title"
    :icon="icon"
    :class="bgClass"
    :size="size"
  />
</template>
```

### Props

```typescript
interface IProps {
  severity: string;           // Severity level
  title: string;              // Tooltip text
  icon: string;               // PrimeIcons class
  size?: AvatarProps['size']; // 'normal' | 'large' | 'xlarge'
}

// Defaults
{
  size: 'normal'
}
```

### Computed Class

```typescript
const bgClass = computed(() =>
  `card-bg-${SeverityMap[props.severity] || 'default'}`
);
```

**Examples**:
- `success` → `card-bg-success` → `bg-f-success text-white`
- `warn` → `card-bg-warn` → `bg-f-warn text-white`

### Styling

```css
.card-bg-success { @apply bg-f-success text-white; }
.card-bg-danger { @apply bg-f-danger text-white; }
.card-bg-warn { @apply bg-f-warn text-white; }
.card-bg-secondary { @apply bg-f-secondary text-white; }
.card-bg-info { @apply bg-f-info text-white; }
.card-bg-primary { @apply bg-f-primary text-white; }
```

### Visual Examples

**Work Icon** (success):
```
  ┌───┐
  │ 🔧 │  ← Green background, white icon
  └───┘
  Hover: "Work"
```

**Meeting Icon** (warn):
```
  ┌───┐
  │ 👑 │  ← Orange background, white icon
  └───┘
  Hover: "Meeting"
```

### Size Options

```typescript
size="normal"   // Default size
size="large"    // Larger icon (used in Distribution cards)
size="xlarge"   // Extra large
```

### Usage

```vue
<!-- Default size -->
<SBadgeIcon
  severity="success"
  title="Work"
  icon="pi pi-wrench"
/>

<!-- Large size -->
<SBadgeIcon
  severity="warn"
  title="Meeting"
  icon="pi pi-crown"
  size="large"
/>
```

### Tooltip

PrimeVue tooltip automatically shows on hover:
- **Position**: Top (`v-tooltip.top`)
- **Content**: `title` prop value

---

## SBreadcrumb.vue

**File**: `src/views/worktimeUsage/_components/summary/SBreadcrumb.vue`

### Purpose

Displays hierarchical navigation path showing the current location in the team structure. Allows users to navigate back up the hierarchy by clicking breadcrumb items.

### Component Structure

```vue
<template>
  <div class="bg-f-white px-5 py-2 rounded-xl flex justify-center w-full lg:w-fit">
    <Skeleton v-if="sectionsStore.isLoading" height="1rem" width="20rem" />

    <Breadcrumb v-else :home="home" :model="breadCrumb">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>
```

### Props & Emits

**No props or emits** - Reads data from store.

### State & Computed

#### `home`

Home icon that navigates to root team view.

```typescript
const home = ref({
  icon: 'pi pi-home',
  route: '/clock/section/productivity-team',
});
```

#### `breadCrumb`

Transforms store breadcrumb data into PrimeVue format.

```typescript
const breadCrumb = computed(() => {
  return sectionsStore.Breadcrumb.map((b) => {
    return {
      id: b.id,
      label: b.title,
      route: `/clock/section/productivity-team?teamId=${b.id}`,
    };
  });
});
```

**Store Data Structure**:
```typescript
interface IBreadcrumb {
  id: string;
  title: string;
}
```

**Transformed Structure**:
```typescript
interface BreadcrumbItem {
  id: string;
  label: string;
  route: string;
}
```

### Visual Examples

**Root Level**:
```
[🏠] Home
```

**One Level Deep**:
```
[🏠] Home > Engineering
```

**Two Levels Deep**:
```
[🏠] Home > Engineering > Frontend Team
```

**Three Levels Deep**:
```
[🏠] Home > Engineering > Frontend Team > Component Squad
```

### Loading State

```vue
<Skeleton v-if="sectionsStore.isLoading" height="1rem" width="20rem" />
```

Shows skeleton placeholder while data is loading.

### Responsive Behavior

```vue
<div class="w-full lg:w-fit">
```

- **Mobile** (`< lg`): Full width
- **Desktop** (`≥ lg`): Fit content

### Styling

```vue
<div class="bg-f-white px-5 py-2 rounded-xl">
```

- **Background**: White background
- **Padding**: Horizontal padding (5), vertical padding (2)
- **Border Radius**: Extra large rounded corners

### Navigation Behavior

1. **Click on breadcrumb item** → Navigates to that team level
2. **Query parameter**: `?teamId={id}` added to URL
3. **Route**: `/clock/section/productivity-team?teamId=123`
4. **Data refresh**: Parent view triggers store action with new teamId

### Usage

Used within `Index.vue`:

```vue
<SBreadcrumb />
```

### Common Use Cases

#### Navigate to Parent Team

```
Current: Home > Engineering > Frontend Team
Click: "Engineering"
Result: Navigate to Engineering team view
```

#### Navigate to Root

```
Current: Home > Engineering > Frontend Team
Click: [🏠]
Result: Navigate to root team view
```

---

## SActions.vue

**File**: `src/views/worktimeUsage/_components/summary/SActions.vue`

### Purpose

Provides action controls for filtering and customizing the worktime data view. Includes download button, date range picker, and perspective selector.

### Component Structure

```vue
<template>
  <div class="flex gap-2 items-center w-full lg:w-fit">
    <!-- Download Button -->
    <Button
      v-tooltip.top="'Download Report'"
      icon="pi pi-arrow-circle-down"
      severity="secondary"
      type="button"
      outlined
    />

    <!-- Date Range Picker -->
    <FDateTimePicker
      class="flex-1"
      name="date"
      placeholder="Enter date"
      :prime-props="{
        showTime: false,
        hourFormat: '24',
        fluid: true,
        selectionMode: 'range',
        // ...
      }"
    />

    <!-- Perspective Selector -->
    <FSelect
      name="perspective"
      placeholder="Select perspective"
      :options="perspectiveOptions"
      :primeProps="{ variant: 'filled' }"
    />
  </div>
</template>
```

### Form Management

Uses **VeeValidate** for form handling:

```typescript
const validationSchema = object({
  perspective: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
      icon: string().label('Icon'),
    })
    .label('Perspective'),
  date: array().required().label('Date').of(string().required().label('Date')),
});

const { handleSubmit, resetForm, defineField, setFieldValue } = useForm({
  validationSchema,
});

const [date] = defineField('date');
const [perspective] = defineField('perspective');
```

### Perspective Options

```typescript
enum EPerspective {
  TIME = 0,
  COST = 1,
  RATE = 2,
  IN_SHIFT = 3,
}

const perspectiveOptions = ref([
  { name: 'Time', value: EPerspective.TIME, icon: 'pi pi-clock' },
  { name: 'Cost', value: EPerspective.COST, icon: 'pi pi-dollar' },
  { name: 'Rate', value: EPerspective.RATE, icon: 'pi pi-percentage' },
  { name: 'In Shift', value: EPerspective.IN_SHIFT, icon: 'pi pi-wrench' },
]);
```

| Perspective | Value | Icon | Purpose |
|-------------|-------|------|---------|
| **Time** | 0 | 🕐 | Show time duration |
| **Cost** | 1 | 💲 | Show monetary cost |
| **Rate** | 2 | % | Show percentage/rate |
| **In Shift** | 3 | 🔧 | Show in-shift time |

### Submit Handler

```typescript
const submitHandler = handleSubmit(async (values) => {
  try {
    const payload = {
      perspective: values.perspective.value,
      interval: [
        convertDateToString(values.date[0]),
        convertDateToString(values.date[1])
      ],
      ...(route.query?.teamId
        ? { teamId: route.query.teamId }
        : { memberId: route.query.memberId }),
    };
    handlePerspective(payload);
  } catch (error: any) {
    showErrorMessage(error as any);
  }
});
```

**Payload Structure**:
```typescript
{
  perspective: 0,                    // Perspective enum value
  interval: ['2024-01-01', '2024-01-07'],  // Date range
  teamId: 'abc123',                  // OR memberId
}
```

### Initial Form Data

```typescript
const getInitialFormData = computed(() => {
  const worktimeData = {
    date: [dayjs().toDate(), dayjs().add(7, 'day').toDate()],  // Default: today + 7 days
  };

  let perspective = perspectiveOptions.value[0];  // Default: Time
  if (route?.query?.perspective) {
    const currentPerspective = Number(route?.query.perspective);
    perspective = perspectiveOptions.value.find(
      (option) => option.value === currentPerspective
    )!;
  }

  return {
    perspective,
    date: worktimeData.date,
  };
});
```

**Defaults**:
- **Date**: Today to 7 days from now
- **Perspective**: Time (0)

### Watchers

#### Watch Form Fields

```typescript
watch(
  () => [date.value, perspective.value],
  ([date, perspective]) => {
    const payload = {
      perspective: perspective.value,
      interval: [
        convertDateToString(date[0]),
        convertDateToString(date[1])
      ],
      ...(route.query?.teamId
        ? { teamId: route.query.teamId }
        : { memberId: route.query.memberId }),
    };
    handlePerspective(payload);
  },
  { deep: true }
);
```

**Behavior**: Automatically triggers data fetch when date or perspective changes.

#### Watch Route Changes

```typescript
watch(
  () => route.fullPath,
  () => {
    submitHandler();
  }
);
```

**Behavior**: Re-fetches data when route changes (e.g., navigating to different team).

### Lifecycle

```typescript
onMounted(() => {
  resetForm({
    values: getInitialFormData.value,
  });
});
```

**Behavior**: Initializes form with default values on component mount.

### Injected Dependencies

```typescript
const handlePerspective = inject('handlePerspective') as (event: any) => void;
```

**Purpose**: Injects parent's perspective handler for data fetching.

### Usage

Used within `Index.vue`:

```vue
<SActions />
```

### User Interaction Flow

1. **User selects date range** → Watcher triggers
2. **Payload built** with new dates + current perspective + teamId/memberId
3. **handlePerspective called** → Parent updates route & fetches data
4. **Store updated** → Components re-render with new data

### TODO

```typescript
// TODO: burda bir de date'i ilgili format'a göre query'ye kaydedip watch etmen gerekir.
```

**Action Needed**: Save date to query parameters and watch for changes.

### Responsive Behavior

```vue
<div class="flex gap-2 items-center w-full lg:w-fit">
```

- **Mobile** (`< lg`): Full width, items stack
- **Desktop** (`≥ lg`): Fit content, items in row

---

## useStaticBadge

**File**: `src/views/worktimeUsage/_composables/useStaticBadge.ts`

### Purpose

Composable function that maps statistic types to badge configurations (severity, icon, title). Provides consistent badge styling across the application.

### Interface

```typescript
export interface BadgeData {
  severity: string;  // Severity level for styling
  title: string;     // Display title
  icon: string;      // PrimeIcons class
  value: any;        // Display value
}
```

### Function

```typescript
export function useStaticBadge() {
  function mapStatisticTypeToBadge(
    statisticType: string,
    value: any
  ): BadgeData | null {
    const mapping: Record<string, Omit<BadgeData, 'value'>> = {
      work: {
        severity: 'success',
        title: 'Work',
        icon: 'pi pi-wrench',
      },
      meeting: {
        severity: 'warn',
        title: 'Meeting',
        icon: 'pi pi-crown',
      },
      leisure: {
        severity: 'danger',
        title: 'Leisure',
        icon: 'pi pi-calendar-clock',
      },
      unclassified: {
        severity: 'secondary',
        title: 'Unclassified',
        icon: 'pi pi-question',
      },
      starttime: {
        severity: 'info',
        title: 'Start Time',
        icon: 'pi pi-clock',
      },
      endtime: {
        severity: 'primary',
        title: 'End Time',
        icon: 'pi pi-clock',
      },
    };

    const base = mapping[statisticType];
    if (!base) return null;

    return { ...base, value };
  }

  return { mapStatisticTypeToBadge };
}
```

### Mapping Table

| Statistic Type | Severity | Title | Icon | Color |
|----------------|----------|-------|------|-------|
| **work** | success | Work | 🔧 `pi pi-wrench` | Green |
| **meeting** | warn | Meeting | 👑 `pi pi-crown` | Orange |
| **leisure** | danger | Leisure | 📅 `pi pi-calendar-clock` | Red |
| **unclassified** | secondary | Unclassified | ❓ `pi pi-question` | Gray |
| **starttime** | info | Start Time | 🕐 `pi pi-clock` | Blue |
| **endtime** | primary | End Time | 🕐 `pi pi-clock` | Brand |

### Usage

```typescript
import { useStaticBadge } from '@/views/worktimeUsage/_composables/useStaticBadge';

const { mapStatisticTypeToBadge } = useStaticBadge();

const badgeData = mapStatisticTypeToBadge('work', '8h 30m');
// Returns:
// {
//   severity: 'success',
//   title: 'Work',
//   icon: 'pi pi-wrench',
//   value: '8h 30m'
// }
```

### Examples

#### Work Badge

```typescript
mapStatisticTypeToBadge('work', '8h 30m')
// → { severity: 'success', title: 'Work', icon: 'pi pi-wrench', value: '8h 30m' }
```

#### Meeting Badge

```typescript
mapStatisticTypeToBadge('meeting', '2h 15m')
// → { severity: 'warn', title: 'Meeting', icon: 'pi pi-crown', value: '2h 15m' }
```

#### Invalid Type

```typescript
mapStatisticTypeToBadge('invalid', '1h')
// → null
```

### Adding New Statistic Types

1. **Add to mapping**:
```typescript
const mapping = {
  // ... existing
  break: {
    severity: 'contrast',
    title: 'Break',
    icon: 'pi pi-pause',
  },
};
```

2. **Update TypeScript types** (in interface files):
```typescript
statisticType: 'work' | 'meeting' | 'leisure' | 'unclassified' | 'starttime' | 'endtime' | 'break';
```

3. **Update severity map** (if new severity is needed)

---

## severityMap

**File**: `src/views/worktimeUsage/_etc/severityMap.ts`

### Purpose

Utility map for dynamic CSS class assignment based on severity levels. Provides consistent severity naming across components.

### Definition

```typescript
export const SeverityMap = {
  success: 'success',
  danger: 'danger',
  warn: 'warn',
  contrast: 'contrast',
  info: 'info',
  primary: 'primary',
};
```

### Usage

```typescript
import { SeverityMap } from '@/views/worktimeUsage/_etc/severityMap';

// Dynamic class generation
const borderClass = computed(() =>
  `card-border-${SeverityMap[props.severity] || 'default'}`
);
```

**Example**:
```typescript
SeverityMap['success']  // → 'success'
SeverityMap['warn']     // → 'warn'
SeverityMap['danger']   // → 'danger'
```

### Severity Levels

| Key | Value | Use Case | Color |
|-----|-------|----------|-------|
| **success** | 'success' | Work time, positive metrics | Green |
| **danger** | 'danger' | Leisure time, alerts | Red |
| **warn** | 'warn' | Meeting time, warnings | Orange |
| **contrast** | 'contrast' | High contrast elements | Dark/Light |
| **info** | 'info' | Start time, informational | Blue |
| **primary** | 'primary' | End time, primary actions | Brand |

### CSS Class Patterns

Components use this map to generate classes:

**Border Classes**:
```typescript
`card-border-${SeverityMap[severity]}`
// → card-border-success
// → card-border-danger
// → card-border-warn
```

**Background Classes**:
```typescript
`card-bg-${SeverityMap[severity]}`
// → card-bg-success
// → card-bg-danger
```

**Text Classes**:
```typescript
`card-text-${SeverityMap[severity]}`
// → card-text-success
// → card-text-danger
```

### Adding New Severity

1. **Add to map**:
```typescript
export const SeverityMap = {
  // ... existing
  secondary: 'secondary',
};
```

2. **Add corresponding CSS classes**:
```css
.card-border-secondary { @apply border border-f-secondary; }
.card-bg-secondary { @apply bg-f-secondary text-white; }
.card-text-secondary { @apply text-f-secondary; }
```

---

## Summary Component Architecture

### Component Hierarchy

```
Index.vue (Container)
├── SBreadcrumb.vue (Navigation path)
├── SActions.vue (Filters & controls)
└── SBadgeGroup.vue (Badge collection)
    └── SBadge.vue (Individual badge)
        └── SBadgeIcon.vue (Badge icon)
```

### Data Flow

```
Store (Summary data)
    ↓
SBadgeGroup (maps data)
    ↓
useStaticBadge (transforms types)
    ↓
SBadge (displays badge)
    ↓
SBadgeIcon (displays icon)
    ↓
severityMap (styling)
```

### Shared Resources

- **useStaticBadge** - Used by SBadgeGroup, Distribution
- **severityMap** - Used by SBadge, SBadgeIcon
- **sectionsStore** - Used by all components for data

---

## Best Practices

### ✅ Do's

1. **Use useStaticBadge for consistency**:
```typescript
const { mapStatisticTypeToBadge } = useStaticBadge();
```

2. **Validate data before mapping**:
```typescript
const summary = sectionsStore.Summary ?? [];
```

3. **Filter null results**:
```typescript
.filter((item): item is BadgeData => item !== null)
```

4. **Handle loading states**:
```vue
<Skeleton v-if="isLoading" />
<Breadcrumb v-else ... />
```

### ❌ Don'ts

1. **Don't hardcode badge configurations**:
```typescript
// ❌ Bad
const badge = { severity: 'success', icon: 'pi pi-wrench' };

// ✅ Good
const badge = mapStatisticTypeToBadge('work', '8h');
```

2. **Don't skip severity mapping**:
```typescript
// ❌ Bad
const className = `card-border-${props.severity}`;

// ✅ Good
const className = `card-border-${SeverityMap[props.severity]}`;
```

---

## Testing Checklist

- [ ] Badges render with correct colors
- [ ] Icons show correct severity backgrounds
- [ ] Breadcrumb navigation works
- [ ] Date picker updates data on change
- [ ] Perspective selector updates view
- [ ] Download button is visible (functionality TBD)
- [ ] Loading states display correctly
- [ ] Null badge types are filtered out
- [ ] Tooltips show on icon hover
- [ ] Responsive layout works on mobile

---

## Related Documentation

- [Main README](../README.md) - Comprehensive module documentation
- [Distribution Component](./DISTRIBUTION_README.md) - Uses SBadgeIcon and useStaticBadge
- [Views](./VIEWS_README.md) - Parent components that use Summary

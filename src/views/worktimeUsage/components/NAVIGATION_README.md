# Navigation & Layout Components

This document covers the navigation and layout components used in the Worktime Usage module.

## Table of Contents

- [WorktimeButtonGroups.vue](#worktimebuttongroupsvue) - Main navigation system
- [UserBadge.vue](#userbadgevue) - User profile display

---

## WorktimeButtonGroups.vue

**File**: `src/views/worktimeUsage/_components/WorktimeButtonGroups.vue`

### Purpose

Dynamic navigation system that provides buttons to switch between different visualization modes (Productivity, Distribution, Graph). The component adapts its behavior based on whether it's in a team or employee context.

### Key Features

1. **Context-Aware**: Shows different buttons based on route (section vs employee)
2. **Active State Management**: Highlights the current active view
3. **Perspective Toggle**: SelectButton for switching between "Teams" and "Employees" views
4. **Responsive Layout**: Grid-based responsive design

### Component Structure

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 lg:gap-12 my-5">
    <!-- Navigation Buttons -->
    <div class="flex space-x-4">
      <Button
        v-for="(buttonProp, idx) in buttonProps"
        :key="idx"
        :label="buttonProp.label"
        :icon="buttonProp.icon"
        :variant="isVariantActive(buttonProp)"
        @click="buttonProp.handleClick"
        severity="primary"
      />
    </div>

    <!-- Perspective Toggle (Teams vs Employees) -->
    <div class="flex justify-center lg:justify-end">
      <SelectButton
        v-if="showSelectButton"
        v-model="selectButtonValue"
        :options="selectButtonOptions"
      />
    </div>
  </div>
</template>
```

### Props & Emits

**No props or emits** - Component uses route context and router for navigation.

### State

```typescript
const selectButtonValue = ref('Teams');
const selectButtonOptions = ref(['Employees', 'Teams']);
```

### Computed Properties

#### `isSection`

Determines if the current route is a section (team) route or employee route.

```typescript
const isSection = computed(() => route.path.includes('section'));
// true: /clock/section/...
// false: /clock/employee/...
```

#### `showSelectButton`

Controls visibility of the Teams/Employees toggle.

```typescript
const showSelectButton = computed(() => {
  if (!isSection.value) {
    return false; // Hide on employee routes
  }
  return true; // Show on team routes
});
```

#### `buttonProps`

Dynamically generates button configuration based on context.

```typescript
const buttonProps = computed<IButtonProps[]>(() => {
  return [
    // Productivity button - ONLY shown in section (team) view
    ...(isSection.value
      ? [
          {
            label: 'Productivity',
            routes: ['productivity-team', 'productivity-individuals'],
            icon: 'pi pi-face-smile',
            handleClick: () => {
              handleProductivityButtonRoute();
            },
          },
        ]
      : []),

    // Distribution button - shown in BOTH views
    {
      label: 'Distribution',
      routes: ['distribution'],
      icon: 'pi pi-chart-pie',
      handleClick: () => {
        router.push({
          name: isSection.value
            ? ERouteNames.WorktimeUsageDistribution
            : ERouteNames.WorktimeUsageDistributionEmployee,
        });
      },
    },

    // Graph button - shown in BOTH views
    {
      label: 'Graph',
      routes: ['productivity-graph'],
      icon: 'pi pi-chart-bar',
      handleClick: () => {
        router.push({
          name: isSection.value
            ? ERouteNames.WorktimeUsageProductivityGraph
            : ERouteNames.WorktimeUsageProductivityGraphEmployee,
        });
      },
    },
  ];
});
```

#### `path`

Extracts the current route path segment for active state detection.

```typescript
const path = computed(() => {
  return isSection.value
    ? route.path.split('/clock/section/')[1]
    : route.path.split('/clock/employee/')[1];
});
// Example: '/clock/section/productivity-team' → 'productivity-team'
```

### Key Functions

#### `isVariantActive(buttonProp)`

Determines if a button should be highlighted as active.

```typescript
const isVariantActive = (buttonProp: IButtonProps): ButtonVariant => {
  if (buttonProp.routes.includes(path.value)) {
    return undefined; // Solid button (active)
  }
  return 'outlined'; // Outlined button (inactive)
};
```

**Returns**:
- `undefined` → Solid button (active state)
- `'outlined'` → Outlined button (inactive state)

#### `handleProductivityButtonRoute()`

Handles navigation when Productivity button is clicked, respecting the current perspective.

```typescript
const handleProductivityButtonRoute = () => {
  if (selectButtonValue.value === 'Employees') {
    router.push({ name: ERouteNames.WorktimeUsageProductivityIndividuals });
    return;
  }
  router.push({ name: ERouteNames.WorktimeUsageProductivityTeam });
  return;
};
```

### Watchers

#### Watch `selectButtonValue`

Automatically navigates when user toggles between Teams/Employees.

```typescript
watch(selectButtonValue, () => {
  handleProductivityButtonRoute();
});
```

**Behavior**:
- User clicks "Employees" → Navigates to Individuals table
- User clicks "Teams" → Navigates to Team table

### Button Configurations

| Button | Icon | Team View | Employee View | Routes |
|--------|------|-----------|---------------|--------|
| **Productivity** | `pi pi-face-smile` | ✅ Shown | ❌ Hidden | `productivity-team`, `productivity-individuals` |
| **Distribution** | `pi pi-chart-pie` | ✅ Shown | ✅ Shown | `distribution` |
| **Graph** | `pi pi-chart-bar` | ✅ Shown | ✅ Shown | `productivity-graph` |

### Route Mapping

#### Team View Routes

```typescript
// Productivity → depends on selectButtonValue
ERouteNames.WorktimeUsageProductivityTeam        // "Teams" selected
ERouteNames.WorktimeUsageProductivityIndividuals // "Employees" selected

// Distribution
ERouteNames.WorktimeUsageDistribution

// Graph
ERouteNames.WorktimeUsageProductivityGraph
```

#### Employee View Routes

```typescript
// Distribution
ERouteNames.WorktimeUsageDistributionEmployee

// Graph
ERouteNames.WorktimeUsageProductivityGraphEmployee
```

### Styling

```vue
<div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 lg:gap-12 my-5">
  <!-- Left: Buttons -->
  <div class="flex space-x-4">
    ...
  </div>

  <!-- Right: SelectButton -->
  <div class="flex justify-center lg:justify-end">
    ...
  </div>
</div>
```

**Responsive Behavior**:
- **Mobile** (`< lg`): Stacked vertically, centered
- **Desktop** (`≥ lg`): Two columns, SelectButton aligned right

### Interface Definitions

```typescript
interface IButtonProps {
  label: string;         // Button text
  routes: string[];      // Route paths to match for active state
  icon: string;          // PrimeIcons class
  handleClick: () => void; // Click handler
}

type ButtonVariant = 'outlined' | 'text' | undefined;
// undefined = solid (active)
// 'outlined' = outlined (inactive)
```

### Usage Example

```vue
<!-- Parent view component -->
<template>
  <WorktimeButtonGroups />
  <router-view />
</template>
```

**User Flow**:
1. User sees buttons based on current context (team/employee)
2. User clicks "Distribution" button
3. Component navigates to appropriate Distribution route
4. Button becomes solid (active state)
5. Other buttons remain outlined (inactive)

### Edge Cases

#### 1. Multiple Route Matches

A button can match multiple routes:

```typescript
{
  label: 'Productivity',
  routes: ['productivity-team', 'productivity-individuals'],
  // Active on BOTH routes
}
```

#### 2. SelectButton Initial State

The SelectButton defaults to "Teams":

```typescript
const selectButtonValue = ref('Teams');
```

**Issue**: If user is on Individuals route, SelectButton may be out of sync.

**Solution**: Consider initializing based on current route:

```typescript
const selectButtonValue = ref(
  route.path.includes('individuals') ? 'Employees' : 'Teams'
);
```

#### 3. Query Parameters

Navigation **preserves existing query parameters** from the current route.

```typescript
router.push({ name: ERouteNames.WorktimeUsageDistribution });
// Query params are preserved automatically by Vue Router
```

### Best Practices

✅ **Do**: Use this component in both team and employee views
```vue
<WorktimeButtonGroups />
```

✅ **Do**: Let the component handle route-based logic
```typescript
// Component automatically adapts based on route
```

❌ **Don't**: Pass unnecessary props
```vue
<!-- No need for props -->
<WorktimeButtonGroups :is-section="true" /> <!-- ❌ -->
```

✅ **Do**: Ensure route names match those in `ERouteNames`
```typescript
// Correct
ERouteNames.WorktimeUsageDistribution

// Wrong
'WorktimeDistribution' // ❌ Doesn't exist
```

### Common Issues

#### Issue 1: Button Not Highlighting

**Cause**: Route path doesn't match button's `routes` array.

**Solution**: Check route path matches exactly:

```typescript
// Button config
routes: ['productivity-team']

// Route must be
'/clock/section/productivity-team' // ✅

// Not
'/clock/section/productivity' // ❌
```

#### Issue 2: SelectButton Out of Sync

**Cause**: SelectButton value doesn't reflect current route.

**Solution**: Initialize from route on mount:

```typescript
onMounted(() => {
  if (route.path.includes('individuals')) {
    selectButtonValue.value = 'Employees';
  }
});
```

#### Issue 3: Query Parameters Lost

**Cause**: Explicit query object not passed.

**Solution**: Query params are preserved automatically, but if you need to ensure:

```typescript
router.push({
  name: ERouteNames.WorktimeUsageDistribution,
  query: route.query // Explicitly pass current query
});
```

### Related Components

- [WorktimeUsage.vue](./VIEWS_README.md#worktimeusagevue) - Parent team view
- [WorktimeUsageEmployee.vue](./VIEWS_README.md#worktimeusageemployeevue) - Parent employee view

---

## UserBadge.vue

**File**: `src/views/worktimeUsage/_components/UserBadge.vue`

### Purpose

Displays the current user's profile information in a compact card format. Shows a skeleton loader during data fetch and hides on small screens for better mobile experience.

### Key Features

1. **User Avatar**: Circular avatar with default user icon
2. **User Name**: Displays user's full name
3. **Loading State**: Skeleton animation during data fetch
4. **Responsive**: Hidden on small screens (`< sm`)
5. **Card Layout**: Uses PrimeVue Card component

### Component Structure

```vue
<template>
  <div class="hidden sm:block">
    <Card class="w-40 h-full">
      <template #footer>
        <div class="flex flex-col items-center justify-center gap-3">
          <!-- Loading State -->
          <template v-if="sectionsStore.isLoading">
            <Skeleton shape="circle" size="4rem" class="mr-2" />
            <Skeleton height="1rem" />
          </template>

          <!-- Loaded State -->
          <template v-else>
            <Avatar size="xlarge" icon="pi pi-user" shape="circle" />
            <div class="text-md text-center">{{ card.Name }}</div>
          </template>
        </div>
      </template>
    </Card>
  </div>
</template>
```

### Props & Emits

**No props or emits** - Component reads directly from store.

### State & Computed

```typescript
const sectionsStore = useSectionsStore();

const card = computed(() => sectionsStore.Card);
```

**Store Data Structure** (`ICard`):
```typescript
interface ICard {
  Name: string;         // User's full name
  Abbreviation?: string; // User initials (not currently used)
  AvatarURL?: string;   // Avatar image URL (not currently used)
  // ... other fields
}
```

### Responsive Behavior

```vue
<div class="hidden sm:block">
  <!-- Hidden on mobile (< 640px) -->
  <!-- Visible on tablet+ (≥ 640px) -->
</div>
```

**Breakpoints**:
- **`< sm` (< 640px)**: Hidden
- **`≥ sm` (≥ 640px)**: Visible

### Loading States

#### Loading State

```vue
<template v-if="sectionsStore.isLoading">
  <Skeleton shape="circle" size="4rem" class="mr-2" />
  <Skeleton height="1rem" />
</template>
```

**Visual**:
```
┌─────────────┐
│   ◉         │  ← Circle skeleton (avatar)
│   ▬▬▬       │  ← Rectangle skeleton (name)
└─────────────┘
```

#### Loaded State

```vue
<template v-else>
  <Avatar size="xlarge" icon="pi pi-user" shape="circle" />
  <div class="text-md text-center">{{ card.Name }}</div>
</template>
```

**Visual**:
```
┌─────────────┐
│    👤       │  ← Avatar icon
│ John Doe    │  ← User name
└─────────────┘
```

### Card Sizing

```vue
<Card class="w-40 h-full">
  <!-- Width: 10rem (160px) -->
  <!-- Height: Match parent -->
</Card>
```

### Future Enhancements

#### 1. Use Avatar URL

**Current**: Always shows default icon

**Enhancement**:
```vue
<Avatar
  v-if="card.AvatarURL"
  :image="card.AvatarURL"
  size="xlarge"
  shape="circle"
/>
<Avatar
  v-else
  icon="pi pi-user"
  size="xlarge"
  shape="circle"
/>
```

#### 2. Show User Abbreviation

**Current**: Doesn't use `Abbreviation` field

**Enhancement**:
```vue
<Avatar
  v-if="!card.AvatarURL"
  :label="card.Abbreviation ?? 'U'"
  size="xlarge"
  shape="circle"
/>
```

#### 3. Add User Role/Title

**Enhancement**:
```vue
<div class="text-md text-center font-semibold">{{ card.Name }}</div>
<div class="text-xs text-gray-500">{{ card.Role }}</div>
```

#### 4. Make It Interactive

**Enhancement**: Click to view user profile

```vue
<Card class="w-40 h-full cursor-pointer" @click="handleProfileClick">
  <!-- ... -->
</Card>
```

### Usage Example

```vue
<template>
  <section>
    <div class="flex gap-4 h-full w-full">
      <UserBadge />
      <Summary />
    </div>
  </section>
</template>
```

**Layout**:
```
┌───────┬─────────────────────────────┐
│ User  │    Summary Badges           │
│ Badge │                             │
└───────┴─────────────────────────────┘
```

### Dependencies

```typescript
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';
import { useSectionsStore } from '@/stores/worktimeUsage/section';
```

### Styling Notes

1. **Card Footer**: Content is placed in the footer slot for better spacing
2. **Flexbox Layout**: Vertical centering with gap spacing
3. **Text Sizing**: `text-md` for optimal readability
4. **Spacing**: `gap-3` between avatar and name

### Best Practices

✅ **Do**: Let the component manage its own loading state
```vue
<UserBadge />
<!-- Component handles loading automatically -->
```

✅ **Do**: Use in consistent layout alongside Summary
```vue
<div class="flex gap-4">
  <UserBadge />
  <Summary />
</div>
```

❌ **Don't**: Try to control loading state externally
```vue
<!-- ❌ Don't do this -->
<UserBadge :loading="isLoading" />
```

✅ **Do**: Ensure store has Card data before rendering
```typescript
// Parent component
onMounted(async () => {
  await sectionsStore.filter(payload.value);
  // UserBadge will automatically show data when available
});
```

### Common Issues

#### Issue 1: Name Not Displaying

**Cause**: Store's `Card` object is empty or `Name` is undefined.

**Solution**: Check store has fetched data:

```typescript
console.log('Card data:', sectionsStore.Card);
```

#### Issue 2: Component Not Visible

**Cause**: Viewing on mobile (< 640px).

**Solution**: Check screen size or remove `hidden sm:block` classes.

#### Issue 3: Skeleton Stuck

**Cause**: `isLoading` is always `true`.

**Solution**: Verify store action completes and sets `isLoading = false`.

### Testing Checklist

- [ ] Component hides on mobile screens (< 640px)
- [ ] Component shows on tablet+ screens (≥ 640px)
- [ ] Skeleton shows during loading
- [ ] Avatar and name appear after loading
- [ ] Card maintains fixed width (10rem)
- [ ] Layout works alongside Summary component
- [ ] No errors when Card data is null/undefined
- [ ] Name truncates properly if too long

### Related Components

- [Summary](./SUMMARY_README.md) - Usually displayed alongside UserBadge
- [WorktimeUsage.vue](./VIEWS_README.md#worktimeusagevue) - Parent component

---

## Summary Comparison

| Component | Purpose | Visibility | Dynamic | Interactive |
|-----------|---------|------------|---------|-------------|
| **WorktimeButtonGroups** | Navigation between views | Always visible | Changes based on route | Yes - buttons & toggle |
| **UserBadge** | User profile display | Hidden on mobile | Shows loading state | No - display only |

Both components are essential parts of the Worktime Usage module's layout and are used together in the main view components.

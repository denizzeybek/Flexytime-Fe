# Worktime Usage

Modern worktime usage module built with Vue 3 Composition API, TypeScript, and PrimeVue components.

## 🎯 Overview

This module provides three main view modes for tracking and analyzing employee work time:

1. **Team View** - Hierarchical department/team structure with productivity and wellbeing metrics
2. **Employees View** - Flat list of all employees with comprehensive analytics
3. **Individual View** - Detailed single-user view with distribution, web history, and graphs

## 🏗️ Architecture

### Technology Stack

- **Vue 3** - Composition API with `<script setup>` syntax
- **TypeScript** - Full type safety with strict typing
- **Pinia** - State management with API response caching
- **PrimeVue 4.x** - UI component library
- **Vue Router** - URL-based state management with query parameters

### Key Design Principles

1. **URL as Source of Truth**: All view state is persisted in URL query parameters
2. **Smart API Caching**: API requests are cached and only re-fetched when necessary
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **Component Reusability**: Shared components across different views
5. **Browser Navigation**: Full support for back/forward buttons

## 📁 Project Structure

```
worktimeUsage/
├── README.md                          # This file
├── index.vue                          # Main container component
├── types/                            # TypeScript type definitions
│   ├── api.ts                        # API request/response types
│   ├── common.ts                     # Shared types and enums
│   └── index.ts                      # Type exports
├── store/                            # Pinia store
│   └── worktimeStore.ts              # State management & API calls
├── composables/                      # Vue composables
│   ├── useWorktimeQuery.ts           # URL query parameter management
│   ├── useWorktimeNavigation.ts      # Navigation helpers
│   └── index.ts                      # Composable exports
├── components/
│   ├── common/                       # Shared layout components
│   │   ├── Message.vue               # Information/error messages
│   │   ├── UserBadge.vue             # User card display
│   │   ├── Summary.vue               # Summary section container
│   │   ├── Breadcrumb.vue            # Navigation breadcrumb
│   │   ├── ActionsBar.vue            # Download, date picker, perspective
│   │   ├── BadgeGroup.vue            # Summary metrics badges
│   │   └── SummaryBadge.vue          # Individual metric badge
│   ├── tabs/                         # Tab content components
│   │   ├── ProductivityTab.vue       # Productivity metrics
│   │   ├── WellbeingTab.vue          # Wellbeing indicators
│   │   ├── DistributionTab.vue       # Time distribution charts
│   │   ├── GraphTab.vue              # Activity graphs
│   │   └── WebHistoryTab.vue         # Web browsing history
│   └── tables/                       # Data table components
│       ├── TeamProductivityTable.vue
│       ├── TeamWellbeingTable.vue
│       ├── EmployeeProductivityTable.vue
│       ├── EmployeeWellbeingTable.vue
│       └── WebHistoryTable.vue
```

## 🔌 API Integration

### Endpoints

#### 1. `/webapi/clock/section`

Used for **Team** and **Employees** views.

**Request:**
```typescript
{
  Perspective: number;    // 0=Time, 1=Cost, 2=Rate, 3=InShift
  Interval: string;       // Format: "YYYY-MM-DD_YYYY-MM-DD"
  TeamId: string | null;  // Team ID or null for root
}
```

**Response:** Contains:
- `Card` - User badge information
- `Summary` - Metric badges (work, leisure, meeting, etc.)
- `Breadcrumb` - Navigation path
- `Teamset` - Team hierarchy data
- `Individuals` - Employee list (used for employees view)
- `Distributions` - Time distribution data
- `Graphs` - Activity graphs

**Re-fetch conditions:**
- When `Interval` changes (date picker)
- When `Perspective` changes (perspective selector)
- When `TeamId` changes (team navigation)

#### 2. `/webapi/clock/employeev2`

Used for **Individual** view.

**Request:**
```typescript
{
  Perspective: number;
  Interval: string;
  MemberId: string;       // Employee ID
}
```

**Response:** Contains:
- `Card` - User information
- `Summary` - Individual metrics
- `Breadcrumb` - Navigation path (transformed to Section format via `transformBreadcrumbs()`)
- `Distributions` - Time distribution
- `Graphs` - Activity graphs
- `WebClocks` - Web browsing history grouped by allocation type

**Re-fetch conditions:**
- When `Interval` changes
- When `Perspective` changes
- When `MemberId` changes (user navigation)

**Note:** Employee endpoint returns breadcrumbs in format `{Url, Name, IsEnabled}` which is transformed to Section format `{id, title, path, isLastElement}` in the store.

## 🧭 State Management

### URL Query Parameters

The application state is managed through URL query parameters:

```typescript
{
  view: 'team' | 'employees' | 'individual',  // Current view mode
  tab: TabType,                                // Active tab
  teamId?: string,                             // Current team (team view)
  memberId?: string,                           // Current user (individual view)
  interval: string,                            // Date range
  perspective: number                          // Metric perspective
}
```

### Pinia Store (`useWorktimeStore`)

**State:**
- `sectionData` - Cached section API response
- `employeeData` - Cached employee API response
- `loading` - Loading states for API calls
- `error` - Error states
- `lastSectionRequest` - Last section request for cache comparison
- `lastEmployeeRequest` - Last employee request for cache comparison

**Actions:**
- `fetchSectionData(payload, force?)` - Fetch team/employees data
- `fetchEmployeeData(payload, force?)` - Fetch individual data
- `transformBreadcrumbs(breadcrumbs)` - Convert employee breadcrumb format to section format
- `clearSectionData()` - Clear section cache
- `clearEmployeeData()` - Clear employee cache
- `resetStore()` - Reset entire store

**Getters:**
- `getSectionData` - Get section data
- `getEmployeeData` - Get employee data
- `getIndividuals` - Get individuals list
- `getTeams` - Get teams list
- `isSectionLoading` / `isEmployeeLoading` / `isLoading`
- `getSectionError` / `getEmployeeError`

## 📊 View Modes and Tabs

### Team View

**Available Tabs:**
- **Productivity** (default) - Team performance table
- **Wellbeing** - Team wellbeing indicators
- **Distribution** - Time distribution charts
- **Graph** - Activity line/bar charts

**Right Panel:**
- Graph visualization
- Team/Employees toggle
- Clickable team hierarchy or employee list

### Employees View

**Available Tabs:**
- **Productivity** (default) - Employee list with metrics
- **Wellbeing** - Employee wellbeing indicators
- **Distribution** - Time distribution charts
- **Graph** - Activity graphs

**Right Panel:**
- Graph visualization
- Team/Employees toggle
- Clickable lists for navigation

### Individual View

**Available Tabs:**
- **Wellbeing** - Individual wellbeing (placeholder)
- **Distribution** (default) - Personal time distribution
- **Web History** - Browsing history grouped into 3 separate tables:
  - Work (green badge with wrench icon)
  - Meeting (yellow badge with crown icon)
  - Leisure (red badge with calendar-clock icon)
  - Unclassified (gray badge with question icon)
  - Each table shows domain classification with action buttons to change category

**Right Panel:**
- Graph (only shown when Distribution tab is active)

## 🔄 Navigation Flow

### Clickable Elements

| Element | Navigation Target | View | Condition |
|---------|------------------|------|-----------|
| Department Name | Team view for that department | Team | Always clickable |
| Supervisor Name | Individual view for supervisor | Team/Individual | Only if `MemberId` or `MemberUrl` exists |
| Employee Name | Individual view for employee | All | Always clickable |
| Team Name | Team view for that team | Employees | Always clickable |
| Breadcrumb Item | Team view for hierarchy level | All | Always clickable |

**Note:** When supervisor lacks `MemberId`/`MemberUrl`, the cell displays as non-clickable gray text instead of a blue link.

### Navigation Composables

**`useWorktimeQuery`** - URL query management
- `currentQuery` - Current query parameters
- `updateQuery()` - Update any query parameter
- `navigateToTeam()` - Navigate to team view
- `navigateToEmployees()` - Navigate to employees view
- `navigateToIndividual()` - Navigate to individual view
- `changeTab()` - Change active tab
- `updateInterval()` - Update date range
- `updatePerspective()` - Update perspective

**`useWorktimeNavigation`** - Navigation helpers
- `handleTeamClick()` - Handle team link clicks
- `handleEmployeeClick()` - Handle employee link clicks
- `handleNavigate()` - Generic navigation handler
- `isClickableCell()` - Check if table cell is clickable
- `getNavigationTarget()` - Get navigation target from cell

## 🎨 Components

### Common Components

**Message** - Display info/error messages
```vue
<Message message="Error occurred" severity="error" />
```

**UserBadge** - Display user card with height matching
```vue
<UserBadge :card="cardData" :is-loading="loading" />
```
- Uses `h-full` to match container height
- Shows skeleton loader during loading state
- Displays user avatar, name, and title

**Summary** - Summary section with breadcrumb, actions, and badges
```vue
<Summary
  :breadcrumb-items="breadcrumb"
  :summary-items="summary"
  :is-loading="loading"
  @download="handleDownload"
/>
```
- Uses `h-full` and `justify-between` for height matching with UserBadge
- Custom scoped styles ensure PrimeVue Card body and content take full height

**ActionsBar** - Date picker, perspective selector, download button
```vue
<ActionsBar @download="handleDownload" />
```

### Tab Components

All tab components accept:
- `view-mode` - Current view mode (team/employees/individual)
- `is-loading` - Loading state
- View-specific data props

### Table Components

All table components accept:
- Data array (teams/individuals/webClocks)
- `is-loading` - Loading state with skeleton loaders
- Emit navigation events

**Features:**
- **Skeleton Loaders**: All tables show animated skeleton placeholders during loading
- **Icon Indicators**: Productivity tables display colored icons for Work (wrench), Leisure (calendar-clock), Meeting (crown), and Unclassified (question)
- **Smart Links**: Links appear as `text-gray-900` and show `hover:text-blue-600 hover:underline` on hover
- **Conditional Navigation**: Supervisor links only clickable when `MemberId` or `MemberUrl` exists

## 🚀 Usage

### Accessing the Module

Navigate to `/clock` to access Worktime Usage.

### Example Query Parameters

**Team View:**
```
/clock?view=team&tab=productivity&perspective=0&interval=2025-01-01_2025-01-07
```

**Employees View:**
```
/clock?view=employees&tab=wellbeing&perspective=0&interval=2025-01-01_2025-01-07
```

**Individual View:**
```
/clock?view=individual&tab=distribution&memberId=6291770957a0318a082d51fc&perspective=0&interval=2025-01-01_2025-01-07
```

## 🧪 Development

### Running Type Check

```bash
yarn type-check
```

### Adding New Features

1. **New Tab**:
   - Create tab component in `components/tabs/`
   - Add tab type to `types/common.ts`
   - Add to `availableTabs` in `index.vue`

2. **New API Endpoint**:
   - Add request/response types in `types/api.ts`
   - Add action in `store/worktimeStore.ts`
   - Update main component to call new action

3. **New Navigation Target**:
   - Add route in `useWorktimeQuery.ts`
   - Update `useWorktimeNavigation.ts` handlers

## ✅ Success Criteria

- [x] No TypeScript errors (`yarn type-check` passes)
- [x] URL state working (refresh + browser navigation)
- [x] All views and tabs render correctly
- [x] API requests are not unnecessarily repeated
- [x] Navigation links working
- [x] README is up-to-date and clear
- [x] Code is clean and maintainable

## 🐛 Known Issues / Future Improvements

- [ ] Download report functionality needs implementation
- [ ] Web history domain toggle needs API integration
- [ ] Individual wellbeing tab needs content
- [ ] Chart configurations could be moved to composables
- [x] Add loading skeletons for better UX
- [ ] Add error retry mechanisms
- [ ] Implement data export functionality

## 📝 Notes

- All data fetching goes through Pinia store for caching
- Browser back/forward buttons work automatically due to Vue Router integration
- TypeScript strict mode is enabled for maximum type safety
- URL query parameters manage all view state

## 🔗 Related Files

- Route configuration: `src/router/routes.ts`
- Route names enum: `src/router/routeNames.enum.ts`
- Store names: `src/stores/storeNames.enum.ts` (if needed)

## 🎨 UI/UX Features

### Skeleton Loaders
All tables and tabs implement skeleton loaders during data fetching:
- **Tables**: 5 skeleton rows (10 for WebHistory) with appropriate shapes (circles for avatars, rectangles for text)
- **Distribution Tab**: 4 skeleton cards in 2x2 grid with circular chart placeholders
- **Web History Tab**: 3 skeleton cards with table skeletons

### Link Styling
- Default state: `text-gray-900` (dark gray)
- Hover state: `text-blue-600` with underline
- Provides subtle, professional appearance while maintaining clear interactivity

### Icon Indicators
Productivity tables display colored icons next to time values:
- 🔧 Work: Green wrench icon (`pi-wrench`)
- 👑 Meeting: Yellow crown icon (`pi-crown`)
- 📅 Leisure: Red calendar-clock icon (`pi-calendar-clock`)
- ❓ Unclassified: Gray question icon (`pi-question`)

### Height Matching
UserBadge and Summary components use `h-full` with flexbox to ensure equal heights regardless of content amount, creating a balanced layout.

---

Last updated: 2025-10-30

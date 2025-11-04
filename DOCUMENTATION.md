# Flexytime Frontend Documentation

## Project Overview

Flexytime is a time tracking and workforce management application built with Vue 3, TypeScript, and modern frontend technologies. The application provides comprehensive features for tracking work time, managing employees, generating reports, and configuring organizational settings.

## Technology Stack

- **Framework**: Vue 3.5+ with Composition API and `<script setup>` syntax
- **Language**: TypeScript 5.6+
- **Build Tool**: Vite 5.4+
- **UI Framework**: PrimeVue 4.x with custom theming
- **State Management**: Pinia
- **Routing**: Vue Router 4 with authentication guards
- **Styling**: Tailwind CSS v4 + Sass
- **Form Validation**: Vee-validate with Yup schemas
- **Internationalization**: Vue I18n
- **Date Handling**: Day.js with UTC plugin
- **HTTP Client**: Axios with custom interceptors

## Project Structure

```
src/
├── views/              # Main application pages
│   ├── auth/          # Authentication pages (Login, Register, ForgotPassword)
│   ├── worktimeUsage/ # Time tracking and usage analytics
│   ├── company/       # Company management and reporting
│   ├── hrSettings/    # HR settings and employee management
│   ├── settings/      # Application settings
│   └── timesheets/    # Timesheet management
├── stores/            # Pinia state management stores
│   ├── auth.ts        # Authentication state
│   ├── profile/       # User profile management
│   ├── company/       # Company data and reports
│   ├── hrSettings/    # HR settings stores
│   ├── settings/      # Application settings
│   └── timeSheets/    # Timesheet data
├── components/        # Reusable Vue components
│   ├── ui/           # UI components
│   └── forms/        # Form components
├── composables/       # Vue composition functions
├── services/          # API service modules
├── types/            # TypeScript type definitions
├── interfaces/       # Interface definitions
├── enums/            # Enum definitions
│   ├── severity.enum.ts      # UI severity levels
│   ├── statisticType.enum.ts # Worktime statistic types
│   ├── chartType.enum.ts     # Chart types
│   ├── domain.enum.ts        # Domain classification
│   ├── grantType.enum.ts     # OAuth grant types
│   └── wellbeingStatus.enum.ts # Wellbeing status levels
├── router/           # Vue Router configuration
├── layouts/          # Application layouts
├── plugins/          # Vue plugins (PrimeVue, i18n, Axios)
├── helpers/          # Utility functions
├── constants/        # Application constants
└── locales/          # i18n translation files (en.json, tr.json)
```

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication with token refresh
- Role-based access control
- Protected routes with navigation guards
- OAuth integration support

**Related Files:**
- `src/views/auth/Login.vue`
- `src/views/auth/Register.vue`
- `src/views/auth/ForgotPassword.vue`
- `src/stores/auth.ts`

### 2. Worktime Usage Analytics
- Real-time time tracking
- Activity classification (Work, Leisure, Meeting, Unclassified)
- Statistical summaries with visual badges
- Distribution charts (doughnut charts)
- Graphical time analysis (bar charts)
- Export functionality

**Related Files:**
- `src/views/worktimeUsage/`
- `src/stores/worktimeUsage/`
- `src/views/worktimeUsage/_components/common/SummaryBadge.vue`
- `src/views/worktimeUsage/_components/common/BadgeGroup.vue`

### 3. Company Management & Reporting
- Employee management
- Team organization
- Project tracking
- Billable/non-billable time tracking
- Elastic reports with customizable grouping
- Visual analytics (pie charts, bar charts)

**Related Files:**
- `src/views/company/`
- `src/stores/company/`
- `src/views/company/_components/reports/`

### 4. HR Settings
- Employee profiles and management
- Department configuration
- Leave management
- Shift scheduling

**Related Files:**
- `src/views/hrSettings/`
- `src/stores/hrSettings/employees.ts`

### 5. Settings & Configuration
- User preferences
- Permissions management (with visibility controls)
- Advanced settings (time configurations)
- Application customization

**Related Files:**
- `src/views/settings/_views/Permissions.vue`
- `src/views/settings/_views/Advanced.vue`
- `src/stores/settings/`

## Development Patterns

### Component Structure
Follow this order in Vue Single File Components:

1. **Imports** - External libraries, components, composables
2. **Props** - `IProps` interface and `defineProps`
3. **Emits** - `IEmits` interface and `defineEmits`
4. **Composables & Stores** - Vue Router, Pinia stores, custom composables
5. **Reactive References** - `ref()` declarations
6. **Computed Properties** - `computed()` declarations
7. **Functions** - Use ES6 arrow functions: `const myFunction = () => {}`
8. **Watchers** - `watch()` and `watchEffect()`
9. **Lifecycle Hooks** - `onMounted()`, `onBeforeUnmount()`, etc.

### Code Style Guidelines

#### Functions
Always use ES6 arrow functions:
```typescript
// ✅ Good
const fetchData = async (): Promise<void> => {
  // implementation
};

// ❌ Bad
async function fetchData(): Promise<void> {
  // implementation
}
```

#### Type Annotations
Include return type annotations:
```typescript
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.value, 0);
};
```

#### Composables
Export functions use `export function` wrapper, but internal functions use arrow syntax:
```typescript
export function useMyComposable() {
  const internalHelper = (): void => {
    // implementation
  };

  return {
    internalHelper,
  };
}
```

## Enums Reference

### ESeverity
UI component severity levels (used in buttons, badges, alerts):
```typescript
enum ESeverity {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  WARNING = 'warning',
  DANGER = 'danger',
  ERROR = 'error',
  HELP = 'help',
  CONTRAST = 'contrast',
  LINK = 'link',
}
```

### EStatisticType
Worktime tracking categories:
```typescript
enum EStatisticType {
  WORK = 'work',
  LEISURE = 'leisure',
  MEETING = 'meeting',
  UNCLASSIFIED = 'unclassified',
  START_TIME = 'starttime',
  END_TIME = 'endtime',
}
```

### EChartType
Chart visualization types:
```typescript
enum EChartType {
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  LINE = 'line',
}
```

### EDomain
Activity domain classification:
```typescript
enum EDomain {
  UNCLASSIFIED = 1,
  LEISURE = 2,
  MEETING = 3,
  WORK = 4,
}
```

### EGrantType
OAuth grant types for authentication:
```typescript
enum EGrantType {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
}
```

## State Management

### Store Organization
Stores are organized by feature domain:

- **auth** - Authentication and session management
- **profile** - User profile data
- **company** - Company information and reports
- **hrSettings** - HR-related settings and employee data
- **settings** - Application settings and preferences
- **timeSheets** - Timesheet entries and management
- **worktimeUsage** - Time usage analytics and statistics

### Store Pattern
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMyStore = defineStore('my-store', () => {
  // State
  const data = ref<MyType[]>([]);
  const loading = ref(false);

  // Getters
  const filteredData = computed(() => data.value.filter(/* ... */));

  // Actions
  const fetchData = async (): Promise<void> => {
    loading.value = true;
    try {
      const response = await myService.getData();
      data.value = response;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    filteredData,
    fetchData,
  };
});
```

## API Integration

### Service Layer
API services are manually written in `src/services/`:
- One service file per feature domain
- Type-safe request/response handling
- Error handling with interceptors

### Axios Configuration
Base configuration in `src/plugins/axios`:
- Automatic JWT token injection
- Request/response interceptors
- Error handling and toast notifications
- Base URL from environment variable `VITE_API_URL`

### Example Service
```typescript
import axios from '@/plugins/axios';
import type { MyResponse } from '@/types/myTypes';

export const myService = {
  async getData(): Promise<MyResponse> {
    const response = await axios.get('/api/endpoint');
    return response.data;
  },
};
```

## Routing

### Route Configuration
Routes defined in `src/router/` with:
- Named routes using `ERouteNames` enum
- Authentication guards
- Meta fields for permissions and layout
- Lazy-loaded components

### Route Guards
```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: ERouteNames.Login });
  } else {
    next();
  }
});
```

## Internationalization

### Translation Files
Located in `src/locales/`:
- `en.json` - English translations
- `tr.json` - Turkish translations

### Usage in Components
```vue
<template>
  <div>{{ $t('pages.auth.login.title') }}</div>
  <div>{{ t('common.buttons.save') }}</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
</script>
```

## Form Validation

### Validation Schema Pattern
```typescript
import { object, string, boolean } from 'yup';
import { useForm } from 'vee-validate';

const validationSchema = object({
  email: string().email().required().label('Email'),
  password: string().required().min(8).label('Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const submitHandler = handleSubmit(async (values) => {
  // Handle form submission
});
```

## Development Commands

### Core Development
```bash
yarn dev          # Start development server on port 3001
yarn build        # Build for production
yarn preview      # Preview production build
```

### Code Quality
```bash
yarn lint         # Run ESLint with auto-fix
yarn format       # Format code with Prettier
yarn type-check   # Run TypeScript type checking
```

### Testing
```bash
yarn test:unit    # Run unit tests with Vitest
```

### Utilities
```bash
yarn generate-icon-names  # Generate icon name constants
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://api.example.com
```

## Build & Deployment

### Production Build
```bash
yarn build
```

Output directory: `dist/`

### Preview Build
```bash
yarn preview
```

## Best Practices

### 1. Type Safety
- Always define interfaces for props, emits, and API responses
- Use enums for categorical values
- Avoid `any` type; use `unknown` with type guards if needed

### 2. Component Organization
- Keep components focused on single responsibility
- Extract reusable logic into composables
- Use proper props/emits for parent-child communication

### 3. State Management
- Use Pinia stores for shared state
- Keep component-local state in `ref()` when appropriate
- Prefer computed properties over methods for derived state

### 4. Performance
- Use `v-memo` for expensive list items
- Lazy load routes and heavy components
- Optimize computed properties to avoid unnecessary recalculations

### 5. Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works

### 6. Security
- Never store sensitive data in localStorage without encryption
- Validate all user inputs
- Use HTTP-only cookies for sensitive tokens when possible
- Sanitize user-generated content

## Common Patterns

### Loading States
```typescript
const isLoading = ref(false);

const fetchData = async (): Promise<void> => {
  isLoading.value = true;
  try {
    await someAsyncOperation();
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};
```

### Toast Notifications
```typescript
import { useFToast } from '@/composables/useFToast';

const { showSuccessMessage, showErrorMessage } = useFToast();

// Success
showSuccessMessage(t('messages.success'));

// Error
showErrorMessage(error as any);
```

### Modal Handling
```typescript
const isModalVisible = ref(false);

const openModal = (): void => {
  isModalVisible.value = true;
};

const closeModal = (): void => {
  isModalVisible.value = false;
};
```

## Troubleshooting

### Common Issues

#### 1. Type Check Errors
Run type checking to identify issues:
```bash
yarn type-check
```

#### 2. Import Path Issues
Ensure you're using the `@/` alias for imports:
```typescript
import { MyComponent } from '@/components/MyComponent.vue';
```

#### 3. PrimeVue Component Not Found
Check that auto-imports are configured in `vite.config.ts`

#### 4. i18n Key Missing
Add missing translation keys to both `en.json` and `tr.json`

## Contributing

1. Follow the established code structure and patterns
2. Write type-safe code with proper interfaces
3. Add comments for complex logic
4. Update documentation for new features
5. Test changes before committing

## License

[Specify License]

## Contact

[Specify Contact Information]

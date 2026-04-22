# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `yarn dev` - Start development server on port 8081
- `yarn build` - Build for production (includes TypeScript compilation)
- `yarn preview` - Preview production build

### Code Quality

- `yarn lint` - Run ESLint with auto-fix AND check Vue Composition API order
- `yarn lint:eslint` - Run only ESLint with auto-fix
- `yarn lint:order` - Check Vue Composition API order (reports violations)
- `yarn format` - Format code with Prettier
- `yarn type-check` - Run TypeScript type checking without compilation

### Testing

- `yarn test:unit` - Run unit tests with Vitest

### Utilities

- `yarn generate-icon-names` - Generate icon name constants from scripts

### ESLint Configuration

The project includes automated checking for:

- **Import sorting**: Automatic grouping and sorting of imports
- **Vue block order**: template → script → style
- **Component attributes order**: Standardized attribute ordering
- **Composition API order**: Enforces the order defined in Component Structure section below

## MCP Tools

### Context7

Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

### PrimeVue Documentation for LLMs

When working with PrimeVue components, use these official LLM-optimized documentation URLs:

- **Index**: `https://primevue.org/llms/llms.txt` - Lists all available guides and components
- **Full Documentation**: `https://primevue.org/llms/llms-full.txt` - Complete documentation in single file
- **Component Docs**: `https://primevue.org/llms/components/{component}.md` - Individual component docs (e.g., `datepicker.md`, `button.md`, `datatable.md`)

Use WebFetch to retrieve these when you need PrimeVue component documentation, props, events, or usage examples.

## Project Architecture

### Technology Stack

- **Framework**: Vue 3 with Composition API and `<script setup>` syntax
- **Build Tool**: Vite with TypeScript support
- **UI Library**: PrimeVue 4.x with auto-imports and custom theming
- **State Management**: Pinia stores organized by feature domains
- **Routing**: Vue Router 4 with authentication guards
- **Styling**: Tailwind CSS + Sass for component styles
- **API Client**: Manually written TypeScript services and types
- **Forms**: Vee-validate with Yup validation schemas
- **Internationalization**: Vue I18n
- **Date Handling**: Day.js with UTC plugin

### Directory Structure

#### Key Directories

- `src/views/` - Main application pages organized by feature (auth, worktimeUsage, etc.)
- `src/stores/` - Pinia stores grouped by domain (auth, profile, company, timeSheets, etc.)
- `src/services/` - Manually written API service modules for backend communication
- `src/types/` - TypeScript type definitions for API models and app-specific types
- `src/components/` - Reusable Vue components
- `src/composables/` - Vue composition functions for shared logic
- `src/router/` - Vue Router configuration with authentication guards
- `src/interfaces/` - Interface definitions
- `src/constants/` - Application constants including storage keys
- `src/helpers/` - Utility functions
- `src/plugins/` - Vue plugins configuration (PrimeVue, i18n, Axios, etc.)
- `src/layouts/` - Application layout components

#### State Management Architecture

Each feature domain has its own Pinia store in `src/stores/`:

- Authentication and user session management
- Profile and user settings
- Company and organizational data
- Time tracking and worksheets
- HR settings and configurations
- Usage analytics and reporting

### Development Patterns

#### Component Structure (from README.md)

Follow this order in Vue SFCs:

1. Imports
2. Interfaces and Types (`interface IProps`, `interface IEmits`, `type` definitions)
3. `defineProps` (uses interfaces defined above)
4. `defineEmits` (uses interfaces defined above)
5. Composables and stores
6. Reactive references (`ref`)
7. Computed properties
8. Functions (use ES6 arrow functions: `const myFunction = () => {}`)
9. Watchers
10. Lifecycle hooks (`onMounted`, etc.)

#### Code Style Guidelines

- **Functions**: Always use ES6 arrow functions (`const functionName = () => {}`) instead of `function` declarations
- **Async Functions**: Use arrow syntax (`const functionName = async () => {}`)
- **Type Annotations**: Include return type annotations for arrow functions when applicable
- **Composables**: Export functions use `export function` wrapper, but internal functions use arrow syntax

#### Authentication

- Uses JWT tokens stored in localStorage
- Router guards check authentication before protected routes
- Automatic token refresh with fallback to logout
- Supports both authenticated and unauthenticated route requirements

#### API Integration

- API services are **OpenAPI-generated** under `@/client` (see `src/client/services/*ApiService.ts`). Never hand-edit.
- Custom endpoints not covered by the spec live in `@/customClient` (e.g. `LoginService`).
- DTO types are imported from `@/client` as type-only (`import type { … } from '@/client'`).
- Base URL set in `main.ts` via `OpenAPI.BASE = import.meta.env.VITE_API_URL`.
- Auth token is carried via `OpenAPI.TOKEN`, set by `stores/auth.ts`. There is no axios auth interceptor.
- `src/services/` is deprecated and intentionally empty — do not add new files there.

### Configuration Files

- **Vite**: Auto-imports PrimeVue components, `@` alias points to `src/`
- **TypeScript**: Project references for app, node, and test configurations
- **Tailwind**: Custom configuration for design system
- **ESLint**: Vue 3 + TypeScript rules with Prettier integration

## Dark Theme System

This project has a fully implemented dark theme system. **All new development MUST be dark theme compatible.**

### Semantic Color Tokens (MANDATORY)

Never use direct Tailwind colors (`text-gray-500`, `bg-white`, `border-slate-200`). Always use semantic tokens defined in `src/tailwind.css`:

| Category | Token | Usage |
|----------|-------|-------|
| **Surface** | `bg-surface-primary` | Main background |
| | `bg-surface-secondary` | Secondary background |
| | `bg-surface-tertiary` | Tertiary/nested background |
| | `bg-surface-elevated` | Cards, modals, dropdowns |
| **Content** | `text-content-primary` | Main text |
| | `text-content-secondary` | Secondary text |
| | `text-content-tertiary` | Tertiary/placeholder text |
| | `text-content-muted` | Disabled/muted text |
| **Border** | `border-border-primary` | Primary borders |
| | `border-border-secondary` | Secondary/subtle borders |
| **Brand** | `text-brand-primary` | Brand color (purple) |
| | `bg-brand-primary` | Brand background |
| **State** | `text-state-success` | Success state |
| | `bg-state-success-bg` | Success background |
| **Interactive** | `bg-interactive-hover` | Hover state |
| | `bg-interactive-selected` | Selected state |

### Example Usage

```vue
<!-- ✅ CORRECT: Using semantic tokens -->
<div class="bg-surface-primary dark:bg-surface-secondary
            border border-border-secondary dark:border-border-primary
            text-content-primary transition-colors">

<!-- ❌ WRONG: Using direct colors -->
<div class="bg-white dark:bg-gray-800 border-gray-200 text-gray-900">
```

### Theme Composable

```typescript
import { useTheme } from '@/composables/useTheme';

const { isDark, toggleTheme, setTheme } = useTheme();
```

### PrimeVue Dark Theme

PrimeVue components automatically receive dark theme styles from global CSS in `src/tailwind.css`. For custom overrides:

```vue
<Card class="!bg-surface-primary dark:!bg-surface-secondary !border !border-border-secondary dark:!border-border-primary">
```

### Key Rules

1. Always use semantic color tokens, never direct colors
2. Add `transition-colors` for smooth theme transitions
3. Test both light and dark modes during development
4. For nested elements, use `surface-tertiary` or opacity (`/50`) for contrast
5. Borders are critical for visibility in dark mode

## Project Rules

Detailed project rules live in [`.claude/rules/`](./.claude/rules/). Every file there is mandatory unless the user explicitly overrides in conversation.

| File | Scope |
|---|---|
| [vue-components.md](./.claude/rules/vue-components.md) | SFC structure, `<script setup>`, Composition API order |
| [styling.md](./.claude/rules/styling.md) | Tailwind semantic tokens, dark mode, forbidden colors |
| [i18n.md](./.claude/rules/i18n.md) | No hardcoded strings, `en.json` + `tr.json` parity |
| [state-services.md](./.claude/rules/state-services.md) | Pinia stores, services, axios usage |
| [forms.md](./.claude/rules/forms.md) | vee-validate + yup patterns |
| [dates.md](./.claude/rules/dates.md) | dayjs only, no moment/native Date math |
| [routing-auth.md](./.claude/rules/routing-auth.md) | Router guards, route meta, lazy loading |
| [typescript.md](./.claude/rules/typescript.md) | No `any`, no non-null `!`, explicit public APIs |
| [naming.md](./.claude/rules/naming.md) | Files, folders, composables, stores, props, emits, keys |
| [commits.md](./.claude/rules/commits.md) | Conventional Commits with examples |
| [branches-prs.md](./.claude/rules/branches-prs.md) | Branch naming, PR format, review checklist |
| [done-checklist.md](./.claude/rules/done-checklist.md) | Verify before marking a task done |
| [anti-patterns.md](./.claude/rules/anti-patterns.md) | Things to reject on sight |

When touching a specific concern, load the matching rule file. More specific files win over generic notes in this document.

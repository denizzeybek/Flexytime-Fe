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

- API services manually written in `src/services/`
- Type definitions manually maintained in `src/types/`
- Base URL configured via `VITE_API_URL` environment variable
- Axios interceptors configured in `src/plugins/axios` for auth and error handling
- **Note**: Backend is not yet ready for OpenAPI code generation, so all API types and services are written manually

### Configuration Files

- **Vite**: Auto-imports PrimeVue components, `@` alias points to `src/`
- **TypeScript**: Project references for app, node, and test configurations
- **Tailwind**: Custom configuration for design system
- **ESLint**: Vue 3 + TypeScript rules with Prettier integration

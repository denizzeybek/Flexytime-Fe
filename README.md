Now I have enough information to create a comprehensive README.md. Let me write it:

# Flexytime - Modern Time Tracking & Workforce Management Platform

A comprehensive enterprise-grade workforce management solution built with Vue 3, TypeScript, and modern web technologies. Flexytime provides real-time employee productivity tracking, time sheet management, and organizational insights through an intuitive and responsive interface.

## Features

### Core Modules

- **Time Tracking & Worksheets**

  - Manual and automated time entry systems
  - Project-based time allocation
  - Time management for teams and individuals
  - Unclassified time entry handling
  - Real-time worktime usage analytics

- **Workforce Analytics**

  - Employee productivity metrics
  - Team wellbeing dashboards
  - Web activity history tracking
  - Customizable reports and insights
  - Data export capabilities (Excel, CSV)

- **HR Management**

  - Employee directory and profiles
  - Annual leave management
  - Holiday calendar administration
  - Organization chart visualization
  - Working hours configuration

- **Application & Web Classification**

  - Application usage tracking
  - Web address categorization
  - Productivity classification rules
  - Activity monitoring

- **Advanced Reporting**

  - Default and elastic report generation
  - Customizable report templates
  - Multi-format data export
  - Real-time analytics dashboards

- **Multi-Company Support**

  - Company management interface
  - Role-based permissions
  - Customizable organizational settings
  - Advanced configuration options

- **Authentication & Security**

  - JWT-based authentication
  - Email/password and OAuth support
  - Secure password recovery
  - Session management
  - Role-based access control

- **Internationalization**
  - Multi-language support (English, Turkish)
  - Localized date/time formatting
  - RTL support ready

## Tech Stack

### Frontend Framework

- **Vue 3.5** - Composition API with `<script setup>` syntax
- **TypeScript 5.5** - Full type safety across the application
- **Vite 5.4** - Lightning-fast development and optimized builds

### UI & Styling

- **PrimeVue 4.2** - Enterprise-grade component library with custom theming
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **PrimeIcons** - Comprehensive icon library
- **Sass** - Advanced styling capabilities

### State & Data Management

- **Pinia 2.2** - Intuitive state management with TypeScript support
- **Vue Router 4.4** - Client-side routing with navigation guards
- **Axios 1.7** - HTTP client with interceptors

### Form Handling & Validation

- **Vee-Validate 4.14** - Declarative form validation
- **Yup 1.4** - Schema-based validation

### Utilities & Libraries

- **Vue I18n 10.0** - Internationalization framework
- **Day.js 1.11** - Date manipulation with UTC support
- **Chart.js 4.4** - Data visualization
- **ExcelJS 4.4** - Excel file generation
- **VueUse 11.2** - Collection of Vue composition utilities
- **Lodash 4.17** - Utility functions
- **Vue Toastification** - Toast notifications

### Development Tools

- **Vitest 2.1** - Unit testing framework
- **ESLint 9** - Code linting with Vue and TypeScript support
- **Prettier 3.3** - Code formatting
- **Vue Test Utils 2.4** - Component testing utilities

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Setup

1. **Clone the repository**

git clone <repository-url>
cd flexytime-fe

2. **Install dependencies**

yarn install

# or

npm install

3. **Configure environment variables**
   Create a `.env` file in the root directory:

VITE_API_URL=http://localhost:8080/api

4. **Start development server**

yarn dev

The application will be available at `http://localhost:8081`

## Available Scripts

### Development

yarn dev # Start development server on port 8081
yarn preview # Preview production build locally

### Building

yarn build # Build for production (includes type checking)
yarn build-only # Build without type checking

### Code Quality

yarn type-check # Run TypeScript type checking
yarn lint # Run ESLint with auto-fix
yarn format # Format code with Prettier

### Testing

yarn test:unit # Run unit tests with Vitest

### Utilities

yarn generate-icon-names # Generate icon name constants from PrimeIcons

## Project Structure

flexytime-fe/
├── src/
│ ├── views/ # Feature-based page components
│ │ ├── auth/ # Authentication pages (Login, Register, etc.)
│ │ ├── worktimeUsage/ # Work time analytics and tracking
│ │ ├── timesheets/ # Time entry and management
│ │ ├── hrSettings/ # HR administration (Employees, Holidays, Annuals)
│ │ ├── company/ # Company settings and reports
│ │ ├── classification/ # App and web classification
│ │ ├── settings/ # System settings and companies
│ │ ├── profile/ # User profile management
│ │ ├── promotion/ # Promotional features
│ │ └── download/ # Download and installation
│ │
│ ├── stores/ # Pinia state management stores
│ │ ├── auth.ts # Authentication state
│ │ ├── profile/ # User profile store
│ │ ├── company/ # Company data and reports
│ │ ├── timeSheets/ # Time tracking state
│ │ ├── hrSettings/ # HR settings stores
│ │ ├── worktimeUsage/ # Analytics state
│ │ ├── classification/ # Classification stores
│ │ └── settings/ # Application settings
│ │
│ ├── components/ # Reusable Vue components
│ │ └── ui/
│ │ ├── global/ # App-wide shared components
│ │ └── local/ # Context-specific components
│ │
│ ├── layouts/ # Layout wrapper components
│ │ ├── default/ # Main application layout
│ │ ├── auth/ # Authentication layout
│ │ └── empty/ # Minimal layout
│ │
│ ├── router/ # Vue Router configuration
│ │ ├── index.ts # Router setup with guards
│ │ ├── routes.ts # Route definitions
│ │ └── routeNames.enum.ts # Route name constants
│ │
│ ├── client/ # API client (future OpenAPI integration)
│ ├── types/ # TypeScript type definitions
│ ├── interfaces/ # TypeScript interfaces
│ ├── enums/ # TypeScript enumerations
│ ├── composables/ # Vue composition functions
│ ├── helpers/ # Utility functions
│ ├── constants/ # Application constants
│ ├── plugins/ # Vue plugin configurations
│ ├── locales/ # i18n translation files (en, tr)
│ ├── assets/ # Static assets (images, styles)
│ └── main.ts # Application entry point
│
├── public/ # Static public assets
├── scripts/ # Build and utility scripts
├── dist/ # Production build output
│
├── vite.config.js # Vite configuration
├── tsconfig.json # TypeScript configuration
├── tailwind.config.js # Tailwind CSS configuration
├── eslint.config.js # ESLint configuration
├── vitest.config.js # Vitest test configuration
└── package.json # Project dependencies and scripts

## Development Guidelines

### Component Organization

Follow this structure order in Vue Single File Components:

1. Imports
2. Props interface (`IProps`) and `defineProps`
3. Emits interface (`IEmits`) and `defineEmits`
4. Composables and stores
5. Reactive references (`ref`)
6. Computed properties
7. Functions (ES6 arrow functions: `const myFunction = () => {}`)
8. Watchers
9. Lifecycle hooks (`onMounted`, etc.)

### Code Style

- **Functions**: Use ES6 arrow functions (`const functionName = () => {}`)
- **Async Functions**: Arrow syntax with async (`const functionName = async () => {}`)
- **Type Safety**: Include return type annotations for functions
- **Imports**: Use `@/` alias for src directory imports

### State Management Pattern

Each feature domain has dedicated Pinia stores:

- Organize stores by feature modules
- Use TypeScript for type-safe state
- Define clear actions and getters
- Keep stores focused and single-responsibility

### Authentication Flow

- JWT tokens stored in localStorage
- Router guards protect authenticated routes
- Automatic token refresh on API calls
- Centralized error handling via Axios interceptors

### API Integration

- API services manually written in `src/client/`
- Type definitions maintained in `src/types/`
- Base URL configured via `VITE_API_URL` environment variable
- Axios interceptors handle authentication and errors
- Future migration to OpenAPI code generation planned

## Contributing

### Code Quality Standards

1. **Type Safety**: Ensure all TypeScript types are properly defined
2. **Linting**: Run `yarn lint` before committing
3. **Formatting**: Code must pass `yarn format` check
4. **Testing**: Write unit tests for new features
5. **Type Checking**: Pass `yarn type-check` validation

### Development Workflow

1. Create a feature branch from `dev`
2. Make your changes following the coding guidelines
3. Run tests and quality checks
4. Submit a pull request with clear description
5. Ensure CI/CD pipeline passes

### Commit Message Guidelines

Use conventional commit format:

- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `style:` Formatting changes
- `docs:` Documentation updates
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern browsers with ES6+ support

## License

Private and proprietary. All rights reserved.

## Support

For issues, questions, or contributions, please contact the development team or refer to the internal documentation portal.

---

**Built with Vue 3, TypeScript, and modern web technologies**

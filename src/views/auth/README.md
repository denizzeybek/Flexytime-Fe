# Authentication Module

This directory contains all authentication-related Vue components for the FlexyTime application. The authentication system handles user login, registration, password reset, and onboarding flows.

## File Responsibilities

### `Login.vue`
**Purpose**: User login interface with email/password authentication

**Key Features**:
- Email and password validation using Yup schema
- Form handling with Vee-validate
- OAuth2 token-based authentication
- Google login integration (UI only - backend implementation pending)
- Error handling with toast notifications
- Automatic redirect to dashboard after successful login

**Form Fields**:
- `email`: Required, validated email format
- `password`: Required text field

**Dependencies**:
- `useAuthStore` for login API calls
- `useProfileStore` for user profile management
- `useCommonUsersStore` for user state management

### `Register.vue`
**Purpose**: User registration interface for creating new accounts

**Key Features**:
- Multi-field registration form
- Google registration option (UI placeholder)
- Form validation with Yup
- Currently incomplete - missing backend integration

**Form Fields**:
- `companyName`: Required company name
- `fullName`: Required user full name  
- `email`: Required, validated email format
- `password`: Required password field

**Status**: ⚠️ **Incomplete Implementation** - Form submission only logs values, no actual registration API call

### `ForgotPassword.vue`
**Purpose**: Password reset interface

**Key Features**:
- Simple password reset form
- Form validation for new password
- Currently incomplete implementation

**Form Fields**:
- `password`: Required new password field

**Status**: ⚠️ **Incomplete Implementation** - Form submission only logs values, missing reset token handling and API integration

### `WizardDownload.vue`
**Purpose**: Post-authentication onboarding step for desktop client download

**Key Features**:
- Wrapper component for the Download wizard
- Skip functionality to bypass download
- Part of the user onboarding flow after login
- Uses the shared `Download` component with wizard-specific props

## Authentication Flow

### 1. Login Process
```typescript
// Login form submission flow
const submitHandler = handleSubmit(async (values) => {
  const payload = {
    username: values.email,
    password: values.password,
    grant_type: 'password',
  };
  
  await authStore.login(payload);
  // Navigate to main dashboard
  router.push({ name: ERouteNames.WorktimeUsageProductivityTeam });
});
```

### 2. Token Management
- **Access Token**: Stored in localStorage as `EStorageKeys.TOKEN`
- **Refresh Token**: Stored in localStorage as `EStorageKeys.REFRESH_TOKEN`
- **Token Validation**: Handled by router guards in `src/router/index.ts`

### 3. Route Protection
Authentication routes use `requiresUnAuth: true` meta property:
- Prevents authenticated users from accessing login/register pages
- Automatically redirects authenticated users away from auth pages

Protected routes use `requiresAuth: true` meta property:
- Requires valid token in localStorage
- Redirects unauthenticated users to login page

### 4. Authentication Store Flow
```typescript
// Login API call
async login(payload: LoginModel) {
  const response = await axios.post<LoginResponse>('/oauth/token', qs.stringify(payload));
  const { access_token, refresh_token } = response.data;
  localStorage.setItem(EStorageKeys.TOKEN, access_token!);
  localStorage.setItem(EStorageKeys.REFRESH_TOKEN, refresh_token!);
  return response;
}
```

## Development Patterns

### Form Validation
All authentication forms follow this pattern:
```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { string, object } from 'yup';

const validationSchema = object({
  email: string().email().required().label('Email'),
  password: string().required().label('Password'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});
</script>
```

### Error Handling
Consistent error handling using the toast composable:
```typescript
import { useFToast } from '@/composables/useFToast';
const { showSuccessMessage, showErrorMessage } = useFToast();

try {
  // API call
  showSuccessMessage('Success message');
} catch (error: any) {
  showErrorMessage(error);
}
```

### Component Structure
All auth components follow this structure:
1. **Template**: Uses `AuthLayout` wrapper component
2. **Form**: Vee-validate form with PrimeVue components (`FInput`, `FPassword`, `Button`)
3. **Navigation**: RouterLink components for page transitions
4. **Script**: Composition API with validation, form handling, and store interactions

## Common Pitfalls

### 1. ⚠️ Incomplete Implementations
- **Register.vue**: Only has form UI, missing backend integration
- **ForgotPassword.vue**: Missing token handling and API calls
- **Google Authentication**: UI exists but no backend integration

### 2. 🔐 Security Considerations
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- No token expiration handling in current implementation
- Missing CSRF protection

### 3. 📝 Form Validation
- Always use Yup schema for consistent validation
- Remember to add `.label()` for better error messages
- Handle loading states with `isSubmitting`

### 4. 🔄 Navigation Flow
- Use route names from `ERouteNames` enum, not hardcoded paths
- Handle both success and error navigation scenarios
- Consider user experience for form validation errors

## Integration Points

### Stores Used
- `useAuthStore()` - Authentication state and API calls
- `useProfileStore()` - User profile management  
- `useCommonUsersStore()` - User session state

### Layout Components
- `AuthLayout` - Shared layout wrapper for all auth pages
- Provides consistent styling and ad space management

### Router Configuration
Authentication routes are defined in `src/router/routes.ts`:
- All auth routes use `requiresUnAuth: true`
- Protected by router guards in `src/router/index.ts`

### Storage Keys
Defined in `src/constants/storageKeys.ts`:
- `TOKEN` - JWT access token
- `REFRESH_TOKEN` - OAuth refresh token
- `USER` - User profile data
- `AUTHENTICATION` - Authentication metadata

## Code Examples

### Adding New Authentication Route
```typescript
// In src/router/routes.ts
{
  path: '/new-auth-page',
  name: ERouteNames.NewAuthPage,
  component: NewAuthPage,
  meta: {
    requiresUnAuth: true,
    title: ERouteNames.NewAuthPage,
    name: ERouteNames.NewAuthPage,
  },
}
```

### Custom Form Component
```vue
<template>
  <AuthLayout adName="custom-auth">
    <div class="flex flex-col justify-center w-full max-w-xs m-auto">
      <FText as="h1" class="mb-8 text-center">Custom Auth</FText>
      
      <form class="flex flex-col gap-5" @submit="submitHandler">
        <FInput type="email" id="email" label="Email" name="email" />
        
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          label="Submit"
          class="w-full"
        />
      </form>
    </div>
  </AuthLayout>
</template>
```

## Testing Considerations

- Test form validation with invalid inputs
- Verify error handling for network failures
- Check navigation flows for all success/error scenarios
- Validate token storage and retrieval
- Test router guard behavior for auth state changes
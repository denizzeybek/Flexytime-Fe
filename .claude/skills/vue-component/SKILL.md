---
name: vue-component
description: Generate a new Vue 3 SFC component following Flexytime project conventions. Use when creating new components, scaffolding UI elements, or when the user says 'yeni component', 'component olustur', 'create component'.
argument-hint: [ComponentName] [page-context]
---

# Vue 3 Component Generator - Flexytime

Generate a new Vue 3 Single File Component following the Flexytime project's strict conventions.

## Arguments

- `$ARGUMENTS[0]` - Component name (PascalCase, e.g., `UserCard`)
- `$ARGUMENTS[1]` - Page/feature context (e.g., `settings`, `worktimeUsage`)

## Component Template

Generate the component with this exact block order: `<template>` -> `<script setup>` -> `<style>`

### Script Setup Order (MANDATORY)

Follow this exact order in `<script setup lang="ts">`:

```
1. Imports (vue, vue-i18n, vee-validate, composables, stores, types)
2. Interfaces/Types (interface IProps, interface IEmits)
3. defineProps<IProps>()
4. defineEmits<IEmits>()
5. Composables & stores (useI18n, useStore, etc.)
6. Reactive references (ref)
7. Computed properties (computed)
8. Functions (ONLY arrow functions: const fn = () => {})
9. Watchers (watch, watchEffect)
10. Lifecycle hooks (onMounted, onUnmounted)
```

### i18n Setup

Always include type-safe i18n:

```typescript
import { useI18n } from 'vue-i18n';
import { type MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
```

### Code Style Rules

- **Functions**: ALWAYS use ES6 arrow functions (`const fn = () => {}`)
- **Async**: `const fn = async () => {}`
- **File naming**: PascalCase for components (`UserCard.vue`)
- **Interface naming**: `IProps`, `IEmits` prefix convention
- **No function declarations**: Never use `function` keyword

### Placement Rules

- Page-specific components: `src/views/<page>/_components/`
- Shared/reusable components: `src/components/`
- Sub-page components: `src/views/<page>/_components/subPages/<subPage>/`

## After Generation

Run these checks:
```bash
yarn type-check
yarn lint
```

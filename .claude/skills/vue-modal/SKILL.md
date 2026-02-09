---
name: vue-modal
description: Generate a modal dialog component with form validation using PrimeVue Dialog, vee-validate, and Yup. Use when creating modals, forms, edit dialogs, or when the user says 'modal olustur', 'form modal', 'create modal', 'dialog olustur'.
argument-hint: [ModalName] [page-context]
---

# Modal Form Component Generator - Flexytime

Generate a PrimeVue Dialog modal with vee-validate form and Yup validation.

## Arguments

- `$ARGUMENTS[0]` - Modal name (PascalCase, e.g., `CompanyModal`)
- `$ARGUMENTS[1]` - Page/feature context (e.g., `settings/companies`)

## Template Structure

```vue
<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('modal.update.header') : t('modal.add.header')"
    class="lg:!w-[700px] !w-full"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <!-- Form fields using FInput, FSelect, FDateTimePicker etc. -->
      <div class="flex justify-center gap-4">
        <Button
          type="button"
          :label="t('common.buttons.cancel')"
          severity="secondary"
          @click="open = false"
        />
        <Button
          :disabled="isSubmitting"
          :loading="isSubmitting"
          type="submit"
          :label="t('common.buttons.save')"
        />
      </div>
    </form>
  </Dialog>
</template>
```

## Script Structure

Follow the mandatory Composition API order:

```typescript
<script setup lang="ts">
// 1. Imports
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useXxxStore } from '@/stores/xxx';
import type { XxxViewModel } from '@/client';

// 2. Interfaces/Types
interface IProps {
  data?: XxxViewModel;
}

// 3. defineProps
const props = defineProps<IProps>();

// 4. defineEmits (if needed)

// 5. Composables & stores
const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const xxxStore = useXxxStore();
const open = defineModel<boolean>('open');

const validationSchema = object({
  // field validations
});

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema });

// 6. Refs

// 7. Computed
const isEditing = computed(() => !!props.data);

// 8. Functions (ONLY arrow functions)
const handleClose = () => {
  open.value = false;
  resetForm();
};

const submitHandler = handleSubmit(async (values) => {
  const payload = {
    // map form values to API payload
    ...(isEditing.value && { ID: props.data?.ID }),
  };

  await executeWithFeedback(
    () => xxxStore.save(payload),
    t('modal.messages.success'),
  );

  handleClose();
});

// 9. Watchers

// 10. Lifecycle
onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
</script>
```

## Form Components

Use project wrapper components:
- `FInput` - Text input with vee-validate
- `FSelect` - Select dropdown with add-new option
- `FDateTimePicker` - Date/time picker
- `FCheckbox` - Checkbox input
- `FEmailList` - Multiple email input

## Validation Patterns

```typescript
// Simple
const schema = object({
  name: string().required().label('Name'),
  email: string().required().email().label('Email'),
});

// Object (select)
const schema = object({
  category: object()
    .shape({ name: string(), value: string() })
    .required()
    .label('Category'),
});

// Conditional
const schema = object({
  date: string()
    .when([], {
      is: () => someCondition.value,
      then: (s) => s.required(),
      otherwise: (s) => s.nullable(),
    })
    .label('Date'),
});
```

## Placement

Modal components go in: `src/views/<page>/_components/<feature>/_modals/`

## After Generation

```bash
yarn type-check
yarn lint
```

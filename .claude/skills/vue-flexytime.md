# Flexytime Vue 3 Development Skill

Bu skill, Flexytime projesinde Vue 3 component'leri, composable'lar ve store'lar geliştirmek için kullanılır.

## Teknoloji Stack

- **Framework**: Vue 3 + Composition API + `<script setup>`
- **Build**: Vite + TypeScript
- **UI**: PrimeVue 4.x + Tailwind CSS
- **State**: Pinia (feature-domain stores)
- **Forms**: Vee-validate + Yup
- **i18n**: Vue I18n (type-safe)
- **Date**: Day.js
- **API**: OpenAPI generated client (`@/client`)

## Composition API Sıralaması (ZORUNLU)

Her Vue component'inde şu sıralama kesinlikle uygulanmalıdır:

```
1. Imports
2. Interfaces/Types (interface IProps, interface IEmits, type tanımları)
3. defineProps (IProps interface'i kullanır)
4. defineEmits (IEmits interface'i kullanır)
5. Composables ve stores (use* fonksiyonları)
6. Reactive references (ref)
7. Computed properties (computed)
8. Functions (SADECE arrow function: const fn = () => {})
9. Watchers (watch, watchEffect)
10. Lifecycle hooks (onMounted, onUnmounted, vb.)
```

## Örnek Component: Modal Form

```vue
<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('modal.update.header') : t('modal.add.header')"
    class="lg:!w-[700px] !w-full"
  >
    <form class="flex flex-col gap-6" @submit="submitHandler">
      <div class="flex gap-4 flex-1">
        <FSelect
          class="grow"
          :label="t('modal.employee.label')"
          name="employee"
          :placeholder="t('modal.employee.placeholder')"
          :options="employeeOptions"
        />
      </div>
      <div class="flex gap-4 flex-1">
        <FInput
          class="grow"
          :label="t('modal.name.label')"
          name="name"
          :placeholder="t('modal.name.placeholder')"
        />
      </div>
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

<script setup lang="ts">
// 1. Imports
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useForm } from 'vee-validate';
import { object, string } from 'yup';

import { useOperationFeedback } from '@/composables/useOperationFeedback';
import { type MessageSchema } from '@/plugins/i18n';
import { useExampleStore } from '@/stores/example';

import type { ExampleViewModel } from '@/client';

// 2. Interfaces/Types
interface IProps {
  data?: ExampleViewModel;
}

// 3. defineProps
const props = defineProps<IProps>();

// 4. defineEmits (gerekirse)
// interface IEmits { (e: 'saved'): void }
// const emit = defineEmits<IEmits>();

// 5. Composables ve Stores
const { t } = useI18n<{ message: MessageSchema }>();
const { executeWithFeedback } = useOperationFeedback({ showLoading: false });
const exampleStore = useExampleStore();

const open = defineModel<boolean>('open');

const validationSchema = object({
  employee: object()
    .shape({
      name: string().label('Name'),
      value: string().label('Value'),
    })
    .required()
    .label('Employee'),
  name: string().required().label('Name'),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema,
});

// 6. Refs (bu örnekte yok)

// 7. Computed
const isEditing = computed(() => !!props.data);

const employeeOptions = computed(() => {
  return exampleStore.employees.map((emp) => ({
    name: emp.Name,
    value: emp.ID,
  }));
});

const getInitialFormData = computed(() => {
  const item = props.data;
  if (item) {
    return {
      employee: { name: item.EmployeeName, value: item.EmployeeId },
      name: item.Name,
    };
  }
  return {};
});

// 8. Functions (SADECE arrow function)
const handleClose = () => {
  open.value = false;
  resetForm();
};

const submitHandler = handleSubmit(async (values) => {
  const payload = {
    EmployeeId: values.employee.value,
    Name: values.name,
    ...(isEditing.value && { ID: props.data?.ID }),
  } as ExampleViewModel;

  await executeWithFeedback(
    () => exampleStore.save(payload),
    t('modal.messages.success'),
  );

  handleClose();
});

// 9. Watchers (bu örnekte yok)

// 10. Lifecycle hooks
onMounted(() => {
  resetForm({ values: getInitialFormData.value });
});
</script>
```

## Örnek Composable: useTimer

```typescript
// src/composables/useTimer.ts
import { computed, onUnmounted, ref } from 'vue';

export const useTimer = () => {
  // Refs
  const elapsedTime = ref(0);
  const isRunning = ref(false);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // Computed
  const formattedTime = computed(() => {
    const hours = Math.floor(elapsedTime.value / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime.value % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime.value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  });

  // Functions (arrow syntax)
  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      timerInterval = setInterval(() => {
        elapsedTime.value += 1;
      }, 1000);
    }
  };

  const stop = () => {
    if (isRunning.value) {
      isRunning.value = false;
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  };

  const reset = () => {
    stop();
    elapsedTime.value = 0;
  };

  // Lifecycle
  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });

  return {
    elapsedTime,
    isRunning,
    formattedTime,
    start,
    stop,
    reset,
  };
};
```

## Örnek Pinia Store

```typescript
// src/stores/example.ts
import { defineStore } from 'pinia';

import { ExampleApiService } from '@/client';
import { EStoreNames } from '@/constants/storeNames.enum';

import type { ExampleViewModel } from '@/client';

interface State {
  items: ExampleViewModel[];
  employees: { ID: string; Name: string }[];
  isLoading: boolean;
}

export const useExampleStore = defineStore(EStoreNames.EXAMPLE, {
  state: (): State => ({
    items: [],
    employees: [],
    isLoading: false,
  }),

  getters: {
    activeItems: (state): ExampleViewModel[] => {
      return state.items.filter((item) => item.IsActive);
    },
  },

  actions: {
    async filter() {
      this.isLoading = true;
      try {
        const response = await ExampleApiService.exampleApiFilter();
        this.items = response.Items ?? [];
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    async save(payload: ExampleViewModel) {
      const response = await ExampleApiService.exampleApiSave(payload);
      await this.filter();
      return response;
    },

    async delete(id: string) {
      await ExampleApiService.exampleApiDelete({ ID: id });
      await this.filter();
    },
  },
});
```

## Form Validation Patterns

### Basit Validation
```typescript
const validationSchema = object({
  email: string().required().email().label('Email'),
  password: string().required().min(6).label('Password'),
});
```

### Conditional Validation
```typescript
const validationSchema = object({
  date: string()
    .when([], {
      is: () => isManualMode.value,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('Date'),
});
```

### Object/Array Validation
```typescript
const validationSchema = object({
  project: object()
    .shape({
      name: string().label('Name'),
      value: string().required().label('Value'),
    })
    .nullable()
    .label('Project'),
  tags: array()
    .of(
      object().shape({
        name: string().required(),
        value: string().required(),
      }),
    )
    .label('Tags'),
});
```

## i18n Kullanımı

```typescript
// Composable setup
const { t } = useI18n<{ message: MessageSchema }>();

// Basit kullanım
t('pages.example.title')

// Parametreli kullanım
t('messages.itemAdded', { name: itemName })

// Template içinde
{{ t('common.buttons.save') }}
```

## Error Handling Pattern

```typescript
const { showSuccessMessage, showErrorMessage } = useFToast();

const handleSave = async () => {
  try {
    await store.save(payload);
    showSuccessMessage(t('messages.success'));
  } catch (error: unknown) {
    showErrorMessage(error as Error);
  }
};

// Veya useOperationFeedback ile
const { executeWithFeedback } = useOperationFeedback();

const handleSave = async () => {
  await executeWithFeedback(
    () => store.save(payload),
    t('messages.success'),
  );
};
```

## PrimeVue Component Wrapper Kullanımı

Projede özel wrapper component'ler kullanılır:

- `FInput` - Text input with vee-validate
- `FSelect` - Select dropdown with add new option
- `FDateTimePicker` - Date/time picker
- `FCheckbox` - Checkbox input
- `FEmailList` - Multiple email input

```vue
<FInput
  id="name"
  :label="t('form.name.label')"
  name="name"
  :placeholder="t('form.name.placeholder')"
/>

<FSelect
  name="category"
  :label="t('form.category.label')"
  :options="categoryOptions"
  :placeholder="t('form.category.placeholder')"
  @add-option="handleAddCategory"
/>
```

## Geliştirme Sonrası Kontroller

Her kod değişikliğinden sonra şu komutlar çalıştırılmalıdır:

```bash
# TypeScript type kontrolü
yarn type-check

# ESLint + Vue Composition API order kontrolü
yarn lint
```

Bu kontroller başarılı olmadan commit yapılmamalıdır.

## Dosya İsimlendirme Kuralları

- **Components**: PascalCase (`UserModal.vue`, `EnterTime.vue`)
- **Composables**: camelCase with "use" prefix (`useTimer.ts`, `useFToast.ts`)
- **Stores**: camelCase (`profile.ts`, `timeEntries.ts`)
- **Types/Interfaces**: PascalCase with "I" prefix for interfaces (`IOption`, `IProps`)

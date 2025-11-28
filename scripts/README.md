# Scripts Documentation

## checkVueOrder.js

A custom script that enforces Vue Composition API code ordering in `<script setup>` blocks.

### Purpose

Ensures all Vue components follow a consistent structure by checking that code elements appear in the correct order.

### Required Order

1. **Imports** - All import statements
2. **Props Interface** - `interface IProps { ... }`
3. **defineProps** - `const props = defineProps<IProps>()`
4. **Emits Interface** - `interface IEmits { ... }`
5. **defineEmits** - `const emits = defineEmits<IEmits>()`
6. **Composables and Stores** - `const router = useRouter()`, `const store = useMyStore()`
7. **Reactive References** - `const myRef = ref(...)`
8. **Computed Properties** - `const myComputed = computed(...)`
9. **Functions** - `const myFunction = () => { ... }`
10. **Watchers** - `watch(...)`, `watchEffect(...)`
11. **Lifecycle Hooks** - `onMounted(...)`, `onBeforeUnmount(...)`, etc.

### Usage

```bash
# Check all Vue files
yarn lint:order

# Run as part of full lint
yarn lint
```

### Example

**❌ Incorrect Order:**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const myFunction = () => {
  // ...
};

const router = useRouter(); // ❌ Should be before myFunction

const count = computed(() => store.count); // ❌ Should be before myFunction

const myRef = ref(0); // ❌ Should be before myFunction

onMounted(() => {
  // ...
});
</script>
```

**✅ Correct Order:**

```vue
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Composables
const router = useRouter();

// Reactive references
const myRef = ref(0);

// Computed properties
const count = computed(() => store.count);

// Functions
const myFunction = () => {
  // ...
};

// Lifecycle hooks
onMounted(() => {
  // ...
});
</script>
```

### Detection Patterns

The script uses regex patterns to detect different statement types:

- **Imports**: `import ...`
- **Props Interface**: `interface IProps`
- **defineProps**: `const props = defineProps` or `const props = withDefaults(defineProps`
- **Emits Interface**: `interface IEmits`
- **defineEmits**: `const ... = defineEmits`
- **Composables**: `const ... = use[A-Z]...(`
- **Refs**: `const ... = ref(`
- **Computed**: `const ... = computed(`
- **Functions**: `const ... = (...) =>` or `const ... = async (...) =>`
- **Watchers**: `watch(` or `watchEffect(`
- **Lifecycle**: `on[A-Z]...(`

### Output

When violations are found:

```
❌ src/views/example/Example.vue
   Line 42: Composables and stores should come before Computed properties
   Line 78: Computed properties should come before Functions

📊 Summary:
   Total files checked: 156
   Files with errors: 1
   Total order violations: 2

💡 Expected order:
   1. Imports
   2. Props interface (IProps)
   3. defineProps
   4. Emits interface (IEmits)
   5. defineEmits
   6. Composables and stores
   7. Reactive references (ref)
   8. Computed properties
   9. Functions
   10. Watchers
   11. Lifecycle hooks
```

### CI/CD Integration

The script exits with code 1 if violations are found, making it suitable for CI/CD pipelines:

```yaml
# .github/workflows/ci.yml
- name: Check code order
  run: yarn lint:order
```

### Limitations

- Only checks `<script setup>` blocks
- Does not automatically fix ordering (manual reordering required)
- Pattern matching may miss complex or unconventional syntax
- Multiline statements may not be detected correctly

### Future Improvements

- Add auto-fix capability
- Support for more complex patterns
- Integration with ESLint as a custom rule
- Configuration file for custom ordering rules

import { computed, ref, watch } from 'vue';

import { EStorageKeys } from '@/constants/storageKeys';

export type Theme = 'light' | 'dark' | 'system';

// Global reactive state (singleton pattern like useLanguage)
const savedTheme = localStorage.getItem(EStorageKeys.THEME) as Theme | null;
const currentTheme = ref<Theme>(savedTheme || 'system');

// Compute the effective theme (resolved from system preference if needed)
const effectiveTheme = computed(() => {
  if (currentTheme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentTheme.value;
});

// Check if dark mode is active
const isDark = computed(() => effectiveTheme.value === 'dark');

// Apply theme to DOM
const applyTheme = (theme: 'light' | 'dark') => {
  const html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.add('my-app-dark'); // PrimeVue dark mode selector
  } else {
    html.classList.remove('dark');
    html.classList.remove('my-app-dark');
  }
};

// Initialize theme on module load
applyTheme(effectiveTheme.value);

// Watch for theme changes
watch(effectiveTheme, (newTheme) => {
  applyTheme(newTheme);
});

// Listen for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (currentTheme.value === 'system') {
      applyTheme(effectiveTheme.value);
    }
  });
}

export const useTheme = () => {
  // Initialize theme (call on app start)
  const initTheme = () => {
    const saved = localStorage.getItem(EStorageKeys.THEME) as Theme | null;
    currentTheme.value = saved || 'system';
    applyTheme(effectiveTheme.value);
  };

  // Set theme and persist
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    localStorage.setItem(EStorageKeys.THEME, theme);
    applyTheme(effectiveTheme.value);
  };

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Get theme options for select component
  const getThemeOptions = () => {
    return [
      { name: 'Light', value: 'light' as Theme, icon: 'pi pi-sun' },
      { name: 'Dark', value: 'dark' as Theme, icon: 'pi pi-moon' },
      { name: 'System', value: 'system' as Theme, icon: 'pi pi-desktop' },
    ];
  };

  return {
    currentTheme,
    effectiveTheme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme,
    getThemeOptions,
  };
};

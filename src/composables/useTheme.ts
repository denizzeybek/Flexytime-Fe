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

/**
 * Check if View Transitions API is supported and user allows motion
 */
const supportsViewTransitions = () => {
  return (
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

/**
 * Apply theme classes to DOM
 */
const applyThemeClasses = (theme: 'light' | 'dark') => {
  const html = document.documentElement;

  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.add('my-app-dark'); // PrimeVue dark mode selector
  } else {
    html.classList.remove('dark');
    html.classList.remove('my-app-dark');
  }
};

/**
 * Apply theme with View Transition API for smooth animation
 * Uses browser's native crossfade (same as PrimeVue website)
 * Falls back to instant change if API not supported
 */
const applyTheme = (theme: 'light' | 'dark', animate = true) => {
  // If no animation needed or API not supported, apply instantly
  if (!animate || !supportsViewTransitions()) {
    applyThemeClasses(theme);
    return;
  }

  // Use View Transition API - browser handles the smooth crossfade
  (document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition(() => {
    applyThemeClasses(theme);
  });
};

// Initialize theme on module load (no animation on first load)
applyTheme(effectiveTheme.value, false);

// Watch for theme changes (triggered by system preference changes)
watch(effectiveTheme, (newTheme, oldTheme) => {
  // Only animate if theme actually changed
  if (newTheme !== oldTheme) {
    applyTheme(newTheme);
  }
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
  // Initialize theme (call on app start - no animation)
  const initTheme = () => {
    const saved = localStorage.getItem(EStorageKeys.THEME) as Theme | null;
    currentTheme.value = saved || 'system';
    applyTheme(effectiveTheme.value, false);
  };

  /**
   * Set theme with smooth View Transition animation
   */
  const setTheme = (theme: Theme) => {
    const previousEffective = effectiveTheme.value;
    currentTheme.value = theme;
    localStorage.setItem(EStorageKeys.THEME, theme);

    // Only animate if effective theme actually changed
    const newEffective = effectiveTheme.value;
    if (newEffective !== previousEffective) {
      applyTheme(newEffective);
    }
  };

  /**
   * Toggle between light and dark with smooth animation
   */
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

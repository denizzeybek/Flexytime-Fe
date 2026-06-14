import { computed, ref, watch } from 'vue';

import { EStorageKeys } from '@/constants/storageKeys';

export type Theme = 'light' | 'dark' | 'system';

const savedTheme = localStorage.getItem(EStorageKeys.THEME) as Theme | null;
const currentTheme = ref<Theme>(savedTheme || 'system');

const effectiveTheme = computed(() => {
  if (currentTheme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentTheme.value;
});

const isDark = computed(() => effectiveTheme.value === 'dark');

const supportsViewTransitions = () => {
  return (
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
};

let themeTransitionTimer: ReturnType<typeof setTimeout> | null = null;

const getThemeTransitionMs = (): number => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-transition-duration')
    .trim();
  if (raw.endsWith('ms')) return parseFloat(raw);
  if (raw.endsWith('s')) return parseFloat(raw) * 1000;
  return 250;
};

const applyThemeClasses = (theme: 'light' | 'dark') => {
  const html = document.documentElement;

  html.classList.add('theme-transitioning');
  if (themeTransitionTimer) clearTimeout(themeTransitionTimer);
  themeTransitionTimer = setTimeout(() => {
    html.classList.remove('theme-transitioning');
  }, getThemeTransitionMs());

  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};

const applyTheme = (theme: 'light' | 'dark', animate = true) => {
  if (!animate || !supportsViewTransitions()) {
    applyThemeClasses(theme);
    return;
  }

  (document as Document & { startViewTransition: (callback: () => void) => void }).startViewTransition(() => {
    applyThemeClasses(theme);
  });
};

applyTheme(effectiveTheme.value, false);

watch(effectiveTheme, (newTheme, oldTheme) => {
  if (newTheme !== oldTheme) {
    applyTheme(newTheme);
  }
});

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (currentTheme.value === 'system') {
      applyTheme(effectiveTheme.value);
    }
  });
}

export const useTheme = () => {
  const initTheme = () => {
    const saved = localStorage.getItem(EStorageKeys.THEME) as Theme | null;
    currentTheme.value = saved || 'system';
    applyTheme(effectiveTheme.value, false);
  };

  const setTheme = (theme: Theme) => {
    const previousEffective = effectiveTheme.value;
    currentTheme.value = theme;
    localStorage.setItem(EStorageKeys.THEME, theme);

    const newEffective = effectiveTheme.value;
    if (newEffective !== previousEffective) {
      applyTheme(newEffective);
    }
  };

  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

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

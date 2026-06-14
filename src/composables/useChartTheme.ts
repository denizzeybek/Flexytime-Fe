import { computed } from 'vue';

import { useTheme } from './useTheme';

export const useChartTheme = () => {
  const { isDark } = useTheme();

  const chartColors = computed(() => ({
    textColor: isDark.value ? '#fafafa' : '#18181b',
    textMuted: isDark.value ? '#a1a1aa' : '#71717a',

    gridColor: isDark.value ? '#3f3f46' : '#e4e4e7',
    borderColor: isDark.value ? '#52525b' : '#d4d4d8',

    backgroundColor: isDark.value ? '#18181b' : '#ffffff',
    tooltipBackground: isDark.value ? '#27272a' : '#ffffff',

    primary: isDark.value ? '#a78bfa' : '#7c3aed',
    primaryLight: isDark.value ? 'rgba(167, 139, 250, 0.2)' : 'rgba(124, 58, 237, 0.1)',

    success: isDark.value ? '#34d399' : '#10b981',
    successLight: isDark.value ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.1)',

    warning: isDark.value ? '#fbbf24' : '#f59e0b',
    warningLight: isDark.value ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.1)',

    danger: isDark.value ? '#f87171' : '#ef4444',
    dangerLight: isDark.value ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.1)',

    info: isDark.value ? '#38bdf8' : '#0ea5e9',
    infoLight: isDark.value ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.1)',

    palette: isDark.value
      ? ['#a78bfa', '#34d399', '#38bdf8', '#fbbf24', '#f87171', '#c4b5fd', '#6ee7b7', '#7dd3fc']
      : ['#7c3aed', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#34d399', '#38bdf8'],
  }));

  const getChartOptions = (overrides: Record<string, unknown> = {}) => {
    const colors = chartColors.value;

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: colors.textColor,
            font: {
              family: 'Poppins, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: colors.tooltipBackground,
          titleColor: colors.textColor,
          bodyColor: colors.textMuted,
          borderColor: colors.borderColor,
          borderWidth: 1,
          titleFont: {
            family: 'Poppins, sans-serif',
          },
          bodyFont: {
            family: 'Poppins, sans-serif',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: colors.textMuted,
            font: {
              family: 'Poppins, sans-serif',
            },
          },
          grid: {
            color: colors.gridColor,
          },
          border: {
            color: colors.borderColor,
          },
        },
        y: {
          ticks: {
            color: colors.textMuted,
            font: {
              family: 'Poppins, sans-serif',
            },
          },
          grid: {
            color: colors.gridColor,
          },
          border: {
            color: colors.borderColor,
          },
        },
      },
    };

    return deepMerge(baseOptions, overrides);
  };

  const getDatasetColors = (index: number = 0) => {
    const colors = chartColors.value;
    const paletteColor = colors.palette[index % colors.palette.length];

    return {
      line: {
        borderColor: paletteColor,
        backgroundColor: `${paletteColor}20`,
        pointBackgroundColor: paletteColor,
        pointBorderColor: colors.backgroundColor,
        tension: 0.4,
      },
      bar: {
        backgroundColor: `${paletteColor}80`,
        borderColor: paletteColor,
        borderWidth: 1,
        hoverBackgroundColor: paletteColor,
      },
      doughnut: {
        backgroundColor: colors.palette,
        borderColor: colors.backgroundColor,
        borderWidth: 2,
      },
      pie: {
        backgroundColor: colors.palette,
        borderColor: colors.backgroundColor,
        borderWidth: 2,
      },
    };
  };

  return {
    chartColors,
    getChartOptions,
    getDatasetColors,
    isDark,
  };
};

const deepMerge = <T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>
): T => {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key as keyof T];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key as keyof T] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[keyof T];
      } else {
        result[key as keyof T] = sourceValue as T[keyof T];
      }
    }
  }

  return result;
};

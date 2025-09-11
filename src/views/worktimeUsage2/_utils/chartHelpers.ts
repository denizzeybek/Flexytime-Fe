import { CHART_COLORS } from './constants';
import type { ChartInput } from '../_types';

export function transformDataToChartFormat(rawData: Array<{ label: string; value: number }> = []) {
  const { backgrounds, hovers } = CHART_COLORS;

  if (!rawData || rawData.length === 0) {
    return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      }],
    };
  }

  const labels = rawData.map((item) => item.label);
  const data = rawData.map((item) => item.value);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgrounds.slice(0, rawData.length),
        hoverBackgroundColor: hovers.slice(0, rawData.length),
      },
    ],
  };
}

export function setChartData(source: ChartInput | undefined) {
  if (!source) {
    return {
      labels: [],
      datasets: [],
    };
  }

  return {
    labels: source.labels || [],
    datasets: (source.datasets || []).map((ds) => ({
      ...ds,
      backgroundColor: Array.isArray(ds.backgroundColor)
        ? ds.backgroundColor
        : ds.data.map(() => ds.backgroundColor),
      borderColor: Array.isArray(ds.borderColor)
        ? ds.borderColor
        : ds.data.map(() => ds.borderColor),
      borderWidth: 1,
    })),
  };
}

export function getChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: textColorSecondary, font: { weight: 500 } },
        grid: { display: false, drawBorder: false },
      },
      y: {
        stacked: true,
        ticks: { color: textColorSecondary },
        grid: { color: surfaceBorder, drawBorder: false },
      },
    },
  };
}

export function getDoughnutChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
}
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useToast } from 'primevue/usetoast';

import { ReportSavedFilterSaveDto, ReportService } from '@/client';
import { DownloadService } from '@/customClient/services/DownloadService';
import { formatDateToInterval } from '@/helpers/date';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyReportsStore } from '@/stores/company/reports';
import { useProfileStore } from '@/stores/profile/profile';
import { EBillableOptions, useReport } from '@/views/company/_composables/useReport';
import { EGroupOptions } from '@/views/company/_etc/groupOptions.enum';

interface AnyDataset {
  label?: unknown;
  data?: unknown;
  backgroundColor?: unknown;
  borderColor?: unknown;
}

interface AnyGroupPoint {
  label?: unknown;
  value?: unknown;
}

const pickString = (v: unknown): string => (typeof v === 'string' ? v : '');
const pickNumber = (v: unknown): number => (typeof v === 'number' ? v : 0);

export const useTimeEntriesReport = () => {
  const { t } = useI18n<{ message: MessageSchema }>();
  const reportsStore = useCompanyReportsStore();
  const profileStore = useProfileStore();
  const toast = useToast();
  const { teamOptions, employeeOptions, projectOptions, billableOptions, groupOptions } =
    useReport();

  const canSeeOthers = computed<boolean>(() => profileStore.canSeeOthers);

  const today = new Date();
  const selectedTeams = ref<string[]>([]);
  const selectedEmployees = ref<string[]>([]);
  const selectedProjects = ref<string[]>([]);
  const selectedBillable = ref<EBillableOptions>(EBillableOptions.ALL);
  const selectedDateRange = ref<Date[]>([today, today]);
  const selectedGroup1 = ref<EGroupOptions>(EGroupOptions.PROJECTS);
  const selectedGroup2 = ref<EGroupOptions>(EGroupOptions.EMPLOYEES);

  const summary = computed(() => reportsStore.summary);

  const group1Label = computed(() => {
    const option = groupOptions.value.find((o) => o.value === selectedGroup1.value);
    return option?.name ?? t('pages.company.reports.elasticReports.groups.group1');
  });

  const group2Label = computed(() => {
    const option = groupOptions.value.find((o) => o.value === selectedGroup2.value);
    return option?.name ?? t('pages.company.reports.elasticReports.groups.group2');
  });

  const hasChartData = computed(() => {
    const ds = reportsStore.graphs?.Main?.datasets;
    return Array.isArray(ds) && ds.length > 0;
  });

  const hasPieChartData = computed(() => {
    const g = reportsStore.graphs?.Group;
    return Array.isArray(g) && g.length > 0;
  });

  const barChartData = computed(() => {
    const main = reportsStore.graphs?.Main;
    if (!main) return { labels: [], datasets: [] };
    const datasets = (main.datasets ?? []) as AnyDataset[];
    return {
      labels: main.labels ?? [],
      datasets: datasets.map((ds) => ({
        label: pickString(ds.label),
        data: Array.isArray(ds.data) ? ds.data : [],
        backgroundColor: pickString(ds.backgroundColor) || 'rgba(59, 130, 246, 0.8)',
        borderColor: pickString(ds.borderColor) || 'rgb(59, 130, 246)',
        borderWidth: 1,
      })),
    };
  });

  const barChartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    return {
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColorSecondary } } },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: reportsStore.graphs?.Main?.Unit || '',
            color: textColorSecondary,
            font: { size: 12, weight: 500 },
          },
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
      },
    };
  });

  const PIE_COLORS = [
    'rgba(34, 197, 94, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(20, 184, 166, 0.8)',
  ];

  const pieChartData = computed(() => {
    const groupData = (reportsStore.graphs?.Group ?? []) as AnyGroupPoint[];
    const colors = PIE_COLORS.slice(0, groupData.length);
    return {
      labels: groupData.map((d) => pickString(d.label)),
      datasets: [
        {
          data: groupData.map((d) => pickNumber(d.value)),
          backgroundColor: colors,
          hoverBackgroundColor: colors.map((c) => c.replace('0.8', '1')),
        },
      ],
    };
  });

  const pieChartOptions = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    return {
      plugins: { legend: { labels: { usePointStyle: true, color: textColor } } },
    };
  });

  const buildQueryPayload = () => {
    const [start, end] = selectedDateRange.value;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const interval = `${formatDateToInterval(start)}-${diffDays}`;
    return {
      Interval: interval,
      Teams: selectedTeams.value,
      Employees: selectedEmployees.value,
      Projects: selectedProjects.value,
      Billable: selectedBillable.value,
      Group1: selectedGroup1.value,
      Group2: selectedGroup2.value,
    };
  };

  const queryReport = async () => {
    const payload = buildQueryPayload();
    await reportsStore.queryReport(payload);
  };

  const onFilterChange = () => {
    queryReport();
  };

  const clearFilters = () => {
    selectedTeams.value = [];
    selectedEmployees.value = [];
    selectedProjects.value = [];
    selectedBillable.value = EBillableOptions.ALL;
    const now = new Date();
    selectedDateRange.value = [now, now];
    selectedGroup1.value = EGroupOptions.PROJECTS;
    selectedGroup2.value = EGroupOptions.EMPLOYEES;
    queryReport();
  };

  const handleDownload = async () => {
    const payload = buildQueryPayload();
    await DownloadService.downloadReportXlsx(payload);
  };

  const saveFilterDialog = ref(false);
  const saveFilterName = ref('');
  const savingFilter = ref(false);

  const openSaveFilterDialog = () => {
    saveFilterName.value = '';
    saveFilterDialog.value = true;
  };

  const confirmSaveFilter = async () => {
    const name = saveFilterName.value.trim();
    if (!name || savingFilter.value) return;
    savingFilter.value = true;
    try {
      await ReportService.reportControllerSaveSavedFilter({
        Name: name,
        DataSource: ReportSavedFilterSaveDto.DataSource.TIME_ENTRY,
        FilterSpec: buildQueryPayload() as unknown as Record<string, unknown>,
      });
      toast.add({
        severity: 'success',
        summary: t('pages.company.reports.timeEntries.saveDialog.saved'),
        life: 3000,
      });
      saveFilterDialog.value = false;
    } catch (err) {
      toast.add({
        severity: 'error',
        summary: t('pages.company.reports.timeEntries.saveDialog.failed'),
        detail: err instanceof Error ? err.message : String(err),
        life: 4000,
      });
    } finally {
      savingFilter.value = false;
    }
  };

  watch(selectedTeams, async (next, prev) => {
    const nextOne = next.length === 1 ? next[0] : undefined;
    const prevOne = prev && prev.length === 1 ? prev[0] : undefined;
    if (nextOne === prevOne) return;
    const stillVisible = (id: string) =>
      reportsStore.filters?.Employees?.some((e) => e.ID === id) ?? false;
    await reportsStore.refetchEmployees(nextOne);
    selectedEmployees.value = selectedEmployees.value.filter(stillVisible);
  });

  const bootstrap = async () => {
    await reportsStore.fetchFilters();
    await queryReport();
  };

  return {
    canSeeOthers,
    selectedTeams,
    selectedEmployees,
    selectedProjects,
    selectedBillable,
    selectedDateRange,
    selectedGroup1,
    selectedGroup2,
    teamOptions,
    employeeOptions,
    projectOptions,
    billableOptions,
    groupOptions,
    summary,
    group1Label,
    group2Label,
    hasChartData,
    hasPieChartData,
    barChartData,
    barChartOptions,
    pieChartData,
    pieChartOptions,
    saveFilterDialog,
    saveFilterName,
    savingFilter,
    queryReport,
    onFilterChange,
    clearFilters,
    handleDownload,
    openSaveFilterDialog,
    confirmSaveFilter,
    bootstrap,
  };
};

import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/profile/profile';
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';

import { useWorktimeQuery } from './useWorktimeQuery';

import type { DisplayMode, IWebClock, TabType } from '../_types';

export const useWorktimeView = () => {
  const store = useWorktimeStore();
  const profileStore = useProfileStore();
  const { t } = useI18n<{ message: MessageSchema }>();
  const { showSuccessMessage, showErrorMessage } = useFToast();

  const { currentQuery, changeTab, navigateToIndividual } = useWorktimeQuery();

  const displayMode = ref<DisplayMode>('team');
  const errorMessage = ref<string | null>(null);
  const activeTabIndex = ref<TabType>(currentQuery.value.tab);
  const showGraphBelow = ref(false);

  const isLoading = computed(() => store.isLoading);
  const isIndividual = computed(() => currentQuery.value.view === 'individual');

  const currentCard = computed(() =>
    isIndividual.value ? store.employeeData?.Card ?? null : store.sectionCard,
  );
  const currentBreadcrumb = computed(() =>
    isIndividual.value ? store.employeeBreadcrumb : store.sectionBreadcrumb,
  );
  const currentSummary = computed(() =>
    isIndividual.value ? store.employeeData?.Summary ?? [] : store.sectionSummary,
  );
  const currentDistributions = computed(() =>
    isIndividual.value
      ? store.employeeData?.Distributions ?? []
      : store.sectionDistributions,
  );
  const currentGraphs = computed(() =>
    isIndividual.value ? store.employeeData?.Graphs ?? null : store.sectionGraphs,
  );

  const currentWellBeingGraphs = computed(() => {
    if (isIndividual.value) {
      return (store.employeeData?.WellBeings ?? []).map((wb) => ({
        Type: wb.Type,
        Name: wb.Name,
        Color: wb.Color,
        Icon: wb.Icon,
        Graph: wb.Graph,
      }));
    }
    return store.sectionWellBeingGraphs;
  });

  const currentWebClocks = computed(() => store.employeeData?.WebClocks ?? []);
  const currentIndividualWellbeings = computed(() => store.employeeData?.WellBeings ?? []);

  const teams = computed(() => store.getTeams);
  const individuals = computed(() => store.getIndividuals);

  const showTeamToggle = computed(() => false);

  const showGraphToggleVisible = computed(() => {
    const tab = currentQuery.value.tab;
    return tab === 'productivity' || tab === 'wellbeing';
  });

  const availableTabs = computed<Array<{ key: TabType; label: string }>>(() => {
    if (isIndividual.value) {
      return [
        { key: 'wellbeing', label: t('pages.worktimeUsage.tabs.wellbeing') },
        { key: 'distribution', label: t('pages.worktimeUsage.tabs.distribution') },
        { key: 'webHistory', label: t('pages.worktimeUsage.tabs.webHistory') },
      ];
    }
    return [
      { key: 'productivity', label: t('pages.worktimeUsage.tabs.productivity') },
      { key: 'wellbeing', label: t('pages.worktimeUsage.tabs.wellbeing') },
      { key: 'distribution', label: t('pages.worktimeUsage.tabs.distribution') },
    ];
  });

  const showTab = (tabKey: TabType): boolean =>
    availableTabs.value.some((tab) => tab.key === tabKey);

  const fetchData = async () => {
    try {
      errorMessage.value = null;
      if (isIndividual.value) {
        await store.fetchEmployeeData({
          Perspective: currentQuery.value.perspective,
          StartDate: currentQuery.value.startDate,
          EndDate: currentQuery.value.endDate,
          MemberId: currentQuery.value.memberId ?? undefined,
        });
        if (store.getEmployeeError) errorMessage.value = store.getEmployeeError;
      } else {
        await store.fetchSectionData({
          Perspective: currentQuery.value.perspective,
          StartDate: currentQuery.value.startDate,
          EndDate: currentQuery.value.endDate,
          TeamId: currentQuery.value.teamId ?? undefined,
        });
        if (store.getSectionError) errorMessage.value = store.getSectionError;
      }
    } catch {
      errorMessage.value = 'An unexpected error occurred while fetching data.';
    }
  };

  const handleDownload = () => {
    // TODO: hook up worktime xlsx download once the BE exposes it.
  };

  const handleToggleDomain = async (webClock: IWebClock, newDomain: number) => {
    try {
      await store.saveWebClock({
        HostName: webClock.Url ?? '',
        Domain: newDomain,
      });
      showSuccessMessage(t('pages.worktimeUsage.messages.domainUpdated'));
      await fetchData();
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  watch(
    () => currentQuery.value,
    () => {
      fetchData();
      activeTabIndex.value = currentQuery.value.tab;
      showGraphBelow.value = false;
    },
    { deep: true },
  );

  watch(activeTabIndex, (newTab) => {
    if (newTab !== currentQuery.value.tab) {
      changeTab(newTab);
    }
  });

  onMounted(async () => {
    const isEmployee = profileStore.isEmployee;
    if (isEmployee && currentQuery.value.view === 'team') {
      await navigateToIndividual(null);
      return;
    }
    fetchData();
  });

  return {
    currentQuery,
    displayMode,
    errorMessage,
    activeTabIndex,
    showGraphBelow,
    isLoading,
    currentCard,
    currentBreadcrumb,
    currentSummary,
    currentDistributions,
    currentGraphs,
    currentWellBeingGraphs,
    currentWebClocks,
    currentIndividualWellbeings,
    teams,
    individuals,
    showTeamToggle,
    showGraphToggleVisible,
    availableTabs,
    showTab,
    handleDownload,
    handleToggleDomain,
  };
};

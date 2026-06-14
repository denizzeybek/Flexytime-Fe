<template>
  <div class="worktime-usage-v2">
    <!-- Error Message -->
    <Message
      v-if="errorMessage"
      :message="errorMessage"
      severity="error"
      class="mb-6"
      @close="errorMessage = null"
    />

    <!-- Main Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      <!-- Left Column: User Badge -->
      <div class="lg:col-span-2">
        <UserBadge :card="currentCard" :is-loading="isLoading" />
      </div>

      <!-- Middle Column: Summary -->
      <div class="lg:col-span-10">
        <Summary
          :breadcrumb-items="currentBreadcrumb"
          :summary-items="currentSummary"
          :is-loading="isLoading"
          @download="handleDownload"
        />
      </div>
    </div>

    <!-- Content Area -->
    <div>
      <Card class="shadow-lg border rounded-2xl overflow-hidden transition-colors
                   border-border-secondary dark:border-border-primary">
        <template #content>
          <Tabs v-model:value="activeTabIndex">
            <!-- Tab List with Buttons -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-border-secondary dark:border-border-primary transition-colors">
              <TabList class="flex-1">
                <Tab
                  v-for="tab in availableTabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="font-medium whitespace-nowrap"
                >
                  {{ tab.label }}
                </Tab>
              </TabList>

              <!-- Right Side Buttons -->
              <div class="flex items-center gap-2.5 flex-shrink-0">
                <!-- Show Graph toggle. Visible only on tabs that have an
                     associated chart in the v1 sense (`#grafik-bar` for the
                     productivity stacked-bar, `#graphic-wellbeing` for the
                     per-type well-being series). Distribution stays hidden
                     because the distribution cards already render their own
                     per-app doughnut inline. -->
                <Button
                  v-if="showGraphToggleVisible"
                  :label="$t('pages.worktimeUsage.showGraph')"
                  icon="pi pi-chart-line"
                  :severity="showGraphBelow ? 'primary' : 'secondary'"
                  :outlined="!showGraphBelow"
                  raised
                  class="shadow-sm grow sm:grow-0"
                  @click="showGraphBelow = !showGraphBelow"
                />

                <!-- Team/Employees Toggle (only for team view and when IsTeam is true) -->
                <div
                  v-if="showTeamToggle"
                  class="flex gap-1 p-1 rounded-xl transition-colors
                         bg-surface-tertiary dark:bg-surface-secondary"
                >
                  <Button
                    :label="$t('pages.worktimeUsage.teamLabel')"
                    :severity="displayMode === 'team' ? 'primary' : 'secondary'"
                    :text="displayMode !== 'team'"
                    class="rounded-lg"
                    @click="displayMode = 'team'"
                  />
                  <Button
                    :label="$t('pages.worktimeUsage.employeesLabel')"
                    :severity="displayMode === 'employees' ? 'primary' : 'secondary'"
                    :text="displayMode !== 'employees'"
                    class="rounded-lg"
                    @click="displayMode = 'employees'"
                  />
                </div>
              </div>
            </div>

            <!-- Show Graph view — context-aware. Productivity tab → per-day
                 stacked bar from `ProductivityGraph`. Wellbeing tab → one
                 chart per well-being type from `WellBeingGraph`. -->
            <div v-if="showGraphBelow" class="mt-1">
              <WellBeingGraphTab
                v-if="currentQuery.tab === 'wellbeing'"
                :graphs="(currentWellBeingGraphs as unknown as IWellBeingGraph[])"
                :is-loading="isLoading"
              />
              <GraphTab v-else :graphs="currentGraphs" :is-loading="isLoading" />
            </div>

            <!-- Tab Panels (hidden when graph is shown) -->
            <TabPanels v-else class="mt-1 !px-0">
              <!-- Productivity Tab -->
              <TabPanel v-if="showTab('productivity')" value="productivity">
                <ProductivityTab
                  :view-mode="currentQuery.view"
                  :display-mode="displayMode"
                  :teams="teams"
                  :individuals="individuals"
                  :is-loading="isLoading"
                />
              </TabPanel>

              <!-- Wellbeing Tab -->
              <TabPanel v-if="showTab('wellbeing')" value="wellbeing">
                <WellbeingTab
                  :view-mode="currentQuery.view"
                  :display-mode="displayMode"
                  :teams="teams"
                  :individuals="individuals"
                  :individual-wellbeings="currentIndividualWellbeings"
                  :is-loading="isLoading"
                />
              </TabPanel>

              <!-- Distribution Tab -->
              <TabPanel v-if="showTab('distribution')" value="distribution">
                <DistributionTab :distributions="currentDistributions" :is-loading="isLoading" />
              </TabPanel>

              <!-- Web History Tab -->
              <TabPanel v-if="showTab('webHistory')" value="webHistory">
                <WebHistoryTab
                  :web-clocks="currentWebClocks"
                  :is-loading="isLoading"
                  @toggle-domain="handleToggleDomain"
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted,ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

import { useFToast } from '@/composables/useFToast';
import { useProfileStore } from '@/stores/profile/profile';
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';

import Message from './_components/common/Message.vue';
import Summary from './_components/common/Summary.vue';
import UserBadge from './_components/common/UserBadge.vue';
import DistributionTab from './_components/tabs/DistributionTab.vue';
import GraphTab from './_components/tabs/GraphTab.vue';
import ProductivityTab from './_components/tabs/ProductivityTab.vue';
import WebHistoryTab from './_components/tabs/WebHistoryTab.vue';
import WellBeingGraphTab from './_components/tabs/WellBeingGraphTab.vue';
import WellbeingTab from './_components/tabs/WellbeingTab.vue';
import { useWorktimeQuery } from './_composables';

import type { DisplayMode, IWebClock, TabType } from './_types';
import type { MessageSchema } from '@/plugins/i18n';
import type { IWellBeingGraph } from '@/stores/worktimeUsage/worktimeStore';

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

const currentCard = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Card || null;
  }
  return store.sectionCard;
});

const currentBreadcrumb = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeBreadcrumb;
  }
  return store.sectionBreadcrumb;
});

const currentSummary = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Summary || [];
  }
  return store.sectionSummary;
});

const currentDistributions = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Distributions || [];
  }
  return store.sectionDistributions;
});

const currentGraphs = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Graphs || null;
  }
  return store.sectionGraphs;
});

const currentWellBeingGraphs = computed(() => {
  if (currentQuery.value.view === 'individual') {
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

const showGraphToggleVisible = computed(() => {
  const tab = currentQuery.value.tab;
  return tab === 'productivity' || tab === 'wellbeing';
});

const currentWebClocks = computed(() => {
  return store.employeeData?.WebClocks || [];
});

const currentIndividualWellbeings = computed(() => {
  return store.employeeData?.WellBeings || [];
});

const teams = computed(() => store.getTeams);
const individuals = computed(() => store.getIndividuals);

const showTeamToggle = computed(() => false);

const availableTabs = computed<Array<{ key: TabType; label: string }>>(() => {
  const tabs: Array<{ key: TabType; label: string }> = [];

  if (currentQuery.value.view === 'individual') {
    tabs.push(
      { key: 'wellbeing' as TabType, label: t('pages.worktimeUsage.tabs.wellbeing') },
      { key: 'distribution' as TabType, label: t('pages.worktimeUsage.tabs.distribution') },
      { key: 'webHistory' as TabType, label: t('pages.worktimeUsage.tabs.webHistory') },
    );
  } else {
    tabs.push(
      { key: 'productivity' as TabType, label: t('pages.worktimeUsage.tabs.productivity') },
      { key: 'wellbeing' as TabType, label: t('pages.worktimeUsage.tabs.wellbeing') },
      { key: 'distribution' as TabType, label: t('pages.worktimeUsage.tabs.distribution') },
    );
  }

  return tabs;
});

const showTab = (tabKey: TabType): boolean => {
  return availableTabs.value.some((tab) => tab.key === tabKey);
};

const fetchData = async () => {
  try {
    errorMessage.value = null;

    if (currentQuery.value.view === 'individual') {
      await store.fetchEmployeeData({
        Perspective: currentQuery.value.perspective,
        StartDate: currentQuery.value.startDate,
        EndDate: currentQuery.value.endDate,
        MemberId: currentQuery.value.memberId ?? undefined,
      });

      if (store.getEmployeeError) {
        errorMessage.value = store.getEmployeeError;
      }
    } else {
      await store.fetchSectionData({
        Perspective: currentQuery.value.perspective,
        StartDate: currentQuery.value.startDate,
        EndDate: currentQuery.value.endDate,
        TeamId: currentQuery.value.teamId ?? undefined,
      });

      if (store.getSectionError) {
        errorMessage.value = store.getSectionError;
      }
    }
  } catch {
    errorMessage.value = 'An unexpected error occurred while fetching data.';
  }
};

const handleDownload = () => {

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
  const currentView = currentQuery.value.view;

  if (isEmployee && currentView === 'team') {
    await navigateToIndividual(null);
    return;
  }

  fetchData();
});
</script>

<style scoped>
.worktime-usage-v2 {
  min-height: 100vh;
}
</style>

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
      <Card class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
        <template #content>
          <Tabs v-model:value="activeTabIndex">
            <!-- Tab List with Buttons -->
            <div class="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
              <TabList class="flex-1">
                <Tab
                  v-for="tab in availableTabs"
                  :key="tab.key"
                  :value="tab.key"
                  class="font-medium"
                >
                  {{ tab.label }}
                </Tab>
              </TabList>

              <!-- Right Side Buttons -->
              <div class="flex items-center gap-2.5">
                <!-- Graph Toggle Button (shown when not in graph tab) -->
                <Button
                  v-if="
                    currentQuery.tab !== 'graph' &&
                    (currentQuery.view !== 'individual' || currentQuery.tab === 'distribution')
                  "
                  :label="showGraphBelow ? $t('pages.worktimeUsage.hideGraph') : $t('pages.worktimeUsage.showGraph')"
                  :icon="showGraphBelow ? 'pi pi-eye-slash' : 'pi pi-chart-line'"
                  :severity="showGraphBelow ? 'secondary' : 'primary'"
                  raised
                  class="shadow-sm"
                  @click="showGraphBelow = !showGraphBelow"
                />

                <!-- Team/Employees Toggle (only for team view and when IsTeam is true) -->
                <div
                  v-if="showTeamToggle"
                  class="flex gap-1 p-1 bg-gray-100 rounded-xl"
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

            <!-- Show Graph View (when button is active) -->
            <div v-if="showGraphBelow && currentQuery.tab !== 'graph'" class="mt-1">
              <GraphTab :graphs="currentGraphs" :is-loading="isLoading" />
            </div>

            <!-- Tab Panels (hidden when graph is shown) -->
            <TabPanels v-else class="mt-1">
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

              <!-- Graph Tab -->
              <TabPanel v-if="showTab('graph')" value="graph">
                <GraphTab :graphs="currentGraphs" :is-loading="isLoading" />
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

// Store and Composables
import { useFToast } from '@/composables/useFToast';
import { DownloadService } from '@/customClient/services/DownloadService';
import { useProfileStore } from '@/stores/profile/profile';
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';

// Components
import Message from './_components/common/Message.vue';
import Summary from './_components/common/Summary.vue';
import UserBadge from './_components/common/UserBadge.vue';
import DistributionTab from './_components/tabs/DistributionTab.vue';
import GraphTab from './_components/tabs/GraphTab.vue';
import ProductivityTab from './_components/tabs/ProductivityTab.vue';
import WebHistoryTab from './_components/tabs/WebHistoryTab.vue';
import WellbeingTab from './_components/tabs/WellbeingTab.vue';
import { useWorktimeQuery } from './_composables';

import type { DisplayMode, IWebClock,TabType } from './_types';
import type { MessageSchema } from '@/plugins/i18n';

// Store
const store = useWorktimeStore();
const profileStore = useProfileStore();
const { t } = useI18n<{ message: MessageSchema }>();
const { showSuccessMessage, showErrorMessage } = useFToast();

// Composables
const { currentQuery, changeTab, navigateToIndividual } = useWorktimeQuery();

// Local State
const displayMode = ref<DisplayMode>('team');
const errorMessage = ref<string | null>(null);
const activeTabIndex = ref<TabType>(currentQuery.value.tab);
const showGraphBelow = ref(false);

// Computed Properties
const isLoading = computed(() => store.isLoading);

const currentCard = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Card || null;
  }
  return store.sectionData?.Card || null;
});

const currentBreadcrumb = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Breadcrumb || [];
  }
  return store.sectionData?.Breadcrumb || [];
});

const currentSummary = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Summary || [];
  }
  return store.sectionData?.Summary || [];
});

const currentDistributions = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Distributions || [];
  }
  return store.sectionData?.Distributions || [];
});

const currentGraphs = computed(() => {
  if (currentQuery.value.view === 'individual') {
    return store.employeeData?.Graphs || null;
  }
  return store.sectionData?.Graphs || null;
});

const currentWebClocks = computed(() => {
  return store.employeeData?.WebClocks || [];
});

const currentIndividualWellbeings = computed(() => {
  return store.employeeData?.WellBeings || [];
});

const teams = computed(() => store.getTeams);
const individuals = computed(() => store.getIndividuals);

const showTeamToggle = computed(() => {
  return currentQuery.value.view === 'team' && store.sectionData?.Teamset?.IsTeam === true;
});

// Available tabs based on view mode
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
      { key: 'graph' as TabType, label: t('pages.worktimeUsage.tabs.graph') },
    );
  }

  return tabs;
});

// Functions
const showTab = (tabKey: TabType): boolean => {
  return availableTabs.value.some((tab) => tab.key === tabKey);
};

const fetchData = async () => {
  try {
    errorMessage.value = null;

    if (currentQuery.value.view === 'individual') {
      // Fetch individual data
      // MemberId can be null/undefined - backend will return current user's data from auth token
      await store.fetchEmployeeData({
        Perspective: currentQuery.value.perspective,
        Interval: currentQuery.value.interval,
        MemberId: currentQuery.value.memberId ?? undefined,
      });

      if (store.getEmployeeError) {
        errorMessage.value = store.getEmployeeError;
      }
    } else {
      // Fetch section data (team or employees view)
      await store.fetchSectionData({
        Perspective: currentQuery.value.perspective,
        Interval: currentQuery.value.interval,
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
  const downloadKey = store.sectionData?.DownloadKey;
  if (!downloadKey) {
    console.warn('No download key available');
    return;
  }

  DownloadService.downloadSection(downloadKey);
};

const handleToggleDomain = async (webClock: IWebClock, newDomain: number) => {
  try {
    await store.saveWebClock({
      HostName: webClock.Url ?? '',
      Domain: newDomain,
    });
    showSuccessMessage(t('pages.worktimeUsage.messages.domainUpdated'));
    // Refresh the data to show updated domain
    await fetchData();
  } catch (error) {
    showErrorMessage(error as Error);
  }
};

// Watchers
watch(
  () => currentQuery.value,
  () => {
    fetchData();
    activeTabIndex.value = currentQuery.value.tab;
    // Hide graph when switching tabs
    showGraphBelow.value = false;
  },
  { deep: true },
);

watch(activeTabIndex, (newTab) => {
  if (newTab !== currentQuery.value.tab) {
    changeTab(newTab);
  }
});

// Lifecycle
onMounted(async () => {
  // Auto-redirect employees to individual view (based on ROLE, not permission)
  const isEmployee = profileStore.isEmployee;
  const currentView = currentQuery.value.view;

  // If user role is EMPLOYEE (not supervisor/admin) and in team view, redirect to individual
  // Backend accepts MemberId: null and returns current user's data from token
  if (isEmployee && currentView === 'team') {
    // Use null as memberId - backend will get user from auth token
    await navigateToIndividual(null);
    return; // fetchData will be called by the route change watcher
  }

  fetchData();
});
</script>

<style scoped>
.worktime-usage-v2 {
  min-height: 100vh;
}
</style>

<template>
  <div class="worktime-usage-v2">
    <!-- Error Message -->
    <Message
      v-if="errorMessage"
      :message="errorMessage"
      severity="error"
      @close="errorMessage = null"
      class="mb-6"
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

                <!-- Team/Employees Toggle (only for team view) -->
                <div
                  v-if="currentQuery.view === 'team'"
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
import { ref, computed, watch, onMounted } from 'vue';
import Card from 'primevue/card';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

// Components
import Message from './_components/common/Message.vue';
import UserBadge from './_components/common/UserBadge.vue';
import Summary from './_components/common/Summary.vue';
import ProductivityTab from './_components/tabs/ProductivityTab.vue';
import WellbeingTab from './_components/tabs/WellbeingTab.vue';
import DistributionTab from './_components/tabs/DistributionTab.vue';
import GraphTab from './_components/tabs/GraphTab.vue';
import WebHistoryTab from './_components/tabs/WebHistoryTab.vue';
// Store and Composables
import { useWorktimeStore } from '@/stores/worktimeUsage/worktimeStore';
import { useWorktimeQuery } from './_composables';
import { useI18n } from 'vue-i18n';
import type { MessageSchema } from '@/plugins/i18n';
import type { TabType, DisplayMode, IWebClock } from './_types';

// Store
const store = useWorktimeStore();
const { t } = useI18n<{ message: MessageSchema }>();

// Composables
const { currentQuery, changeTab } = useWorktimeQuery();

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

const teams = computed(() => store.getTeams);
const individuals = computed(() => store.getIndividuals);

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

    if (currentQuery.value.view === 'individual' && currentQuery.value.memberId) {
      // Fetch individual data
      await store.fetchEmployeeData({
        Perspective: currentQuery.value.perspective,
        Interval: currentQuery.value.interval,
        MemberId: currentQuery.value.memberId,
      });

      if (store.getEmployeeError) {
        errorMessage.value = store.getEmployeeError;
      }
    } else {
      // Fetch section data (team or employees view)
      await store.fetchSectionData({
        Perspective: currentQuery.value.perspective,
        Interval: currentQuery.value.interval,
        TeamId: currentQuery.value.teamId || null,
      });

      if (store.getSectionError) {
        errorMessage.value = store.getSectionError;
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = 'An unexpected error occurred while fetching data.';
  }
};

const handleDownload = () => {
  // TODO: Implement download functionality
  console.log('Download report clicked');
};

const handleToggleDomain = (webClock: IWebClock, newDomain: number) => {
  // TODO: Implement domain toggle API call
  console.log('Toggle domain:', webClock, newDomain);
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
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.worktime-usage-v2 {
  min-height: 100vh;
}
</style>

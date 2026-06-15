<template>
  <div class="worktime-usage-v2">
    <Message
      v-if="view.errorMessage.value"
      :message="view.errorMessage.value"
      severity="error"
      class="mb-6"
      @close="view.errorMessage.value = null"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      <div class="lg:col-span-2">
        <UserBadge :card="view.currentCard.value" :is-loading="view.isLoading.value" />
      </div>
      <div class="lg:col-span-10">
        <Summary
          :breadcrumb-items="view.currentBreadcrumb.value"
          :summary-items="view.currentSummary.value"
          :is-loading="view.isLoading.value"
          @download="view.handleDownload"
        />
      </div>
    </div>

    <div>
      <Card class="shadow-lg border rounded-2xl overflow-hidden transition-colors
                   border-border-secondary dark:border-border-primary">
        <template #content>
          <Tabs v-model:value="view.activeTabIndex.value">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-border-secondary dark:border-border-primary transition-colors">
              <TabList class="flex-1">
                <Tab
                  v-for="tab in view.availableTabs.value"
                  :key="tab.key"
                  :value="tab.key"
                  class="font-medium whitespace-nowrap"
                >
                  {{ tab.label }}
                </Tab>
              </TabList>

              <div class="flex items-center gap-2.5 flex-shrink-0">
                <Button
                  v-if="view.showGraphToggleVisible.value"
                  :label="$t('pages.worktimeUsage.showGraph')"
                  icon="pi pi-chart-line"
                  :severity="view.showGraphBelow.value ? 'primary' : 'secondary'"
                  :outlined="!view.showGraphBelow.value"
                  raised
                  class="shadow-sm grow sm:grow-0"
                  @click="view.showGraphBelow.value = !view.showGraphBelow.value"
                />

                <div
                  v-if="view.showTeamToggle.value"
                  class="flex gap-1 p-1 rounded-xl transition-colors
                         bg-surface-tertiary dark:bg-surface-secondary"
                >
                  <Button
                    :label="$t('pages.worktimeUsage.teamLabel')"
                    :severity="view.displayMode.value === 'team' ? 'primary' : 'secondary'"
                    :text="view.displayMode.value !== 'team'"
                    class="rounded-lg"
                    @click="view.displayMode.value = 'team'"
                  />
                  <Button
                    :label="$t('pages.worktimeUsage.employeesLabel')"
                    :severity="view.displayMode.value === 'employees' ? 'primary' : 'secondary'"
                    :text="view.displayMode.value !== 'employees'"
                    class="rounded-lg"
                    @click="view.displayMode.value = 'employees'"
                  />
                </div>
              </div>
            </div>

            <div v-if="view.showGraphBelow.value" class="mt-1">
              <WellBeingGraphTab
                v-if="view.currentQuery.value.tab === 'wellbeing'"
                :graphs="(view.currentWellBeingGraphs.value as unknown as IWellBeingGraph[])"
                :is-loading="view.isLoading.value"
              />
              <GraphTab v-else :graphs="view.currentGraphs.value" :is-loading="view.isLoading.value" />
            </div>

            <TabPanels v-else class="mt-1 !px-0">
              <TabPanel v-if="view.showTab('productivity')" value="productivity">
                <ProductivityTab
                  :view-mode="view.currentQuery.value.view"
                  :display-mode="view.displayMode.value"
                  :teams="view.teams.value"
                  :individuals="view.individuals.value"
                  :is-loading="view.isLoading.value"
                />
              </TabPanel>

              <TabPanel v-if="view.showTab('wellbeing')" value="wellbeing">
                <WellbeingTab
                  :view-mode="view.currentQuery.value.view"
                  :display-mode="view.displayMode.value"
                  :teams="view.teams.value"
                  :individuals="view.individuals.value"
                  :individual-wellbeings="view.currentIndividualWellbeings.value"
                  :is-loading="view.isLoading.value"
                />
              </TabPanel>

              <TabPanel v-if="view.showTab('distribution')" value="distribution">
                <DistributionTab :distributions="view.currentDistributions.value" :is-loading="view.isLoading.value" />
              </TabPanel>

              <TabPanel v-if="view.showTab('webHistory')" value="webHistory">
                <WebHistoryTab
                  :web-clocks="view.currentWebClocks.value"
                  :is-loading="view.isLoading.value"
                  @toggle-domain="view.handleToggleDomain"
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
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';

import Message from './_components/common/Message.vue';
import Summary from './_components/common/Summary.vue';
import UserBadge from './_components/common/UserBadge.vue';
import DistributionTab from './_components/tabs/DistributionTab.vue';
import GraphTab from './_components/tabs/GraphTab.vue';
import ProductivityTab from './_components/tabs/ProductivityTab.vue';
import WebHistoryTab from './_components/tabs/WebHistoryTab.vue';
import WellBeingGraphTab from './_components/tabs/WellBeingGraphTab.vue';
import WellbeingTab from './_components/tabs/WellbeingTab.vue';
import { useWorktimeView } from './_composables';

import type { IWellBeingGraph } from '@/stores/worktimeUsage/worktimeStore';

const view = useWorktimeView();
</script>

<style scoped>
.worktime-usage-v2 {
  min-height: 100vh;
}
</style>

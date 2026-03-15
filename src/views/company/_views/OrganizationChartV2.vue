<template>
  <div class="organization-chart-v2">
    <!-- Toolbar -->
    <OrganizationChartV2Toolbar />

    <!-- Loading State -->
    <Card v-if="isLoading" class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex items-center justify-center py-16">
          <ProgressSpinner />
        </div>
      </template>
    </Card>

    <!-- Organization Chart with Vue Flow -->
    <Card
      v-else-if="nodes.length > 0"
      class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors"
    >
      <template #content>
        <div class="vue-flow-container" style="height: 600px;">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :default-viewport="{ x: 0, y: 0, zoom: 0.8 }"
            :min-zoom="0.3"
            :max-zoom="1.5"
            :nodes-draggable="false"
            :nodes-connectable="false"
            :selectable="false"
            fit-view-on-init
            class="org-flow"
          >
            <!-- Custom Node Template -->
            <template #node-organization="nodeProps">
              <OrganizationChartV2Node v-bind="nodeProps" />
            </template>

            <!-- Controls -->
            <Controls position="bottom-right" />

            <!-- MiniMap -->
            <MiniMap
              position="bottom-left"
              :pannable="true"
              :zoomable="true"
              class="!bg-surface-secondary !border-border-secondary dark:!border-border-primary"
            />

            <!-- Background -->
            <Background :gap="20" :size="1" pattern-color="#e5e7eb" />
          </VueFlow>
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-else class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex flex-col items-center justify-center py-16 text-content-tertiary">
          <i class="pi pi-sitemap text-5xl mb-4" />
          <p class="text-lg">{{ t('pages.company.organizationChart.emptyState') }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';

import OrganizationChartV2Node from '../_components/organizationChartV2/OrganizationChartV2Node.vue';
import OrganizationChartV2Toolbar from '../_components/organizationChartV2/OrganizationChartV2Toolbar.vue';
import {
  convertToFlowElements,
  type OrganizationFlowEdge,
  type OrganizationFlowNode,
} from '../_types/organizationChartV2';

// Import Vue Flow styles
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import type { MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage } = useFToast();
const store = useCompanyOrganizationChartsStore();

// State
const isLoading = ref(false);
const nodes = ref<OrganizationFlowNode[]>([]);
const edges = ref<OrganizationFlowEdge[]>([]);

// Methods
const fetchData = async () => {
  try {
    isLoading.value = true;
    await store.filter();

    if (store.list && store.list.length > 0) {
      const flowElements = convertToFlowElements(store.list);
      nodes.value = flowElements.nodes;
      edges.value = flowElements.edges;
    }
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.organization-chart-v2 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vue-flow-container {
  background: linear-gradient(135deg, var(--color-surface-secondary) 0%, var(--color-surface-tertiary) 100%);
  border-radius: 0.5rem;
}

/* Vue Flow custom styles */
:deep(.vue-flow) {
  background: transparent;
}

:deep(.vue-flow__node) {
  cursor: default;
}

:deep(.vue-flow__edge-path) {
  stroke: var(--color-border-secondary);
  stroke-width: 2;
}

:deep(.vue-flow__controls) {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-secondary);
  background: var(--color-surface-primary);
}

:deep(.vue-flow__controls-button) {
  background: var(--color-surface-primary);
  border: none;
  width: 28px;
  height: 28px;
  color: var(--color-content-primary);
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--color-interactive-hover);
}

:deep(.vue-flow__minimap) {
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>

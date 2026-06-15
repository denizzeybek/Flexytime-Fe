<template>
  <div class="organization-chart-v2">
    <div class="w-full d-flex items-end">
      <Button
        class="w-fit"
        :label="t('pages.company.organizationChartV2.buttons.addRootTeam')"
        icon="pi pi-plus"
        severity="primary"
        @click="chart.handleAddRootNode"
      />
    </div>
    <Card v-if="chart.isLoading.value" class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex items-center justify-center py-16">
          <ProgressSpinner />
        </div>
      </template>
    </Card>

    <Card
      v-else-if="chart.nodes.value.length > 0"
      class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl overflow-hidden transition-colors"
    >
      <template #content>
        <div class="vue-flow-container" style="height: 600px;">
          <VueFlow
            v-model:nodes="chart.nodes.value"
            v-model:edges="chart.edges.value"
            :default-viewport="{ x: 0, y: 0, zoom: 0.8 }"
            :min-zoom="0.3"
            :max-zoom="1.5"
            :nodes-draggable="false"
            :nodes-connectable="false"
            :selectable="false"
            fit-view-on-init
            class="org-flow"
          >
            <template #node-organization="nodeProps">
              <OrganizationChartV2Node v-bind="nodeProps" />
            </template>
            <Controls position="bottom-right" />
            <MiniMap
              position="bottom-left"
              :pannable="true"
              :zoomable="true"
              class="!bg-surface-secondary !border-border-secondary dark:!border-border-primary"
            />
            <Background :gap="20" :size="1" pattern-color="#e5e7eb" />
          </VueFlow>
        </div>
      </template>
    </Card>

    <Card v-else class="shadow-lg border border-border-secondary dark:border-border-primary rounded-2xl transition-colors">
      <template #content>
        <div class="flex flex-col items-center justify-center py-16 text-content-tertiary gap-4">
          <i class="pi pi-sitemap text-5xl" />
          <p class="text-lg">{{ t('pages.company.organizationChart.emptyState') }}</p>
          <Button
            :label="t('pages.company.organizationChartV2.buttons.addFirstTeam')"
            icon="pi pi-plus"
            severity="primary"
            @click="chart.handleAddRootNode"
          />
        </div>
      </template>
    </Card>

    <NodeEditDialog
      v-model:visible="chart.showEditDialog.value"
      :node="chart.selectedNode.value"
      :mode="chart.dialogMode.value"
      @save="chart.handleSaveNode"
    />

    <OrganizationChartDeleteDialog
      :visible="chart.showDeleteDialog.value"
      :node="chart.nodeToDelete.value"
      @update:visible="chart.showDeleteDialog.value = $event"
      @confirm="chart.confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';

import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

import { useOrganizationChart } from '@/views/company/_composables/useOrganizationChart';

import NodeEditDialog from '../_components/organizationChart/NodeEditDialog.vue';
import OrganizationChartDeleteDialog from '../_components/organizationChart/OrganizationChartDeleteDialog.vue';
import OrganizationChartV2Node from '../_components/organizationChartV2/OrganizationChartV2Node.vue';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

import type { MessageSchema } from '@/plugins/i18n';

const { t } = useI18n<{ message: MessageSchema }>();
const chart = useOrganizationChart();
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
  border-bottom: 1px solid var(--color-border-secondary);
  width: 28px;
  height: 28px;
  color: var(--color-content-primary);
  fill: var(--color-content-primary);
}

:deep(.vue-flow__controls-button svg),
:deep(.vue-flow__controls-button svg path) {
  fill: currentColor;
}

:deep(.vue-flow__controls-button:hover) {
  background: var(--color-interactive-hover);
}

:deep(.vue-flow__minimap) {
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>

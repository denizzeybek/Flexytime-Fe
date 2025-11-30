<template>
  <div class="organization-chart-v2">
    <!-- Header with search and actions -->
    <OrganizationChartToolbar
      :search-query="searchQuery"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :expand-all="expandAll"
      @update:search-query="searchQuery = $event"
      @undo="handleUndo"
      @redo="handleRedo"
      @toggle-expand-all="toggleExpandAll"
      @add-root-node="handleAddRootNode"
    />

    <!-- Organization Tree -->
    <Card v-if="!isLoading && filteredOrganizationList.length > 0" class="shadow-lg border border-gray-100 rounded-2xl overflow-hidden">
      <template #content>
        <div class="organization-tree">
          <OrganizationNodeV2
            v-for="node in filteredOrganizationList"
            :key="node.ID"
            :node="node"
            :depth="0"
            :expanded-nodes="expandedNodes"
            :search-query="searchQuery"
            :drag-over-node-id="dragOverNodeId"
            @edit="handleEditNode"
            @delete="handleDeleteNode"
            @add-child="handleAddChild"
            @toggle-expand="handleToggleExpand"
            @drag-start="handleDragStart"
            @drag-over="handleDragOver"
            @drag-leave="handleDragLeave"
            @drop="handleDrop"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3 pt-5 border-t border-gray-100">
          <Button
            :label="t('pages.company.organizationChartV2.buttons.cancel')"
            severity="secondary"
            outlined
            @click="handleCancel"
          />
          <Button
            :label="t('pages.company.organizationChartV2.buttons.save')"
            icon="pi pi-save"
            :loading="isSaving"
            @click="handleSave"
          />
        </div>
      </template>
    </Card>

    <!-- Empty State -->
    <OrganizationChartEmptyState
      v-else-if="!isLoading && filteredOrganizationList.length === 0"
      :has-search-query="!!searchQuery"
      @add-root-node="handleAddRootNode"
    />

    <!-- Loading State -->
    <Card v-if="isLoading" class="shadow-lg border border-gray-100 rounded-2xl">
      <template #content>
        <div class="text-center py-12">
          <ProgressSpinner />
        </div>
      </template>
    </Card>

    <!-- Edit/Add Dialog -->
    <NodeEditDialog
      v-model:visible="showEditDialog"
      :node="selectedNode"
      :mode="dialogMode"
      @save="handleSaveNode"
    />

    <!-- Delete Confirmation -->
    <OrganizationChartDeleteDialog
      :visible="showDeleteDialog"
      :node="nodeToDelete"
      @update:visible="showDeleteDialog = $event"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFToast } from '@/composables/useFToast';
import { type MessageSchema } from '@/plugins/i18n';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';
import NodeEditDialog from '@/views/company/_components/organizationChart/NodeEditDialog.vue';
import OrganizationChartDeleteDialog from '@/views/company/_components/organizationChart/OrganizationChartDeleteDialog.vue';
import OrganizationChartEmptyState from '@/views/company/_components/organizationChart/OrganizationChartEmptyState.vue';
import OrganizationChartToolbar from '@/views/company/_components/organizationChart/OrganizationChartToolbar.vue';
import OrganizationNodeV2 from '@/views/company/_components/organizationChart/OrganizationNodeV2.vue';
import { useOrganizationChart } from '@/views/company/_composables/useOrganizationChart';

const { t } = useI18n<{ message: MessageSchema }>();
const { showErrorMessage, showSuccessMessage } = useFToast();
const organizationsStore = useCompanyOrganizationChartsStore();

// Local state for API operations
const isLoading = ref(false);
const isSaving = ref(false);

// Use composable for all organization chart logic
const {
  organizationList,
  originalOrganizationList,
  searchQuery,
  expandedNodes,
  expandAll,
  filteredOrganizationList,
  showEditDialog,
  showDeleteDialog,
  selectedNode,
  nodeToDelete,
  dialogMode,
  canUndo,
  canRedo,
  dragOverNodeId,
  toggleExpandAll,
  handleToggleExpand,
  handleAddRootNode,
  handleAddChild,
  handleEditNode,
  handleDeleteNode,
  confirmDelete,
  handleSaveNode,
  handleUndo,
  handleRedo,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleCancel,
  setOrganizationList,
} = useOrganizationChart();

// API Operations
const handleSave = async () => {
  try {
    isSaving.value = true;
    const payload = {
      Nodes: organizationList.value,
    };
    await organizationsStore.save(payload);
    showSuccessMessage(t('pages.company.organizationChartV2.messages.saved'));
    await fetchOrganizationChart();
    originalOrganizationList.value = JSON.parse(JSON.stringify(organizationList.value));
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isSaving.value = false;
  }
};

const fetchOrganizationChart = async () => {
  try {
    isLoading.value = true;
    await organizationsStore.filter();
    setOrganizationList(organizationsStore.list);
  } catch (error) {
    showErrorMessage(error as Error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchOrganizationChart();
});
</script>

<style scoped lang="scss">
.organization-chart-v2 {
  @apply space-y-4;
}

.organization-tree {
  @apply space-y-2;
}
</style>

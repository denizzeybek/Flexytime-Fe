<template>
  <div
    class="org-node flex flex-col items-center p-3 rounded-xl transition-all duration-200 bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
  >
    <!-- Drag Handle -->
    <Handle type="target" :position="Position.Top" class="!bg-gray-300 !w-3 !h-1.5 !rounded-full !border-0" />

    <!-- Avatar -->
    <Avatar
      :label="avatarLabel"
      class="mb-2 !w-10 !h-10 !text-sm font-semibold bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700"
      shape="circle"
    />

    <!-- Content -->
    <div class="text-center w-full max-w-[140px]">
      <p
        class="font-semibold text-gray-900 text-xs mb-0.5 truncate"
        :title="nodeData.label"
      >
        {{ nodeData.label }}
      </p>

      <p
        v-if="nodeData.memberName"
        class="text-[10px] text-gray-500 mb-1 truncate"
        :title="nodeData.memberName"
      >
        {{ nodeData.memberName }}
      </p>

      <Tag
        v-if="nodeData.titleName"
        :value="nodeData.titleName"
        severity="info"
        class="!text-[9px] !px-1.5 !py-0.5"
      />
    </div>

    <!-- Source Handle -->
    <Handle type="source" :position="Position.Bottom" class="!bg-gray-300 !w-3 !h-1.5 !rounded-full !border-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';

import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';

import type { IOrganizationNodeData } from '../../_types/organizationChartV2';
import type { NodeProps } from '@vue-flow/core';

// Vue Flow passes NodeProps to custom nodes
const props = defineProps<NodeProps<IOrganizationNodeData>>();

// Extract data safely
const nodeData = computed(() => props.data as IOrganizationNodeData);

const avatarLabel = computed(() => {
  const data = nodeData.value;
  if (!data) return '?';

  if (data.abbreviation) {
    return data.abbreviation.substring(0, 2).toUpperCase();
  }

  const name = data.label || data.memberName || '';
  if (!name) return '?';

  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});
</script>

<style scoped>
.org-node {
  position: relative;
  min-width: 150px;
}
</style>

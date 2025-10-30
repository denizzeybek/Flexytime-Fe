<template>
  <Card class="w-full h-full">
    <template #content>
      <div class="flex flex-col justify-between h-full flex-1 gap-4">
        <div
          class="flex md:flex-row flex-col justify-between md:items-center items-start gap-2 md:gap-0 w-full"
        >
          <Breadcrumb :items="breadcrumbItems" :is-loading="isLoading" />
          <ActionsBar @download="handleDownload" />
        </div>
        <div>
          <BadgeGroup :summary="summaryItems" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Breadcrumb from './Breadcrumb.vue';
import ActionsBar from './ActionsBar.vue';
import BadgeGroup from './BadgeGroup.vue';
import type { IBreadcrumb, ISummary } from '../../_types';

interface IProps {
  breadcrumbItems?: IBreadcrumb[];
  summaryItems?: ISummary[];
  isLoading?: boolean;
}

interface IEmits {
  (e: 'download'): void;
}

const props = withDefaults(defineProps<IProps>(), {
  breadcrumbItems: () => [],
  summaryItems: () => [],
  isLoading: false,
});

const emit = defineEmits<IEmits>();

const handleDownload = () => {
  emit('download');
};
</script>

<style scoped>
@reference "@/custom-tailwind.css";
:deep(.p-card-content) {
  @apply !h-full;
}
:deep(.p-card-body) {
  @apply !h-full;
}
</style>

<template>
  <div class="hidden sm:block h-full">
    <Card class="h-full flex flex-col shadow-lg border border-gray-100 hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">
      <template #footer>
        <div class="flex flex-col items-center justify-center gap-3.5 flex-1 py-2">
          <template v-if="isLoading">
            <Skeleton shape="circle" size="5rem" class="mr-2" />
            <Skeleton height="1.25rem" class="w-28" />
          </template>
          <template v-else-if="card">
            <div class="relative">
              <Avatar
                v-if="card.ImageUrl"
                :image="card.ImageUrl"
                size="xlarge"
                shape="circle"
                class="border-2 border-gray-200"
              />
              <Avatar
                v-else
                :label="card.Abbreviation"
                size="xlarge"
                shape="circle"
                class="border-2 border-gray-200"
              />
            </div>
            <div class="text-center px-3">
              <div class="text-base font-semibold text-gray-800 mb-1">{{ card.Name }}</div>
              <div v-if="card.Title" class="text-sm text-gray-500">
                {{ card.Title }}
              </div>
            </div>
          </template>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';

import type { ICard } from '../../_types';

interface IProps {
  card?: ICard | null;
  isLoading?: boolean;
}

withDefaults(defineProps<IProps>(), {
  card: null,
  isLoading: false,
});
</script>

<template>
  <div class="hidden sm:block h-full">
    <Card class="h-full flex flex-col shadow-lg border hover:shadow-xl transition-all rounded-2xl overflow-hidden
                 border-border-secondary dark:border-border-primary">
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
                class="border-2 border-border-primary"
              />
              <Avatar
                v-else
                :label="getAvatarLabel(card.Name)"
                size="xlarge"
                shape="circle"
                class="border-2 border-border-primary"
              />
            </div>
            <div class="text-center px-3">
              <div class="text-base font-semibold text-content-primary mb-1">{{ card.Name }}</div>
              <div v-if="card.Title" class="text-sm text-content-tertiary">
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

import { getAvatarLabel } from '@/helpers/utils';

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

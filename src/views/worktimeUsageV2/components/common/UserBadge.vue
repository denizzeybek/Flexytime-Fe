<template>
  <div class="hidden sm:block h-full">
    <Card class="w-40 h-full flex flex-col">
      <template #footer>
        <div class="flex flex-col items-center justify-center gap-3 flex-1">
          <template v-if="isLoading">
            <Skeleton shape="circle" size="4rem" class="mr-2" />
            <Skeleton height="1rem" />
          </template>
          <template v-else-if="card">
            <Avatar
              v-if="card.ImageUrl"
              :image="card.ImageUrl"
              size="xlarge"
              shape="circle"
            />
            <Avatar
              v-else
              :label="card.Abbreviation"
              size="xlarge"
              shape="circle"
            />
            <div class="text-md text-center font-medium">{{ card.Name }}</div>
            <div v-if="card.Title" class="text-sm text-center text-gray-600">
              {{ card.Title }}
            </div>
          </template>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';
import Card from 'primevue/card';
import type { ICard } from '../../types';

interface IProps {
  card?: ICard | null;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  card: null,
  isLoading: false,
});
</script>

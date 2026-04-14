<template>
  <div
    class="cursor-pointer h-full"
    @click="emit('select', plan)"
  >
    <!-- Main Card -->
    <div
      class="rounded-3xl p-8 h-full flex flex-col transition-all duration-200 relative"
      :class="[
        selected
          ? 'bg-purple-100 dark:bg-purple-950/40'
          : 'ring-1 ring-border-secondary dark:ring-border-primary hover:ring-border-focus bg-surface-primary',
      ]"
    >
      <!-- Badge (absolute so it doesn't affect layout) -->
      <span
        v-if="plan.recommended"
        class="absolute top-8 right-6 rounded-full bg-yellow-500 px-2.5 py-1 text-xs text-center font-semibold leading-5 text-white"
      >
        {{ t('pages.payment.recommended') }}
      </span>

      <!-- Header: Plan Name -->
      <h3
        class="text-lg font-semibold leading-8"
        :class="[selected || plan.recommended ? 'text-primary' : 'text-content-primary']"
      >
        {{ plan.name }}
      </h3>

      <!-- Description -->
      <p class="mt-4 text-sm leading-6 text-content-secondary min-h-[3rem]">
        {{ plan.description }}
      </p>

      <!-- Price -->
      <p class="mt-6 flex items-baseline gap-x-1">
        <span
          class="text-5xl font-bold tracking-tight text-content-primary"
        >
          ${{ plan.price }}
        </span>
        <span class="text-sm font-semibold leading-6 text-content-secondary">
          /{{ t('pages.payment.mo') }}
        </span>
      </p>

      <!-- Features -->
      <ul
        role="list"
        class="mt-8 space-y-3 text-sm leading-6 text-content-secondary flex-grow"
      >
        <li
          v-for="feature in plan.features"
          :key="feature"
          class="flex gap-x-3"
        >
          <i class="pi pi-check flex-none text-sm text-primary"></i>
          {{ feature }}
        </li>
      </ul>

      <!-- CTA Button -->
      <Button
        :label="selected ? t('pages.payment.selected') : t('pages.payment.selectPlan')"
        class="mt-8 w-full"
        
        :outlined="!selected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';

import type { PricingPlan } from '@/customClient';

interface IProps {
  plan: PricingPlan;
  selected?: boolean;
}

interface IEmits {
  (e: 'select', plan: PricingPlan): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();

const { t } = useI18n<{ message: MessageSchema }>();
</script>

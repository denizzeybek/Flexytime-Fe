<template>
  <!--
    Site-wide modal action footer.

    Pattern (per design convention):

        [leading slot — destructive (Delete / Disconnect)] ......... [Cancel] [Save]

    - Default slot holds the right-aligned action pair (Cancel + primary).
    - `leading` slot is for a destructive secondary (Delete / Disconnect / etc.)
      that should sit on the LEFT, away from the safe action pair.
    - Read-only / confirm-only modals (single "OK") can pass just one button
      into the default slot.

    Rendering:
      <div class="flex items-center gap-3 pt-4">
        <div class="leading">       ← destructive (optional)
        <div class="ml-auto pair">  ← Cancel + Save, right-aligned
      </div>

    The `ml-auto` on the trailing wrapper handles both layouts:
    - With leading slot:    [Delete] ............... [Cancel] [Save]
    - Without leading slot:                          [Cancel] [Save]
  -->
  <div class="flex items-center gap-3 pt-4">
    <div v-if="hasLeading" class="flex items-center gap-3">
      <slot name="leading" />
    </div>
    <div class="ml-auto flex items-center gap-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();

const hasLeading = computed(() => !!slots.leading);
</script>

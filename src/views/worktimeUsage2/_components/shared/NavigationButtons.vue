<template>
  <div v-if="navigationItems.length > 0" class="grid grid-cols-1 lg:grid-cols-2 items-center gap-2 lg:gap-12 my-5">
    <div class="flex space-x-4">
      <template v-for="(item, idx) in navigationItems" :key="idx">
        <Button
          :label="item.label"
          :icon="item.icon"
          :variant="isNavItemActive(item) ? undefined : 'outlined'"
          @click="handleItemClick(item)"
          severity="primary"
        />
      </template>
    </div>

    <div class="flex justify-center lg:justify-end">
      <SelectButton
        v-if="showProductivitySelector"
        class="col-span-2 flex justify-end"
        v-model="productivityViewType"
        :options="productivityOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { computed, ref, watch, inject } from 'vue';
import { useWorktimeNavigation } from '../../_composables/useWorktimeNavigation';

const { 
  isTeamView, 
  navigationItems, 
  handleNavigation, 
  isNavItemActive 
} = useWorktimeNavigation();

const productivityViewType = ref('Teams');
const productivityOptions = ref(['Employees', 'Teams']);

const showProductivitySelector = computed(() => isTeamView.value);

const handleItemClick = (item: any) => {
  if (item.label === 'Productivity') {
    // SelectButton değerine göre viewType belirle (sadece team view'da geçerli)
    const viewType = productivityViewType.value === 'Employees' ? 'individual' : 'team';
    handleNavigation(item, viewType);
  } else {
    handleNavigation(item);
  }
};

watch(productivityViewType, () => {
  if (isTeamView.value) {
    const productivityItem = navigationItems.value.find(item => item.label === 'Productivity');
    if (productivityItem) {
      handleItemClick(productivityItem);
    }
  }
});
</script>
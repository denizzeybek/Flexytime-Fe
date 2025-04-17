<template>
  <div class="grid grid-cols-2 items-center gap-12 my-5">
    <div class="flex space-x-4">
      <template v-for="(buttonProp, idx) in buttonProps" :key="idx">
        <Button
          :label="buttonProp.label"
          :icon="buttonProp.icon"
          :variant="isVariantActive(buttonProp)"
          @click="buttonProp.handleClick"
          severity="primary"
          :class="isVariantActive(buttonProp) ? 'col-span-2' : 'col-span-1'"
        />
      </template>
    </div>

    <div class="flex justify-end">
      <SelectButton
        v-if="showSelectButton"
        class="col-span-2 flex justify-end"
        v-model="selectButtonValue"
        :options="selectButtonOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ERouteNames } from '@/router/routeNames.enum';

interface IButtonProps {
  label: string;
  routes: string[];
  icon: string;
  handleClick: () => void;
}

type ButtonVariant = 'outlined' | 'text' | undefined;

const route = useRoute();
const router = useRouter();

const selectButtonValue = ref('Teams');
const selectButtonOptions = ref(['Employees', 'Teams']);

const showSelectButton = computed(() => {
  if (
    route.name === ERouteNames.WorktimeUsageProductivityIndividuals ||
    route.name === ERouteNames.WorktimeUsageProductivityTeam
  ) {
    return true;
  }
  return false;
});

const buttonProps = computed<IButtonProps[]>(() => {
  return [
    {
      label: 'Productivity',
      routes: ['productivity-team', 'productivity-individuals'],
      icon: 'pi pi-face-smile',
      handleClick: () => {
        handleProductivityButtonRoute();
      },
    },
    {
      label: 'Distribution',
      routes: ['distribution'],
      icon: 'pi pi-chart-pie',
      handleClick: () => {
        router.push({ name: ERouteNames.WorktimeUsageDistribution });
      },
    },
    {
      label: 'Graph',
      routes: ['productivity-graph'],
      icon: 'pi pi-chart-bar',
      handleClick: () => {
        router.push({ name: ERouteNames.WorktimeUsageProductivityGraph });
      },
    },
  ];
});

const path = computed(() => {
  return route.path.split('/clock/section/')[1];
});

const isVariantActive = (buttonProp: IButtonProps): ButtonVariant => {
  if (buttonProp.routes.includes(path.value)) {
    return 'outlined';
  }
  return undefined;
};

const handleProductivityButtonRoute = () => {
  if (selectButtonValue.value === 'Employees') {
    router.push({ name: ERouteNames.WorktimeUsageProductivityIndividuals });
    return;
  }
  router.push({ name: ERouteNames.WorktimeUsageProductivityTeam });
  return;
};

watch(selectButtonValue, () => {
  handleProductivityButtonRoute();
});
</script>

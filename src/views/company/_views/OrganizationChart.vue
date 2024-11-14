<template>
  <Card>
    <template #header>
      <li
        class="items-center hidden gap-2 px-12 py-4 text-lg lg:ml-4 font-normal rounded-lg lg:grid-rows-1 lg:grid text-r-secondary lg:grid-cols-8"
      >
        <div class="lg:col-span-2 lg:ml-4">Team Name</div>
        <div class="lg:col-span-2 lg:ml-4">Member Name</div>
        <div class="text-center lg:col-span-2">Title</div>
        <div></div>
        <!---->
        <div></div>
      </li>
    </template>
    <template #content>
      <div v-for="team in organizationList" :key="team.ID">
        <ul class="flex flex-col gap-2">
          <OrganizationItem
            :model="team"
            @item-change="onItemChange($event)"
            @item-remove="onItemRemove($event)"
          />
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <Button @click="handleAddTeam" icon="pi pi-plus" label="Add Team" />
        <Button severity="info" label="Save" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { IOrganizationChartNodes } from '@/interfaces/company/organizationChart';
import OrganizationItem from '@/views/company/_components/organizationChart/OrganizationItem.vue';
import { useFToast } from '@/composables/useFToast';
import { useCompanyOrganizationChartsStore } from '@/stores/company/organizationChart';

const { showErrorMessage } = useFToast();
const organizationsStore = useCompanyOrganizationChartsStore();

const organizationList = ref<IOrganizationChartNodes[]>([]);

const isLoading = ref(false);

const handleAddTeam = () => {
  organizationList.value.push({
    children: [],
    title: 'New Item',
  });
};

const onItemChange = (item: IOrganizationChartNodes) => {
  organizationList.value = recursiveReplaceById(organizationList.value, item.ID, item);
};

const recursiveReplaceById = (data, targetId, newData) => {
  // Map over the array of objects (data structure)
  return data.map((item) => {
    // If the current item's ID matches the target ID, replace the entire object with newData
    if (item.ID === targetId) {
      return { ...newData };
    }

    // If the current object has children, recursively call the function on the children
    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children = recursiveReplaceById(item.children, targetId, newData);
    }

    // Return the (possibly modified) object
    return item;
  });
};

const onItemRemove = (ID: string) => {
  organizationList.value = recursiveRemoveItemById(organizationList.value, ID);
};

const recursiveRemoveItemById = (data, targetId) => {
  const result = data.slice();

  // Traverse the array from the end to the start
  for (let i = result.length - 1; i >= 0; i--) {
    const item = result[i];

    // If the current item's ID matches the target ID, remove it
    if (item.ID === targetId) {
      result.splice(i, 1);
    } else if (Array.isArray(item.children) && item.children.length > 0) {
      // If the item has children, recursively call the function on its children
      item.children = recursiveRemoveItemById(item.children, targetId);
    }
  }

  return result;
};

const fetchOrganizationChart = async () => {
  try {
    isLoading.value = true;
    await organizationsStore.filter();
    isLoading.value = false;
  } catch (error) {
    showErrorMessage(error as any);
  }
};

watch(
  () => organizationsStore.list,
  (data) => {
    organizationList.value = data;
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  fetchOrganizationChart();
});
</script>

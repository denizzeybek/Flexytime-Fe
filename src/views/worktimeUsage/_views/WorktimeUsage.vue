<template>
  <div>
    <FSelect
      v-model="country"
      label="Country"
      name="country"
      placeholder="Select country"
      :options="countries"
    >
      <template #customFooter>
        <div class="p-3">
          <Button label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" />
        </div>
      </template>
      <template #customDropdownIcon>
        <i class="pi pi-map" />
      </template>
    </FSelect>
  </div>
  country: {{ country }}
  <br /><br /><br /><br />
  <div>
    <FMultiSelect name="countries" v-model="countryList" :options="options">
      <template #customHeader>Header Section</template>
      <template #customFooter>
        <div class="p-3 flex justify-between">
          <Button label="Add New" severity="secondary" text size="small" icon="pi pi-plus" />
          <Button label="Remove All" severity="danger" text size="small" icon="pi pi-times" />
        </div>
      </template>
    </FMultiSelect>
  </div>
  countryList: {{ countryList }}
</template>

<script setup lang="ts">
import { ref } from 'vue';

const country = ref(null);
const countries = ref([
  { name: 'Australia', value: 'AU', icon: 'pi pi-check' },
  { name: 'Brazil', value: 'BR', icon: 'pi pi-times' },
  { name: 'China', value: 'CN', icon: 'pi pi-search' },
  { name: 'Egypt', value: 'EG', icon: 'pi pi-user' },
  { name: 'France', value: 'FR', icon: 'pi pi-bars' },
  { name: 'Germany', value: 'DE', icon: 'pi pi-bell' },
  { name: 'India', value: 'IN', icon: 'pi pi-box' },
  { name: 'Japan', value: 'JP', icon: 'pi pi-calendar' },
  { name: 'Spain', value: 'ES', icon: 'pi pi-cart-minus' },
]);

const countryList = ref([]);
const options = ref([
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'China', code: 'CN' },
  { name: 'Egypt', code: 'EG' },
  { name: 'France', code: 'FR' },
  { name: 'Germany', code: 'DE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Spain', code: 'ES' },
  { name: 'United States', code: 'US' },
]);
</script>

<style scoped></style>

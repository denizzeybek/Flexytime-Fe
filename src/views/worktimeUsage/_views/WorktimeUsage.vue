<template>
  <div class="card flex justify-center flex-col">
    <div>selectedCountry: {{ selectedCountry }}</div>
    <FSelect v-model="selectedCountry" label="country" name="country" placeholder="select country" :options="countries"/>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedCountry = ref();
const countries = ref([
  { name: 'Australia', code: 'AU', icon: 'pi pi-check' },
  { name: 'Brazil', code: 'BR', icon: 'pi pi-times' },
  { name: 'China', code: 'CN', icon: 'pi pi-search' },
  { name: 'Egypt', code: 'EG', icon: 'pi pi-user' },
  { name: 'France', code: 'FR', icon: 'pi pi-bars' },
  { name: 'Germany', code: 'DE', icon: 'pi pi-bell' },
  { name: 'India', code: 'IN', icon: 'pi pi-box' },
  { name: 'Japan', code: 'JP', icon: 'pi pi-calendar' },
  { name: 'Spain', code: 'ES', icon: 'pi pi-cart-minus' },
  { name: 'United States', code: 'US', icon: 'pi pi-address-book' },
]);
</script>

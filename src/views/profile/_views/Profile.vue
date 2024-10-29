<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Basic</Tab>
      <Tab value="1">License</Tab>
      <Tab value="2">Communications</Tab>
      <Tab value="3">Password</Tab>
    </TabList>
    <Card>
      <template #content>
        <TabPanels>
          <TabPanel value="0">
            <Basic />
          </TabPanel>
          <TabPanel value="1">
            <License />
          </TabPanel>
          <TabPanel value="2">
            <Communications />
          </TabPanel>
          <TabPanel value="3">
            <Password />
          </TabPanel>
        </TabPanels>
      </template>
    </Card>
  </Tabs>
</template>

<script setup lang="ts">
import Basic from '../_components/Basic.vue';
import Communications from '../_components/Communications.vue';
import License from '../_components/License.vue';
import Password from '../_components/Password.vue';
</script>

<style scoped></style>

<template>
  <div class="flex flex-col gap-4">
    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="teams">
          <span class="font-medium">{{ t('pages.hrSettings.teamsAndTitles.tabs.teams') }}</span>
        </Tab>
        <Tab value="titles">
          <span class="font-medium">{{ t('pages.hrSettings.teamsAndTitles.tabs.titles') }}</span>
        </Tab>
      </TabList>
    </Tabs>

    <TeamsTable v-if="activeTab === 'teams'" />
    <TitlesTable v-else-if="activeTab === 'titles'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';

import { type MessageSchema } from '@/plugins/i18n';

import TeamsTable from './TeamsTable.vue';
import TitlesTable from './TitlesTable.vue';

const { t } = useI18n<{ message: MessageSchema }>();

const activeTab = ref<'teams' | 'titles'>('teams');
</script>

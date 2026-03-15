<template>
  <Dialog
    v-model:visible="open"
    modal
    :header="isEditing ? t('pages.hrSettings.employees.modal.edit') : t('pages.hrSettings.employees.modal.add')"
    class="lg:!w-[700px] !w-full"
    :style="{ width: '50rem' }"
  >
    <!-- v-if ensures component remounts on each open, clearing all form state -->
    <EmployeeModalContent
      v-if="open"
      :data="data"
      @close="open = false"
    />
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type MessageSchema } from '@/plugins/i18n';
import EmployeeModalContent from '@/views/hrSettings/_components/employees/_modals/_components/EmployeeModalContent.vue';

import type { TheMemberViewModel } from '@/client';

interface IProps {
  data?: TheMemberViewModel;
}

const props = defineProps<IProps>();

const { t } = useI18n<{ message: MessageSchema }>();

const open = defineModel<boolean>('open');

const isEditing = computed(() => !!props.data);

</script>

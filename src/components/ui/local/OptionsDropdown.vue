<template>
  <div>
    <Button
      type="button"
      @click="toggle"
      outlined
      aria-haspopup="true"
      severity="secondary"
      aria-controls="overlay_menu"
    >
      <span class="pi pi-ellipsis-v"></span>
    </Button>

    <div class="card flex justify-center">
      <Menu ref="menu" :model="options" :popup="true">
        <template #item="{ item, props }">
          <a
            v-ripple
            class="flex items-center gap-3 px-4 py-2"
            @click.stop.prevent="item.disabled ? null : handleOptionClick(item?.value)"
          >
            <span :class="item.icon" />
            <FText as="p"> {{ item.label }}</FText>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          </a>
        </template>
      </Menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EOptionsDropdown } from '@/enums/optionsDropdown.enum';
import { ref } from 'vue';
import Menu from 'primevue/menu';

interface IOption {
  label: string;
  icon: string;
  value: EOptionsDropdown;
  badge?: number;
  disabled?: boolean;
  onClick?: () => void;
}

interface IProps {
  options: IOption[];
}

defineProps<IProps>();

interface IEmits {
  (event: 'optionClick', option: EOptionsDropdown): void;
}

const emit = defineEmits<IEmits>();

const menu = ref();

const toggle = (event) => {
  menu.value.toggle(event);
};

const handleOptionClick = (value: EOptionsDropdown) => {
  emit('optionClick', value);
};
</script>

<style scoped></style>

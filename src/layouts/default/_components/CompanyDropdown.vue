<template>
  <div class="relative" v-click-outside="close" id="company-dropdown">
    <RButton
      type="button"
      variant="light"
      @click="toggleDropdown"
      className="!py-1 !px-3 border-none !gap-1"
    >
      <RText as="h6" class="overflow-hidden max-w-40 md:max-w-[300px] text-ellipsis">{{
        user?.business?.currentCompany?.name
      }}</RText>
      <span
        class="transition-transform transform rotate-0"
        :class="{ 'rotate-180': isDropdownOpen }"
      >
        <RIcon :name="EIconNames.ChevronDown" :size="24" :color="colors['r-black']" />
      </span>
    </RButton>

    <!-- Dropdown menu -->
    <div
      class="absolute right-0 z-10 hidden md:max-w-sm mt-2 rounded-lg shadow bg-r-white top-full md:w-[384px] w-[330px]"
      :class="{ '!block': isDropdownOpen }"
    >
      <ul>
        <li
          v-for="company in businessCompaniesStore.list"
          :key="company.id"
          :class="{
            '!bg-r-primary/5 !px-6': company.id === currentCompanyId
          }"
          @click.stop="changeHandler(company.id!)"
        >
          <RText
            class="max-w-60 md:max-w-[300px] whitespace-nowrap text-ellipsis overflow-hidden"
            :class="{ '!text-r-primary': company.id === currentCompanyId }"
          >
            {{ company.name }}
          </RText>
          <RText
            class="max-w-60 md:max-w-[300px] whitespace-nowrap text-ellipsis overflow-hidden !text-r-black-40"
          >
            {{ company?.taxId }}
          </RText>
          <RIcon
            v-if="company.id === currentCompanyId"
            :name="EIconNames.Checkmark"
            class="absolute -translate-y-1/2 top-1/2 right-4"
          />
        </li>
      </ul>
    </div>
  </div>
  <Tour v-if="etcStore.isTourShown" />
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum'
import { useRToast } from '@/composables/useRToast'
import { colors } from '@/constants/colors'
import { useBusinessesCompaniesStore } from '@/stores/businesses/companies'
import { useEtcStore } from '@/stores/common/etc'
import { useUsersStore } from '@/stores/common/users'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Tour from './Tour.vue'

const isDropdownOpen = ref(false)

const toast = useRToast()

const etcStore = useEtcStore()
const usersStore = useUsersStore()
const { user } = storeToRefs(usersStore)
const businessCompaniesStore = useBusinessesCompaniesStore()

const currentCompanyId = computed(() => user?.value?.business?.currentCompanyId)

const close = () => (isDropdownOpen.value = false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (etcStore.isTourShown) {
    etcStore.isTourShown = false
  }
}
const changeHandler = async (companyId: number) => {
  try {
    await businessCompaniesStore.setCurrentCompany(companyId)
    close()
    window.location.reload()
  } catch (error) {
    toast.showErrorMessage(error as any)
  }
}
</script>

<style scoped lang="scss">
li {
  @apply mx-2 my-1 px-4 py-2 rounded-lg text-sm text-r-black cursor-pointer hover:bg-r-off-white relative;

  &:first-child {
    @apply mt-2;
  }

  &:last-child {
    @apply mb-2;
  }
}
</style>

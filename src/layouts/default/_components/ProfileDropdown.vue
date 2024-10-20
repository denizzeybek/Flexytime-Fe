<template>
  <div class="relative" v-click-outside="close">
    <RButton type="button" variant="light" @click="isOpen = !isOpen" className="!p-0 border-none">
      <RIcon :name="EIconNames.Profile" :size="32" :color="colors['r-black']" />
    </RButton>

    <!-- Dropdown menu -->
    <div
      class="absolute right-0 z-10 hidden mt-2 rounded-lg shadow bg-r-white top-full w-60"
      :class="{ '!block': isOpen }"
    >
      <div class="flex flex-col px-4 py-3 bg-r-off-white">
        <RText as="h6">{{ user?.firstName }} {{ user?.lastName }}</RText>
        <RText as="p" class="!text-r-black/40 truncate">{{ user?.email }}</RText>
      </div>
      <ul class="pt-1 pb-2" @click="isOpen = false">
        <li
          @click="router.push({ name: ERouteNames.PromoCodes })"
          class="hover:bg-r-off-white active:bg-r-primary/5"
        >
          <RIcon :name="EIconNames.Percent" :color="colors['r-black']" :size="24" />
          <RText as="p">{{ t('common.profile_dropdown.promo_codes') }}</RText>
        </li>

        <li
          @click="router.push({ name: ERouteNames.Settings_Profile })"
          class="hover:bg-r-off-white active:bg-r-primary/5"
        >
          <RIcon :name="EIconNames.Settings" :color="colors['r-black']" :size="24" />
          <RText as="p">{{ t('common.profile_dropdown.settings') }}</RText>
        </li>
        <li @click="logout" class="hover:bg-r-red/10 active:bg-r-red/30 group">
          <RIcon
            :name="EIconNames.Logout"
            :color="colors['r-black']"
            :size="24"
            class="group-hover:[&_path]:!fill-r-red group-active:[&_path]:!fill-r-red"
          />
          <RText as="p" class="group-hover:!text-r-red group-active:!text-r-red">{{
            t('common.profile_dropdown.logout')
          }}</RText>
        </li>
        <hr class="w-full h-px my-2 bg-r-primary/5" />
        <li @click="handleSupport" class="hover:bg-r-off-white active:bg-r-primary/5">
          <RIcon :name="EIconNames.Help" :color="colors['r-black']" :size="24" />
          <RText as="p">{{ t('common.profile_dropdown.support') }}</RText>
        </li>
        <!-- <li class="hover:bg-r-blue/10 active:bg-r-blue/30 group">
          <RIcon
            :name="EIconNames.Comment"
            :color="colors['r-black']"
            :size="24"
            class="group-hover:[&_path]:!fill-r-blue group-active:[&_path]:!fill-r-blue"
          />
          <RText as="p" class="group-hover:!text-r-blue group-active:!text-r-blue">{{
            t('common.profile_dropdown.give_feedback')
          }}</RText>
        </li> -->
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum'
import { useLogout } from '@/composables/useLogout'
import { colors } from '@/constants/colors'
import { handleSupport } from '@/helpers/intercom'
import { type MessageSchema } from '@/plugins/i18n'
import { ERouteNames } from '@/router/routeNames.enum'
import { useUsersStore } from '@/stores/common/users'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const i18n = useI18n<{ message: MessageSchema }>()
const { t } = i18n

const isOpen = ref(false)
const router = useRouter()
const usersStore = useUsersStore()
const { user } = storeToRefs(usersStore)
const { logout } = useLogout()

const close = () => (isOpen.value = false)
</script>

<style scoped lang="scss">
li {
  @apply mx-2 my-0.5 px-2 py-1.5 flex items-center gap-2 rounded-lg cursor-pointer;
}
</style>

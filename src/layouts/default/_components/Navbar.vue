<template>
  <ul class="space-y-2 font-medium max-w-[328px]">
    <NavItem
      v-for="item in navItems"
      :key="item.label"
      :label="item.label"
      :routeName="item.routeName"
      :iconName="item.iconName"
    />
  </ul>
</template>

<script lang="ts" setup>
import { EIconNames } from '@/common/enums/icons.enum'
import type { MessageSchema } from '@/plugins/i18n'
import { ERouteNames } from '@/router/routeNames.enum'
import { useUsersStore } from '@/stores/common/users'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NavItem, { type IProps as INavItem } from './NavItem.vue'

const i18n = useI18n<{ message: MessageSchema }>()
const { t } = i18n

const { isTalent } = storeToRefs(useUsersStore())

const navItems = computed<INavItem[]>(() => [
  {
    label: t('common.sidebar.dashboard'),
    routeName: ERouteNames.Dashboard,
    iconName: EIconNames.Home
  },
  {
    label: t('common.sidebar.invoices'),
    routeName: ERouteNames.Invoices,
    iconName: EIconNames.Invoice
  },
  ...(isTalent.value
    ? [
        {
          label: t('common.sidebar.clients'),
          routeName: ERouteNames.Clients,
          iconName: EIconNames.Client
        }
      ]
    : [
        {
          label: t('common.sidebar.talents'),
          routeName: ERouteNames.Talents,
          iconName: EIconNames.Client
        }
      ]),
  {
    label: t('common.sidebar.projects'),
    routeName: ERouteNames.Projects,
    iconName: EIconNames.Project
  },

  ...(isTalent.value
    ? [
        {
          label: t('common.sidebar.payment_accounts'),
          routeName: ERouteNames.PaymentAccounts,
          iconName: EIconNames.PaymentAccounts
        }
      ]
    : []),
  {
    label: t('common.sidebar.contracts'),
    routeName: ERouteNames.Contracts,
    iconName: EIconNames.Agreement
  }
])
</script>
